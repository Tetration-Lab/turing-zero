import { Config } from "@/interfaces/config";
import { useMemo } from "react";
import styles from "@/styles/turing.module.css";
import { d3Node, d3Link, labelType } from "@/components/common/DagreGraph";
import _ from "lodash";

export const useGraphNodeLink = ({
  config,
  currentProgram,
  currentInput,
  input,
}: {
  config: Config | null;
  currentProgram: string | null;
  currentInput: number;
  input: ("0" | "1" | " ")[];
}) => {
  const convertNode = useMemo((): d3Node[] => {
    if (config) {
      const labelType: labelType = "string";
      const nodes = ["halt", ...Object.keys(config.states)].map((s) => {
        return {
          id: s,
          label: s,
          labelType,
          class:
            currentProgram === s
              ? styles.turingNodeSelected
              : styles.turingNode,
        };
      });
      return nodes;
    } else return [];
  }, [config, currentProgram]);

  const convertLink = useMemo((): d3Link[] => {
    const links: d3Link[] = [];
    if (config) {
      Object.keys(config.states).forEach((name) => {
        const state = config.states[name];
        const groupByTarget = _.groupBy(
          Object.entries(state).map((e) => ({
            key: e[0],
            ...e[1],
          })),
          "transition"
        );
        Object.entries(groupByTarget).forEach(([target, entries]) => {
          const label = entries.map((e) => {
            return `${e.key[0]}->${
              e.write !== undefined ? `${e.write.toString()[0]}` : e.key[0]
            },${e.move[0].toUpperCase()}`;
          });

          const isSelected =
            currentProgram === name &&
            entries
              .map((e) => (e.key === "empty" ? " " : e.key))
              .includes(input[currentInput]);
          links.push({
            source: name,
            target: target === "undefined" ? name : target,
            label: `${label.join("\n")}`,
            class: isSelected ? styles.turingPathSelected : styles.turingPath,
          });
        });
      });
    }
    return links;
  }, [config, input, currentInput, currentProgram]);

  return {
    nodes: convertNode,
    links: convertLink,
  };
};
