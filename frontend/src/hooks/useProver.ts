import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import _ from "lodash";

export const useProver = () => {
  const prove = async () => {
    const circuit = await import("../../public/circuits/turing_zero.json");
    console.log(circuit);
    const backend = new BarretenbergBackend(circuit as any);
    const noir = new Noir(circuit as any, backend);
    console.log("Generating proof...");
    const proof = await noir.generateFinalProof({
      tape_init: _.range(0, 32).map(() => 0),
      tape_out: _.range(0, 32).map(() => 0),
      write: _.range(0, 30).map(() => 0),
      move: _.range(0, 30).map(() => 1),
      state_transition: _.range(0, 30).map(() => 0),
      final_state: 0,
    });
    console.log("Finished generating proof");
    console.log(proof);
  };

  return {
    prove,
  };
};
