import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
// @ts-ignore
import AWSHttpProvider from '@aws/web3-http-provider'
import Web3 from "web3";
import { ethers } from "ethers";

dotenv.config();

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

// const baseProvider = new AWSHttpProvider(process.env.AMB_HTTP_ENDPOINT, credentials);
// let provider = new ethers.providers.Web3Provider(baseProvider);

const sigV4SignedEndpoint = new AWSHttpProvider(process.env.AMB_HTTP_ENDPOINT)
const web3 = new Web3(sigV4SignedEndpoint);
console.log('web', web3.currentProvider)

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    goerli: {
      url: "",
    },
  },
};

export default config;
