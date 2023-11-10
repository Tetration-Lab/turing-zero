import { Address } from "viem";
import { goerli } from "viem/chains";

export const CURRENCY: { [address: Address]: [string, number] } = {
  "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6": ["weth", 18],
};

export const CURRENCY_ID_DENOM_COINGECKO: { [id: string]: string[] } = {
  ethereum: ["weth", "eth"],
};

export const CURRENCY_BY_CHAIN_ID: { [chainId: number]: Address[] } = {
  [goerli.id]: ["0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"],
};

export const getDenom = (address?: Address): string => {
  return CURRENCY[address?.toLowerCase() as Address]?.[0] ?? "";
};

export const getDecimal = (address?: Address): number => {
  return CURRENCY[address?.toLowerCase() as Address]?.[1] ?? 18;
};
