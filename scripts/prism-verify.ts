import hre from "hardhat";
import { getAddress } from "viem";
import { prismErc1155Config } from "./prism";

async function main() {

  if (!prismErc1155Config.address) {
    throw new Error("🤯 PrismERC1155 address is not set. Did you forget to deploy?");
  }

  const [walletClient] = await hre.viem.getWalletClients();
  console.log(`✨ Verifying PrismERC1155 at address: ${getAddress(prismErc1155Config.address)}`);

  await hre.run("verify:verify", {
    address: prismErc1155Config.address,
    constructorArguments: [
      walletClient.account.address, // initial owner
    ],
  });

  console.log(`✔ PrismERC1155 verified`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
