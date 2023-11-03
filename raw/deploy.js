const { Web3 } = require("web3");
const AWSHttpProvider = require("@aws/web3-http-provider");

// Loading the contract ABI and Bytecode
// (the results of a previous compilation step)
const fs = require("fs");
const { abi, bytecode } = JSON.parse(
  fs.readFileSync("raw/artifacts/Lock.json")
);

async function main() {
  // Configuring the connection to an Ethereum node
  const sigV4SignedEndpoint = new AWSHttpProvider(
    process.env.AMB_HTTP_ENDPOINT
  );
  const web3 = new Web3(sigV4SignedEndpoint);
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    "0x" + process.env.DEVMAINNEW_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);

  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
  contract.options.data = bytecode;

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const lockedAmount = Web3.utils.toWei("0.0000001", "ether");
  const deployTx = contract.deploy({
    arguments: [unlockTime],
  });

  try {
    const deployedContract = await deployTx
      .send({
        from: signer.address,
        gas: "5000000",
        value: lockedAmount,
      })
      .once("transactionHash", (txhash) => {
        console.log(`Mining deployment transaction ...`);
        console.log(`https://goerli.etherscan.io/tx/${txhash}`);
      });
    // The contract is now deployed on chain!
    console.log(
      `Contract deployed at ${deployedContract.options.address} in goerli network`
    );
    console.log(
      `Add LOCK_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`
    );
  } catch (error) {
    console.log('errorrrrrrrrrr', error)
  }
}

require("dotenv").config();
main();
