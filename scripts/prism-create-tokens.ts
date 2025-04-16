import hre from "hardhat";
import { getAddress } from 'viem'
import { prismErc1155Config } from "./prism";

async function main() {
  if (!prismErc1155Config.address) {
    throw new Error("🤯 PrismERC1155 address is not set. Did you forget to deploy?");
  }

  const [walletClient] = await hre.viem.getWalletClients();
  console.log(`Using wallet: ${walletClient.account.address}`);

  // Get contract instance
  const prismErc1155 = await hre.viem.getContractAt("PrismERC1155", prismErc1155Config.address);
  console.log(`✨ Using PrismERC1155 at: ${getAddress(prismErc1155.address)}`);

  for (const token of prismErc1155Config.tokens) {
    // check if token already exists
    const tokenExists = await prismErc1155.read.exists([token.id]);
    if (tokenExists) {
      console.log(`✔ Token #${token.id} already exists`);
      continue;
    }

    // Create token
    const createHash = await prismErc1155.write.create([
      token.id,
      JSON.stringify({ id: token.id.toString(), ...token.metadata }),
      token.cemented,
      token.maxSupply,
      walletClient.account.address // initial minter
    ]);
    console.log(`✨ Creating token #${token.id}. tx hash: ${createHash}`);

    const publicClient = await hre.viem.getPublicClient();
    await publicClient.waitForTransactionReceipt({ hash: createHash });
    console.log(`✔ Token #${token.id} created successfully`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
