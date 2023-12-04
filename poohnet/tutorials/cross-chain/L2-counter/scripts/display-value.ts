import { Contract, Provider } from "zksync-web3";

// Counter contract address and ABI
const COUNTER_ADDRESS = "0x9ED5Dd59f1DAA698DD0dd00D9560704cf9C13De6";
const COUNTER_ABI = require("./counter.json");

async function main() {
  // Initialize the provider
  // const l2Provider = new Provider("https://testnet.era.zksync.dev");
  const l2Provider = new Provider("http://localhost:3050");

  const counterContract = new Contract(
    COUNTER_ADDRESS,
    COUNTER_ABI,
    l2Provider,
  );

  const value = (await counterContract.value()).toString();

  console.log(`The counter value is ${value}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
