const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const fs = require("fs");

async function main() {
  /* these two lines deploy the contract to the network */
  const Blog = await ethers.getContractFactory("Blog");
  // deploy the contract
  const blog = await Blog.deploy("My blog");
  // wait for the contract to be deployed.
  await blog.deployed();

  console.log("Blog deployed to:", blog.address);

  /* this code writes the contract addresses to a local */
  /* file named config.js that we can use in the app */
  fs.writeFileSync(
    "./config.js",
    `
  export const contractAddress = "${blog.address}"
  export const ownerAddress = "${blog.signer.address}"
  `
  );
}
// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
