// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {deployContract, wait, waitTx} = require("./utils");

async function main() {
  //Edit these

  let bABI = [
    "function sendLawToBarbarian() external",
  ]
  let bReserveAddr = "0x2faAF46A0c63DF95b6fd2C634359be8648Ef5133";

  let law = await hre.ethers.getContractAt("IERC20",
      '0x0b00366fBF7037E9d75E4A569ab27dAB84759302');
  let bReserve = await hre.ethers.getContractAt(bABI, bReserveAddr);

  lawbal = await law.balanceOf(bReserve.address);
  console.log(`law pre bal ${lawbal}`)
  
  tx = await bReserve.sendLawToBarbarian();
  await wait(hre.ethers, tx.hash, 'bReserve.sendLawToBarbarian');

  lawbal = await law.balanceOf(bReserve.address);
  console.log(`law after bal ${lawbal}`)

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
