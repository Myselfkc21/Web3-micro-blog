import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/n95D-T7C0iaHhGEjIwCRQeWYqNzWqw-a",
      accounts: ["d762dedc77f0a6c979512f116087cd97e242c226d872d1d840aaba3da2700dec"],
    },
  },
};

export default config;
