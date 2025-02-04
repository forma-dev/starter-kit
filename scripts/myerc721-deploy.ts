import hre from "hardhat";
import { getAddress } from 'viem'
import { myErc721Config } from "./myerc721";

async function main() {

  const [walletClient] = await hre.viem.getWalletClients();
  console.log(`Using wallet: ${walletClient.account.address}`);

  console.log(`✨ Deploying MyERC721...`);
  const myErc721 = await hre.viem.deployContract("MyERC721", [
    myErc721Config.contractMetadata.name, // name
    myErc721Config.symbol, // symbol
    walletClient.account.address, // initial owner
    walletClient.account.address, // default royalty receiver
    myErc721Config.defaultRoyaltyFeeNumerator, // default royalty fee numerator
  ]);
  console.log(`✔ MyERC721 deployed to: ${getAddress(myErc721.address)}`);

  const hash = await myErc721.write.setContractMetadataRaw([JSON.stringify(myErc721Config.contractMetadata)]);
  console.log(`✨ Setting contract metadata. tx hash: ${hash}`);

  const publicClient = await hre.viem.getPublicClient();
  await publicClient.waitForTransactionReceipt({ hash });
  console.log(`✔ Contract metadata set`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
