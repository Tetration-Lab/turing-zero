import { Address, parseAbi } from "viem";

export const CONTRACTS: { [chainId: number]: Address } = {};

export const getContract = (chainId: number): Address => {
  return CONTRACTS[chainId] ?? "0x0";
};

export const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function approve(address, uint256) returns (bool)",
  "function allowance(address, address) view returns (uint256)",
]);
