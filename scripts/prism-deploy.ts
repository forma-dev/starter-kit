import hre from "hardhat";
import { getAddress } from 'viem'
import { prismErc1155Config } from "./prism";

async function main() {

  const [walletClient] = await hre.viem.getWalletClients();
  console.log(`Using wallet: ${walletClient.account.address}`);

  console.log(`✨ Deploying PrismERC1155...`);
  const prismErc1155 = await hre.viem.deployContract("PrismERC1155", [
    walletClient.account.address, // initial owner
  ]);
  console.log(`✔ PrismERC1155 deployed to: ${getAddress(prismErc1155.address)}`);

  const hash = await prismErc1155.write.setContractMetadataRaw([JSON.stringify(prismErc1155Config.contractMetadata)]);
  console.log(`✨ Setting contract metadata. tx hash: ${hash}`);

  const publicClient = await hre.viem.getPublicClient();
  await publicClient.waitForTransactionReceipt({ hash });
  console.log(`✔ Contract metadata set`);

  // Update the address in the config
  console.log(`\nContract address: ${getAddress(prismErc1155.address)}`);
  console.log(`Don't forget to update the address in prism.ts config!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
