// import { ParamType } from 'ethers/lib/utils';
// const ParamType = require("ethers/lib/utils");
const fs = require('fs');
const path = require('path');
const util = require('util');
const hre = require("hardhat");
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const encodeParameters = function(
    ethers,
    types,
    values
) {
  const abi = new hre.ethers.utils.AbiCoder();
  return abi.encode(types, values);
}

const wait = async function(ethers, hash, desc, confirmation = 1) {
  if (desc) {
    console.log(`Waiting tx ${hash} . action = ${desc}`);
  } else {
    console.log(`Waiting tx ${hash}`);
  }
  await ethers.provider.waitForTransaction(hash, confirmation);
}

const waitTx = async function(tx, desc, confirmation = 1) {
  if (desc) {
    console.log(`Waiting tx ${tx.hash} . action = ${desc}`);
  } else {
    console.log(`Waiting tx ${tx.hash}`);
  }
  await ethers.provider.waitForTransaction(tx.hash, confirmation);
}

const deployContract = async function(ethers, configContractName, params, groupName ,note= undefined){
  // const path = `../artifacts/contracts/${contractName}.sol/${contractName}.json`;
  // console.info(path);
  // const Json = require(path);

  console.info(`Start to Deploy Contract ${configContractName}`);
  const Contract = await ethers.getContractFactory(configContractName);
  // console.info(`abi =  ${Contract.abi}`,JSON.stringify(Contract));

  let contract;
  if(params){
    contract = await Contract.deploy(...params);
  }else{
    contract = await Contract.deploy();
  }
  // console.info(`abi =  ${contract.abi}`);

  await wait(
      hre.ethers,
      contract.deployTransaction.hash,
      `\nDeploy ${configContractName}  => ${contract.address}`
  );

  const deployments = {
    address : contract.address,
  }

  if(groupName){
    let marketDeployments = {};
    const deploymentPath = path.resolve(__dirname, `../deployments/${hre.network.name}-${groupName}.json`);
    console.info("deploymentPath = ",deploymentPath);
    const fileExist = await isFileExisted(deploymentPath);

    if(fileExist === true){
      const json = await readFile(deploymentPath);
      if(json){
        // console.info("====",json);
        marketDeployments = JSON.parse(json);
      }
    }
    let wtName = configContractName;
    if(note){
      wtName = `${configContractName}-${note}`
    }
    marketDeployments[wtName] = deployments;
    await writeFile(deploymentPath, JSON.stringify(marketDeployments, null, 2));
  }else{
    const deploymentPath = path.resolve(__dirname, `../deployments/${hre.network.name}-${configContractName}.json`);
    await writeFile(deploymentPath, JSON.stringify(deployments, null, 2));
  }

  console.info(`Finish to Deploy Contract ${configContractName}`);

  return contract;
}

function isFileExisted(path) {
  return new Promise(function(resolve, reject) {
    fs.access(path, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  })
}

module.exports = {
  deployContract,
  wait,
  waitTx,
  encodeParameters
}
