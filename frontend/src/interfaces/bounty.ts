import { getDecimal } from "@/constants/currency";
import { Address, Hex, formatUnits } from "viem";

export interface Bounty {
  id: string;
  owner: Address;
  isClaimed: boolean;
  title: string;
  lastUpdated: Date;
  ipfsHash: string;
  amount: number;
  currency: Address;
  envHash: Hex;
  callback: Address;
  chainID: number;
  flag: Address;
}

export const bountyFromContractData = (data: {
  index: number;
  asset: `0x${string}`;
  flag: `0x${string}`;
  owner: `0x${string}`;
  callback: `0x${string}`;
  amount: bigint;
  claimed: boolean;
  lastUpdated: bigint;
  envHash: `0x${string}`;
  title: string;
  ipfsHash: string;
  chainID: number;
}): Bounty => {
  return {
    id: data.index.toString(),
    owner: data.owner,
    isClaimed: data.claimed,
    title: data.title,
    lastUpdated: new Date(Number(data.lastUpdated) * 1000),
    ipfsHash: data.ipfsHash,
    amount: Number(formatUnits(data.amount, getDecimal(data.asset))),
    currency: data.asset,
    envHash: data.envHash,
    callback: data.callback,
    chainID: data.chainID,
    flag: data.flag,
  };
};

export interface BountyDetail {
  links?: { title: string; description?: string; url?: string }[];
  environment?: object;
  enviroment?: object;
}
