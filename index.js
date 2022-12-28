// Import the API
const { ApiPromise, WsProvider } = require("@polkadot/api");
const fs = require('fs');
const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");

// Known account we want to use (available on dev chain, with funds)
const MAINWALLET = "Fr9LwwsCexuadahNaFZFDUNKwAXrh48fc6o7jwsDzGk3kUY";
const TRADINGWALLET = "EVRLRrw92HuGMWLZKP4HTdnEsZ8drWMR8MtgZx5JJyHHTi3";
const ROYALTIEWALLET = "HiR4HGUSJ8HDCi4DQLjutmp5fJg3RK3FHC87LXs8wbMbxaU";

let mainWalletKsm = 0;
let tradingWalletKsm = 0;
let royaltieWalletKsm = 0;

async function main() {
  // Create an await for the API
  const api = await ApiPromise.create({ provider: wsProvider });

  // Retrieve the initial balance. Since the call has no callback, it is simply a promise
  // that resolves to the current on-chain value

  // create a setTimeout that starts at the next full hour
  let now = new Date();
  now.setHours(now.getHours() + 1);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  let timeout = now.getTime() - Date.now();

  console.log("Timeout: " + timeout, "ms = " + timeout / 1000 + "s = " + timeout / 1000 / 60 + "m");

  setTimeout(() => {
    // start the interval
    setInterval(async () => {
      let {
        data: { free: previousFree },
        nonce: previousNonce,
      } = await api.query.system.account(MAINWALLET);
      mainWalletKsm = previousFree/1_000_000_000_000;
    
      let {
        data: { free: previousFree2 },
        nonce: previousNonce2,
      } = await api.query.system.account(TRADINGWALLET);
      tradingWalletKsm = previousFree2/1_000_000_000_000;
    
      let {
        data: { free: previousFree3 },
        nonce: previousNonce3,
      } = await api.query.system.account(ROYALTIEWALLET);
      royaltieWalletKsm = previousFree3/1_000_000_000_000;
      
      let date = new Date();
      date.setHours(date.getHours() + 1);
    
      const content = `${MAINWALLET} has a balance of ${previousFree/1_000_000_000_000}\n` + 
      `${TRADINGWALLET} has a balance of ${previousFree2/1_000_000_000_000}\n` +
      `${ROYALTIEWALLET} has a balance of ${previousFree3/1_000_000_000_000} on ` + date.toDateString() + " " + date.getHours() + ":" + date.getMinutes() + `\n`;
    
      console.log(content);
      fs.appendFile('./test.txt', content, function (err) {
        if (err) throw err;
      });
    }, 1000 * 60 * 60);
  }, timeout);
}

main().catch(console.error);
