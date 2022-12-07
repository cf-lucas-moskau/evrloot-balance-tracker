// Import the API
const { ApiPromise, WsProvider } = require("@polkadot/api");
const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");

// Known account we want to use (available on dev chain, with funds)
const EVR = "EVKR1X9Lrax14fe9QoKHz7MDCpjKKt6AdDVDkimid15vWem";

async function main() {
  // Create an await for the API
  const api = await ApiPromise.create({ provider: wsProvider });

  // Retrieve the initial balance. Since the call has no callback, it is simply a promise
  // that resolves to the current on-chain value
  let {
    data: { free: previousFree },
    nonce: previousNonce,
  } = await api.query.system.account(EVR);

  console.log(
    `${EVR} has a balance of ${previousFree/1_000_000_000_000}, nonce ${previousNonce}`
  );
  console.log(
    `You may leave this example running and start example 06 or transfer any value to ${EVR}`
  );

  // Here we subscribe to any balance changes and update the on-screen value
  api.query.system.account(
    EVR,
    ({ data: { free: currentFree }, nonce: currentNonce }) => {
      // Calculate the delta
      const change = currentFree.sub(previousFree);

      // Only display positive value changes (Since we are pulling `previous` above already,
      // the initial balance change will also be zero)
      if (!change.isZero()) {
        console.log(`New balance change of ${change}, nonce ${currentNonce}`);

        previousFree = currentFree;
        previousNonce = currentNonce;
      }
    }
  );
}

main().catch(console.error);
