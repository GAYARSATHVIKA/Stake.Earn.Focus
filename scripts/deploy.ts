import hre from "hardhat";

async function main() {
  // @ts-ignore
  const { ethers } = hre;
  const FocusRoom = await ethers.getContractFactory("FocusRoom");
  const focusRoom = await FocusRoom.deploy();

  await focusRoom.waitForDeployment();

  console.log(`FocusRoom deployed to: ${await focusRoom.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
