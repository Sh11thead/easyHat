// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
   //Edit these

    let MochiAbi = [
    "function mintHedgie(uint256,bytes32[])",
    "function publicSaleOpen() view returns (bool)",
    ]
    let MochiAddr = "0xf0d2d631A24Db247f5eb0421fA3E6A169C72565f";
    let mochi = await hre.ethers.getContractAt(MochiAbi,MochiAddr);

/*    let mochi = await hre.ethers.getContractAt(MochiAbi,MochiAddr);

    let ok = false;

    while(!ok){
        await sleep(2000);
        ok = await mochi.publicSaleOpen();
        console.log("not fucking ok");
        if(ok){
            console.log("fucking ok");
        }
    }*/


    let overrides = {
        value: ethers.utils.parseUnits("0.07", 'ether')
    };

    await mochi.mintHedgie(2,[]);

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
