import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/WETH.sol/WETH.json";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const CONTRACT_ADDRESS = "0x1908e2BF4a88F91E4eF0DC72f02b8Ea36BEa2319";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const abiString = `[{"inputs":[{"internalType":"uint256","name":"_chainId","type":"uint256"},{"components":[{"components":[{"internalType":"address","name":"facet","type":"address"},{"internalType":"enum Diamond.Action","name":"action","type":"uint8"},{"internalType":"bool","name":"isFreezable","type":"bool"},{"internalType":"bytes4[]","name":"selectors","type":"bytes4[]"}],"internalType":"struct Diamond.FacetCut[]","name":"facetCuts","type":"tuple[]"},{"internalType":"address","name":"initAddress","type":"address"},{"internalType":"bytes","name":"initCalldata","type":"bytes"}],"internalType":"struct Diamond.DiamondCutData","name":"_diamondCut","type":"tuple"}],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"}]`;
  const contractAbi = JSON.parse(abiString);

  // call fallback function without abi information
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractAbi,
    signer
  );
  await contract.fallback({ value: ethers.utils.parseEther("1") });
}
