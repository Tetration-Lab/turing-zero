import { wagmiConfig } from "@/constants/web3";
import { Address } from "viem";

/**
 * Return address with ellipsis in the middle
 */
export const formatAddress = (address?: string | Address) => {
  const addr = address?.toLowerCase();
  return `${addr?.slice(0, 6)}..${addr?.slice(-4)}`;
};

export const fetchEnsNames = async (
  addresses: Address[]
): Promise<(string | null)[]> => {
  const client = wagmiConfig.getPublicClient({
    chainId: 1,
  });
  return await Promise.all(
    addresses.map((a) => client.getEnsName({ address: a }))
  );
};
