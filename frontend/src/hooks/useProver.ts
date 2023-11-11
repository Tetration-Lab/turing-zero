import { N_STEP } from "@/constants/turing";
import { Config } from "@/interfaces/config";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import _ from "lodash";
import { useState } from "react";

export const useProver = () => {
  const [isProving, setIsProving] = useState(false);
  const proveTuring = async (config: Config) => {
    try {
      setIsProving(true);

      const circuit = await import("../../public/circuits/turing_zero.json");
      const backend = new BarretenbergBackend(circuit as any);
      const noir = new Noir(circuit as any, backend);
      console.log("Generating proof...");

      const tapeInit = _.range(0, 32).map(() => 0);
      const configInit = config.input.split("").map((c) => parseInt(c) + 1);
      tapeInit.splice(16, configInit.length, ...configInit);
      const write = _.range(0, 30).map(() => 0);
      const move = _.range(0, 30).map(() => 1);
      const stateTransition = _.range(0, 30).map(() => 0);

      const haltIndex = Object.keys(config.states).length;

      // config states
      Object.entries(config.states).forEach(([name, state], i) => {
        Object.entries(state).forEach(([char, transition]) => {
          const c = char.trim();
          const charIndex = c === "0" ? 1 : c === "1" ? 2 : 0;
          if (transition.write !== undefined) {
            write[i * 3 + charIndex] = transition.write + 1;
          } else {
            write[i * 3 + charIndex] = charIndex;
          }
          if (transition.go === "right") {
            move[i * 3 + charIndex] = 0;
          } else {
            move[i * 3 + charIndex] = 2;
          }
          if (transition?.to === "halt") {
            stateTransition[i * 3 + charIndex] = haltIndex;
          } else {
            stateTransition[i * 3 + charIndex] = _.indexOf(
              Object.keys(config.states),
              transition.to ?? name
            );
          }
        });
      });

      // config halt state
      write.splice(haltIndex * 3, 3, 0, 1, 2);
      move.splice(haltIndex * 3, 3, 1, 1, 1);
      stateTransition.splice(haltIndex * 3, 3, haltIndex, haltIndex, haltIndex);

      const tapeOut = [...tapeInit];
      let head = 16;
      let state = 0;

      // handle tape out
      _.range(N_STEP).forEach(() => {
        const read = tapeOut[head];
        const transitionIndex = state * 3 + read;
        tapeOut[head] = write[transitionIndex];
        const mv = move[transitionIndex];
        head = head + 1 - mv;
        state = stateTransition[transitionIndex];
      });

      const proof = await noir.generateFinalProof({
        tape_init: tapeInit,
        tape_out: tapeOut,
        write,
        move,
        state_transition: stateTransition,
        final_state: state,
      });

      console.log("Finished generating proof");
      console.log(proof);
    } catch (e) {
    } finally {
      setIsProving(false);
    }
  };

  return {
    isProving,
    proveTuring,
  };
};
