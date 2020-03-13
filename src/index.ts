// Run with e.g.
//
//     while true; do node ./index.js; sleep 5; done

import https from 'https'
import util from 'util'
import * as child_process from 'child_process'

// Use this env variable to have the trigger go off no matter what.
const TEST_TRIGGER = process.env.TEST_TRIGGER === 'true'

// Script parameters.
const ALERT_FILE = 'future.mp3'
const LOWER_TRIGGER: { [symbol: string]: number } = {
  BTC: 4750.0,
  ETH: 110.0,
}
const UPPER_TRIGGER: { [symbol: string]: number } = {
}

const requestOptions: {} = {
  hostname: 'api.coinbase.com',
  port: 443,
  path: '/v2/exchange-rates',
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    'CB-VERSION': '2020-03-12',
  }
}

const exec = util.promisify(child_process.exec)

async function checkPrice(): Promise<void> {
  const raw = await request(requestOptions)
  const data = JSON.parse(raw)

  let log = ''
  let triggered = TEST_TRIGGER
  const seen = new Set()

  for (const currency in LOWER_TRIGGER) {
    const actual = 1.0 / Number.parseFloat(data.data.rates[currency])
    log += `${currency}: ${actual}\n`
    seen.add(currency)
    triggered = triggered || actual <= LOWER_TRIGGER[currency]
  }

  for (const currency in UPPER_TRIGGER) {
    const actual = 1.0 / Number.parseFloat(data.data.rates[currency])
    if (!(currency in seen)) {
      log += `${currency}: ${actual}\n`
    }
    triggered = triggered || actual >= UPPER_TRIGGER[currency]
  }

  console.log(log)
  if (triggered) {
    exec(`afplay ${ALERT_FILE}`)
  }
}

async function request(options: {}): Promise<string> {
  return new Promise((resolve, reject) => {
    var req = https.request(options, function (res) {
      let chunks: any[] = []
      res.on('data', (chunk: any) => {
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
  checkPrice().then().catch(console.error)
}
