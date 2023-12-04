import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@poohnet/hardhat-zksync-deploy";
import "@poohnet/hardhat-zksync-solc";
import "@poohnet/hardhat-zksync-verify";

// import file with Göerli params
const goerli = require("./goerli.json");
const localnet = require("./localnet.json");

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest",
    settings: {},
  },
  solidity: {
    version: "0.8.19",
  },
  defaultNetwork: "localnet",
  networks: {
    // Göerli network
    goerli: {
      url: "https://zksync2-testnet.zksync.dev",
      accounts: [goerli.deployerPrivateKey],
      ethNetwork: "goerli",
      zksync: true,
    },
    localnet: {
      url: localnet.nodeUrl,
      accounts: [localnet.deployerPrivateKey],
      ethNetwork: "http://localhost:8545",
      zksync: true,
    },
  },
};

export default config;
