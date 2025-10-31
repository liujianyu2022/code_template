import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_BNB_TEST_URL = "https://bnb-testnet.g.alchemy.com/v2/x-LGQX6OUFtPhbpKt_JDE_AV_r6DJQ5l"
// const PRIVATE_KEY = "2d10834a1bdfbd05821fa89d50ba99302929124cb6d1f47ccf18f0ad5a0fa481"     // wallet  这是测试时候用的

const ALCHEMY_BNB_MAIN_URL = "https://bnb-mainnet.g.alchemy.com/v2/d2qkHgPg01aAh75I8zqTU"
const PRIVATE_KEY = "9c1e70fe497456e1d55c61e9cfbaa65bb53ea80945acaab1a90cc212fba51d70"    // wallet4 这是正式发布的时候使用的

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    bnbTest: {
      url: ALCHEMY_BNB_TEST_URL,
      accounts: [PRIVATE_KEY]
    },
    bnbMain: {
      url: ALCHEMY_BNB_MAIN_URL,
      accounts: [PRIVATE_KEY]
    }
  },

  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,

      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  // You can customize the different paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"            // customize the path of artifacts     artifacts: "../client/src/contract"
  },
};

export default config;
