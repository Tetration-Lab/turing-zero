import { PUZZLE_ABI, getContract } from "@/constants/contracts";
import { useState } from "react";
import { BaseError, fromBytes } from "viem";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";
import { useTransactionToast } from "./useTransactionToast";

export const useSubmitTx = () => {
  const client = usePublicClient();
  const { data: wallet } = useWalletClient();
  const chainId = useChainId();
  const txToast = useTransactionToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPuzzle = async (
    id: bigint,
    finalState: number,
    proof: Uint8Array
  ) => {
    try {
      setIsSubmitting(true);
      const { request } = await client.simulateContract({
        address: getContract(chainId),
        abi: PUZZLE_ABI,
        account: wallet?.account.address,
        functionName: "submitPuzzle",
        args: [id, BigInt(finalState), fromBytes(proof, "hex")],
      });
      const hash = await wallet?.writeContract(request);
      if (!hash) return;
      txToast.submitted(hash);
      const tx = await client.waitForTransactionReceipt({
        hash,
      });
      if (tx.status === "success") {
        txToast.success(hash);
      } else {
        txToast.error(hash);
      }
    } catch (e) {
      if (e instanceof BaseError) txToast.errorMessage(e.shortMessage);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitPuzzle,
  };
};
