import { HardhatUserConfig, subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import { TASK_COMPILE_SOLIDITY_EMIT_ARTIFACTS } from "hardhat/builtin-tasks/task-names";
import { join } from "path";
import { writeFile } from "fs/promises";
import { inspect } from "util";

import { config as dotEnvConfig } from "dotenv";
dotEnvConfig({ path: ['.env.local', '.env'] });

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 150,
      },
      viaIR: true,
    },
  },
  defaultNetwork: "sketchpad",
  networks: {
    hardhat: {
    },
    local: {
      url: "http://localhost:8545",
      accounts: process.env.PRIVATE_KEY_LOCAL ? [process.env.PRIVATE_KEY_LOCAL] : []
    },
    forma: {
      url: "https://rpc.forma.art",
      accounts: process.env.PRIVATE_KEY_FORMA ? [process.env.PRIVATE_KEY_FORMA] : []
    },
    sketchpad: {
      url: "https://rpc.sketchpad-1.forma.art",
      accounts: process.env.PRIVATE_KEY_SKETCHPAD ? [process.env.PRIVATE_KEY_SKETCHPAD] : []
    }
  },
  paths: {
    sources: "./contracts",
  },
  etherscan: {
    apiKey: {
      forma: "abc",
      sketchpad: "abc"
    },
    customChains: [
      {
        network: "forma",
        chainId: 984122,
        urls: {
          apiURL: "https://explorer.forma.art/api",
          browserURL: "https://explorer.forma.art"
        }
      },
      {
        network: "sketchpad",
        chainId: 984123,
        urls: {
          apiURL: "https://explorer.sketchpad-1.forma.art/api",
          browserURL: "https://explorer.sketchpad-1.forma.art"
        }
      }
    ]
  }
};

type ContractMap = Record<string, { abi: object }>;

subtask(TASK_COMPILE_SOLIDITY_EMIT_ARTIFACTS).setAction(
  async (args, env, next) => {
    const output = await next();
    const { artifacts } = env.config.paths;
    const promises = Object.entries(args.output.contracts).map(
      async ([sourceName, contract]) => {
        const contractName = Object.keys(contract as ContractMap)[0];
        const { abi } = Object.values(contract as ContractMap)[0];
        const data = `export const ${contractName}ABI = ${inspect(abi, false, null)} as const;`;
        const file = join(artifacts, sourceName, `${contractName}.abi.ts`);
        await writeFile(file, data);
      },
    );
    await Promise.all(promises);
    return output;
  },
);

export default config;
