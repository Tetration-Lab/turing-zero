import { Config, toWitness } from "@/interfaces/config";
import { useToast } from "@chakra-ui/react";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import _ from "lodash";
import { useState } from "react";

export const useProver = () => {
  const [isProving, setIsProving] = useState(false);
  const toast = useToast();

  const proveTuring = async (config: Config) => {
    try {
      setIsProving(true);
      toast({
        title: "Generating proof...",
        status: "info",
      });

      const circuit = await import("../../public/circuits/turing_zero.json");
      const backend = new BarretenbergBackend(circuit as any);
      const noir = new Noir(circuit as any, backend);
      console.log("Generating proof...");

      const witness = toWitness(config);

      const proof = await noir.generateFinalProof({
        tape_init: witness.tapeInit,
        tape_out: witness.tapeOut,
        write: witness.write,
        move: witness.move,
        state_transition: witness.stateTransition,
        final_state: witness.state,
      });

      console.log("start tape serialized", witness.start);
      console.log("end tape serialized", witness.end);
      toast({
        title: "Proof generated!",
        status: "success",
      });
      return {
        proof,
        finalState: witness.state,
      };
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        status: "error",
      });
      throw e;
    } finally {
      setIsProving(false);
    }
  };

  return {
    isProving,
    proveTuring,
  };
};
