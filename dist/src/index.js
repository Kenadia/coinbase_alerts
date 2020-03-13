"use strict";
// Run with e.g.
//
//     while true; do node ./index.js; sleep 5; done
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const util_1 = __importDefault(require("util"));
const child_process = __importStar(require("child_process"));
// Use this env variable to have the trigger go off no matter what.
const TEST_TRIGGER = process.env.TEST_TRIGGER === 'true';
// Script parameters.
const ALERT_FILE = 'future.mp3';
const LOWER_TRIGGER = {
    BTC: 4750.0,
    ETH: 110.0,
};
const UPPER_TRIGGER = {};
const requestOptions = {
    hostname: 'api.coinbase.com',
    port: 443,
    path: '/v2/exchange-rates',
    method: 'GET',
    headers: {
        'content-type': 'application/json',
        'CB-VERSION': '2020-03-12',
    }
};
const exec = util_1.default.promisify(child_process.exec);
async function checkPrice() {
    const raw = await request(requestOptions);
    const data = JSON.parse(raw);
    let log = '';
    let triggered = TEST_TRIGGER;
    const seen = new Set();
    for (const currency in LOWER_TRIGGER) {
        const actual = 1.0 / Number.parseFloat(data.data.rates[currency]);
        log += `${currency}: ${actual}\n`;
        seen.add(currency);
        triggered = triggered || actual <= LOWER_TRIGGER[currency];
    }
    for (const currency in UPPER_TRIGGER) {
        const actual = 1.0 / Number.parseFloat(data.data.rates[currency]);
        if (!(currency in seen)) {
            log += `${currency}: ${actual}\n`;
        }
        triggered = triggered || actual >= UPPER_TRIGGER[currency];
    }
    console.log(log);
    if (triggered) {
        exec(`afplay ${ALERT_FILE}`);
    }
}
async function request(options) {
    return new Promise((resolve, reject) => {
        var req = https_1.default.request(options, function (res) {
            let chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                resolve(Buffer.concat(chunks).toString());
            });
            res.on('error', reject);
        });
        req.end();
    });
}
if (require.main === module) {
    checkPrice().then().catch(console.error);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGdCQUFnQjtBQUNoQixFQUFFO0FBQ0Ysb0RBQW9EOzs7Ozs7Ozs7Ozs7QUFFcEQsa0RBQXlCO0FBQ3pCLGdEQUF1QjtBQUN2Qiw2REFBOEM7QUFFOUMsbUVBQW1FO0FBQ25FLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxLQUFLLE1BQU0sQ0FBQTtBQUV4RCxxQkFBcUI7QUFDckIsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFBO0FBQy9CLE1BQU0sYUFBYSxHQUFpQztJQUNsRCxHQUFHLEVBQUUsTUFBTTtJQUNYLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQTtBQUNELE1BQU0sYUFBYSxHQUFpQyxFQUNuRCxDQUFBO0FBRUQsTUFBTSxjQUFjLEdBQU87SUFDekIsUUFBUSxFQUFFLGtCQUFrQjtJQUM1QixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxvQkFBb0I7SUFDMUIsTUFBTSxFQUFFLEtBQUs7SUFDYixPQUFPLEVBQUU7UUFDUCxjQUFjLEVBQUUsa0JBQWtCO1FBQ2xDLFlBQVksRUFBRSxZQUFZO0tBQzNCO0NBQ0YsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBRS9DLEtBQUssVUFBVSxVQUFVO0lBQ3ZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFFNUIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBO0lBQ1osSUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFBO0lBQzVCLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7SUFFdEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxhQUFhLEVBQUU7UUFDcEMsTUFBTSxNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUNqRSxHQUFHLElBQUksR0FBRyxRQUFRLEtBQUssTUFBTSxJQUFJLENBQUE7UUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNsQixTQUFTLEdBQUcsU0FBUyxJQUFJLE1BQU0sSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDM0Q7SUFFRCxLQUFLLE1BQU0sUUFBUSxJQUFJLGFBQWEsRUFBRTtRQUNwQyxNQUFNLE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ2pFLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsRUFBRTtZQUN2QixHQUFHLElBQUksR0FBRyxRQUFRLEtBQUssTUFBTSxJQUFJLENBQUE7U0FDbEM7UUFDRCxTQUFTLEdBQUcsU0FBUyxJQUFJLE1BQU0sSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDM0Q7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2hCLElBQUksU0FBUyxFQUFFO1FBQ2IsSUFBSSxDQUFDLFVBQVUsVUFBVSxFQUFFLENBQUMsQ0FBQTtLQUM3QjtBQUNILENBQUM7QUFFRCxLQUFLLFVBQVUsT0FBTyxDQUFDLE9BQVc7SUFDaEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJLEdBQUcsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQUc7WUFDNUMsSUFBSSxNQUFNLEdBQVUsRUFBRSxDQUFBO1lBQ3RCLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDM0IsVUFBVSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUN6QyJ9