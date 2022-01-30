// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
   //Edit these

    let MochiAbi = [
    "function mint(uint256) payable",
    "function publicSaleOpen() view returns (bool)",
    ]
    let MochiAddr = "0x5a0d4479aed030305a36a1fb516346d533e794fb";

    let mochi = await hre.ethers.getContractAt(MochiAbi,MochiAddr);

    let ok = false;

    while(!ok){
        await sleep(5000);
        ok = await mochi.publicSaleOpen();
        console.log("not fucking ok");
        if(ok){
            console.log("fucking ok");
        }
    }


    let overrides = {
        value: ethers.utils.parseUnits("0.035", 'ether')
    };

    await mochi.mint(1,overrides);

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
