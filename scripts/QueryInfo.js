// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
getBalance = await hre.ethers.provider.getBalance("0xc062bf9FaBE930FF8061f72b908AB1b702b3FdD6",2960787);

console.log(`getBalance ${getBalance}`)

getBalance = await hre.ethers.provider.getBalance("0xc062bf9FaBE930FF8061f72b908AB1b702b3FdD6",2960791);

console.log(`getBalance ${getBalance}`)

getBalance = await hre.ethers.provider.getBalance("0xc062bf9FaBE930FF8061f72b908AB1b702b3FdD6",2966835);

console.log(`getBalance ${getBalance}`)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
