import { CURRENCY_ID_DENOM_COINGECKO } from "@/constants/currency";
import axios from "axios";
import { create } from "zustand";

interface IPricesStore {
  usd: { [denom: string]: number };
}

interface IPricesStoreAction {
  fetchPrice: () => Promise<void>;
  getPrice: (denom?: string) => number;
}

export const usePrices = create<IPricesStore & IPricesStoreAction>(
  (set, get) => ({
    usd: {},
    fetchPrice: async () => {
      const result = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${Object.keys(
          CURRENCY_ID_DENOM_COINGECKO
        ).join(",")}`
      );

      const entries: [string, number][] = [];
      Object.entries(result.data as { [key: string]: { usd: number } }).forEach(
        ([key, value]) => {
          CURRENCY_ID_DENOM_COINGECKO[key].forEach((denom) => {
            entries.push([denom, value.usd]);
          });
        }
      );

      set({
        usd: Object.fromEntries(entries),
      });
    },
    getPrice: (denom?: string) => {
      if (!denom) return 1;
      return get().usd[denom.toLowerCase()] ?? 1;
    },
  })
);
