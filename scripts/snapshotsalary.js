// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {deployContract,wait,waitTx} = require("./utils");

async function main() {
  //Edit these

  let salaryABI = [
    "constructor()",
    "event CheckpointToken(uint256 time, uint256 tokens)",
    "event Claimed(uint256 tokenId, uint256 amount, uint256 claim_epoch, uint256 max_epoch)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "function checkpoint_token()",
    "function checkpoint_total_supply()",
    "function claim(uint256 _tokenId) returns (uint256)",
    "function claimOwnership()",
    "function claim_many(uint256[] _tokenIds) returns (bool)",
    "function claimable(uint256 _tokenId) view returns (uint256)",
    "function depositor() view returns (address)",
    "function init(address _voting_escrow)",
    "function last_token_time() view returns (uint256)",
    "function owner() view returns (address)",
    "function pendingOwner() view returns (address)",
    "function setDepositor(address _depositor)",
    "function start_time() view returns (uint256)",
    "function time_cursor() view returns (uint256)",
    "function time_cursor_of(uint256) view returns (uint256)",
    "function timestamp() view returns (uint256)",
    "function token() view returns (address)",
    "function token_last_balance() view returns (uint256)",
    "function tokens_per_week(uint256) view returns (uint256)",
    "function transferOwnership(address newOwner, bool direct, bool renounce)",
    "function user_epoch_of(uint256) view returns (uint256)",
    "function ve_for_at(uint256 _tokenId, uint256 _timestamp) view returns (uint256)",
    "function ve_supply(uint256) view returns (uint256)",
    "function voting_escrow() view returns (address)"
  ]
  let salaryAddr = "0xe0ACACCFf2cDa66C8cFcA3bf86e7310748c70727";
  let salary = await hre.ethers.getContractAt(salaryABI, salaryAddr);

  let piperAddr = "0x0a5d1F1293db350dDe590be12f9dA1d876C9aFCE";
  let piperAbi =  ["function update_period()"];
  let piper = await hre.ethers.getContractAt(piperAbi, piperAddr);
  let law = await hre.ethers.getContractAt("IERC20",'0x0b00366fBF7037E9d75E4A569ab27dAB84759302');


  let voterAddr = "0x10EAc6Cf7F386A11B6811F140CA8B9D6Ae7FbDf5";
  let voterAbi =  ["function distro()","function updateListingFee()"];
  let voter = await hre.ethers.getContractAt(voterAbi, voterAddr);

  let gaugeflexUSDAddr = "0x51959557879c2325Be7ea4CE4569580Fd5b04bc8";
  let gaugeflexUSDAbi =  ["function rewardRate(address) view returns (uint256)"];
  let gaugeflexUSD = await hre.ethers.getContractAt(gaugeflexUSDAbi, gaugeflexUSDAddr);

  let ok = false;


  week = parseInt(Date.now()/1000/(86400*7));
 // week = 2728;

  console.log(`current week ${week}`)

  while (!ok) {
    await sleep(60000);
    nowweek = parseInt(Date.now()/1000/(86400*7));
    if( nowweek > week ){
      ok = true;
    }else {
      console.log(`current ts ${Date.now()/1000} week ${nowweek}, expect week ${week+1}`);
    }
    if (ok) {
      console.log("fucking ok");
    }
  }
  await sleep(10000);
  //snapshot
  lawbal = await law.balanceOf(piper.address);
  console.log(`law pre bal ${lawbal}`)

  tx = await piper.update_period();
  await wait(hre.ethers, tx.hash, 'piper.update_period');
  //do some check
  lawbal = await law.balanceOf(piper.address);
  console.log(`law after bal ${lawbal}`)

  tx = await voter.distro();
  await wait(hre.ethers, tx.hash, 'voter.distro');

  tx = await voter.updateListingFee();
  await wait(hre.ethers, tx.hash, 'voter.updateListingFee');

  //see rate
  rewardrate = await  gaugeflexUSD.rewardRate(law.address);
  console.log(`lawflexusd rewardrate ${rewardrate}`)

  tx = await salary.checkpoint_total_supply();
  await wait(hre.ethers, tx.hash, 'salary.checkpoint_total_supply');

  tx = await salary.checkpoint_token();
  await wait(hre.ethers, tx.hash, 'salary.checkpoint_token');

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
