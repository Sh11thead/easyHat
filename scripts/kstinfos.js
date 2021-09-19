// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
   //Edit these
    let userToview = "0x2383f513dfdc4b3a39795a7dBc5eFA7d227fFB0C";

    let kstDepositPoolAbi = [
    "function userInfo(uint256,address) view returns (uint256,uint256,uint256)",
    "function pendingKst(uint256,address) view returns (uint256)",
    ]
    let kstDepositPoolAddr = "0x5E6D7c01824C64C4BC7f2FF42C300871ce6Ff555";
    let kstlpDepositPoolAddr = "0xaEBa5C691aF30b7108D9C277d6BB47347387Dc13";

    let okexUSDTAddr = '0x382bb369d343125bfb2117af9c149795c6c65c50';
    let kstAddr = '0xab0d1578216a545532882e420a8c61ea07b00b12';
    let kstUsdtPairAddr = '0x84ee6a98990010fe87d2c79822763fca584418e9';
    let kstOktPairAddr = '0xa25da5a44a65ee9bd4ea61f946cbcf15512fd52e';

    let kstUsdtPair = await hre.ethers.getContractAt("UniswapPair",kstUsdtPairAddr);
    let kstOktPair = await hre.ethers.getContractAt("UniswapPair",kstOktPairAddr);
    let okexUSDT = await hre.ethers.getContractAt("IERC20",okexUSDTAddr);
    let kst = await hre.ethers.getContractAt("IERC20",kstAddr);

    let reserves = await kstUsdtPair.getReserves();
    let kstPrice = reserves[0]/reserves[1];
    let kstOktPairTotalSupply = await kstOktPair.totalSupply();
    let kstOktPairKstBal = await kst.balanceOf(kstOktPairAddr);
    let kstOktLpPrice = 2 * kstOktPairKstBal * kstPrice/kstOktPairTotalSupply;

    console.log(`KST price ${kstPrice} , kstOktLpPrice Price ${kstOktLpPrice}`);

    let kstDepositPool = await hre.ethers.getContractAt(kstDepositPoolAbi,kstDepositPoolAddr);
    let kstlpDepositPool = await hre.ethers.getContractAt(kstDepositPoolAbi,kstlpDepositPoolAddr);

    let kstsingleDepositMeta = await kstDepositPool.userInfo(8,userToview);
    let kstsinglePendingKst = await kstDepositPool.pendingKst(8,userToview);

    let kstoktPendingKst = await kstlpDepositPool.pendingKst(7,userToview);
    let kstoktDepositMeta = await kstlpDepositPool.userInfo(7,userToview);

    let allKstIncludePending = kstsingleDepositMeta[0]/1e18 + kstsinglePendingKst/1e18 + kstoktPendingKst/1e18;

    console.log(`allKstIncludePending ${allKstIncludePending} , value ${kstPrice * allKstIncludePending} `);
    console.log(`kstOktLp in Pool ${kstoktDepositMeta[0]/1e18}, value ${kstoktDepositMeta[0]/1e18 * kstOktLpPrice }`);
    console.log(`Your All Value is about $${kstPrice * allKstIncludePending + kstoktDepositMeta[0]/1e18 * kstOktLpPrice}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
