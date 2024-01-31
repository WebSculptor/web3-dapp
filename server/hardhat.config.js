require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { ALCHEMY_HTTP_URL, ACCOUNT_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: ALCHEMY_HTTP_URL,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
  },
};
