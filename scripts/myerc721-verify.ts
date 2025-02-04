import hre from "hardhat";
import { getAddress } from "viem";
import { myErc721Config } from "./myerc721";

async function main() {

  if (!myErc721Config.address) {
    throw new Error("🤯 MyERC721 address is not set. Did you forget to deploy?");
  }

  const [walletClient] = await hre.viem.getWalletClients();
  console.log(`✨ Verifying MyERC721 at address: ${getAddress(myErc721Config.address)}`);

  await hre.run("verify:verify", {
    address: myErc721Config.address,
    constructorArguments: [
      myErc721Config.contractMetadata.name, // name
      myErc721Config.symbol, // symbol
      walletClient.account.address, // initial owner
      walletClient.account.address, // default royalty receiver
      myErc721Config.defaultRoyaltyFeeNumerator, // default royalty fee numerator
    ],
  });

  console.log(`✔ MyERC721 verified`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
