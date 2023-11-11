import {
  CHAR_SIZE,
  N_STEP,
  TAPE_SIZE,
  TOTAL_STATE_SIZE,
} from "@/constants/turing";
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

      const tapeInit = _.range(0, TAPE_SIZE).map(() => 0);
      const configInit = config.input.split("").map((c) => parseInt(c) + 1);
      tapeInit.splice(TAPE_SIZE / 2, configInit.length, ...configInit);
      const write = _.range(0, TOTAL_STATE_SIZE).map(() => 0);
      const move = _.range(0, TOTAL_STATE_SIZE).map(() => 1);
      const stateTransition = _.range(0, 30).map(() => 0);

      const haltIndex = Object.keys(config.states).length;

      // config states
      Object.entries(config.states).forEach(([name, state], i) => {
        Object.entries(state).forEach(([char, transition]) => {
          const c = char.trim();
          const charIndex = c === "0" ? 1 : c === "1" ? 2 : 0;
          if (transition.write !== undefined) {
            write[i * CHAR_SIZE + charIndex] = transition.write + 1;
          } else {
            write[i * CHAR_SIZE + charIndex] = charIndex;
          }
          if (transition.move === "right") {
            move[i * CHAR_SIZE + charIndex] = 0;
          } else {
            move[i * CHAR_SIZE + charIndex] = 2;
          }
          if (transition?.transition === "halt") {
            stateTransition[i * CHAR_SIZE + charIndex] = haltIndex;
          } else {
            stateTransition[i * CHAR_SIZE + charIndex] = _.indexOf(
              Object.keys(config.states),
              transition.transition ?? name
            );
          }
        });
      });

      // config halt state
      write.splice(haltIndex * CHAR_SIZE, CHAR_SIZE, 0, 1, 2);
      move.splice(haltIndex * CHAR_SIZE, CHAR_SIZE, 1, 1, 1);
      stateTransition.splice(
        haltIndex * CHAR_SIZE,
        CHAR_SIZE,
        haltIndex,
        haltIndex,
        haltIndex
      );

      const tapeOut = [...tapeInit];
      let head = TAPE_SIZE / 2;
      let state = 0;

      // handle tape out
      _.range(N_STEP).forEach(() => {
        const read = tapeOut[head];
        const transitionIndex = state * CHAR_SIZE + read;
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
      let start = 0n;
      for (let i = 0; i < TAPE_SIZE; i++) {
        start += BigInt(tapeInit[i]) << BigInt(i * 8);
      }
      let end = 0n;
      for (let i = 0; i < TAPE_SIZE; i++) {
        end += BigInt(tapeOut[i]) << BigInt(i * 8);
      }
      console.log("start", start);
      console.log("end", end);
      console.log(new Buffer(proof.proof).toString("hex"));
      console.log(
        "proof",
        proof.publicInputs.map((e) => new Buffer(e).readIntBE(0, 32))
      );
      console.log("isvalid?", await noir.verifyFinalProof(proof));
    } catch (e) {
      console.error(e);
    } finally {
      setIsProving(false);
    }
  };

  return {
    isProving,
    proveTuring,
  };
};
