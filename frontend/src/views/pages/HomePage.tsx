import {
  Text,
  Heading,
  Stack,
  Wrap,
  Button,
  Tooltip,
  Box,
  HStack,
  Circle,
} from "@chakra-ui/react";
import { Section, Navbar, Footer, AppHeader } from "@/components/common";
import { useAccount, useChainId, useSwitchNetwork } from "wagmi";
import { chains, web3Modal } from "@/constants/web3";
import _ from "lodash";
import { DESCRIPTION, TITLE } from "@/constants/texts";
import { useEffect, useMemo, useState } from "react";
import { initConfigString } from "@/constants/config";
import { Config, parseConfig } from "@/interfaces/config";
import { Editor } from "@monaco-editor/react";
import { useTuring } from "@/hooks/useTuring";
import DagreGraph, {
  d3Node,
  d3Link,
  labelType,
} from "@/components/common/DagreGraph";
import styles from "@/styles/turing.module.css";
import { useProver } from "@/hooks/useProver";
import { N_STEP } from "@/constants/turing";

export const HomePage = () => {
  const {
    switchNetwork,
    isLoading: isSwitching,
    pendingChainId,
  } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const [code, setCode] = useState(initConfigString);
  const setCodeDebounced = useMemo(
    () =>
      _.debounce((value: string) => {
        setCode(value);
      }, 1000),
    []
  );

  const [config, setConfig] = useState<Config | null>(null);
  useEffect(() => {
    try {
      const cfg = parseConfig(JSON.parse(code));
      setConfig(cfg);
    } catch (error: any) {
      console.error(error.message);
    }
  }, [code]);

  const turing = useTuring(config);

  const convertNode = useMemo((): d3Node[] => {
    if (config) {
      const nodes = ["halt", ...Object.keys(config.states)].map((s) => {
        const labelType: labelType = "string";
        return {
          id: s,
          label: s,
          labelType,
          class:
            turing.currentProgram === s
              ? styles.turingNodeSelected
              : styles.turingNode,
        };
      });
      return nodes;
    } else return [];
  }, [config, turing.currentProgram]);

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
              e.write !== undefined ? `${e.write}` : e.key[0]
            },${e.move[0].toUpperCase()}`;
          });

          const isSelected =
            turing.currentProgram === name &&
            entries
              .map((e) => (e.key === "empty" ? " " : e.key))
              .includes(turing.input[turing.currentInput]);
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
  }, [config, turing.input, turing.currentInput, turing.currentProgram]);

  const [resetPosition, setResetPosition] = useState(false);
  const prover = useProver();

  return (
    <>
      <AppHeader title="Home" />
      <Section>
        <Navbar />
        <Stack>
          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
          >
            <Stack>
              <Heading>Turing Zero {TITLE}</Heading>
              <Text>{DESCRIPTION}</Text>
            </Stack>
            <Stack>
              <Text fontSize="lg">Supported Chains</Text>
              <Wrap spacingX={2}>
                {chains.map((c) => (
                  <Tooltip label={c.name} key={c.id}>
                    <Button
                      gap={2}
                      isLoading={isSwitching && pendingChainId === c.id}
                      border={
                        isConnected && chainId === c.id
                          ? "1px solid gray"
                          : "none"
                      }
                      cursor={chainId === c.id ? "default" : "pointer"}
                      onClick={
                        isSwitching || chainId === c.id
                          ? undefined
                          : async () => {
                              if (!isConnected || !switchNetwork)
                                web3Modal.open();
                              else switchNetwork(c.id);
                            }
                      }
                    >
                      <Text as="b">{c.name}</Text>
                    </Button>
                  </Tooltip>
                ))}
              </Wrap>
            </Stack>
          </Stack>
          <HStack
            spacing={0}
            w="full"
            overflowX="auto"
            overflowY="hidden"
            scrollSnapAlign="center"
            justify="center"
          >
            {turing.input.map((c, i) => (
              <Tooltip
                key={i}
                hasArrow
                variant="red"
                isOpen={turing.currentInput === i}
                label={turing.currentProgram}
                placement="bottom"
              >
                <Text
                  zIndex={turing.currentInput === i ? 1 : 0}
                  boxSize={{ base: "48px", sm: "64px" }}
                  flexShrink={0}
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  borderWidth={turing.currentInput === i ? "2px" : "1px"}
                  borderColor={turing.currentInput === i ? "red" : "gray"}
                  transition="all 0.2s ease-in-out"
                  px={2}
                  textAlign="center"
                >
                  {c}
                </Text>
              </Tooltip>
            ))}
          </HStack>
          <Box
            w="100%"
            h={{ base: "20vh", sm: "40vh" }}
            p={{ base: 4, sm: 8 }}
            position="relative"
            sx={{
              ".turing-graph": {
                fontFamily: "Fira Code",
              },
            }}
          >
            {config && (
              <DagreGraph
                className="turing-graph"
                key={`${resetPosition}`}
                nodes={convertNode}
                links={convertLink}
                config={{
                  rankdir: "LR",
                  align: "DL",
                  ranker: "tight-tree",
                }}
                width="100%"
                height="100%"
                animate={1000}
                shape="circle"
                fitBoundaries
                zoomable
              />
            )}
          </Box>
          <HStack justify="center">
            <Text>
              Current Step: {turing.step}, Max Step: {N_STEP}
            </Text>
          </HStack>
          <Stack justify="center" direction={{ base: "column", sm: "row" }}>
            <Button
              onClick={() => turing.setSimulating(true)}
              colorScheme="green"
            >
              Simulate
            </Button>
            <Button onClick={turing.next} colorScheme="orange">
              Next
            </Button>
            <Button onClick={turing.reset} colorScheme="red">
              Reset
            </Button>
            <Button
              isLoading={prover.isProving}
              onClick={() => config && prover.proveTuring(config)}
              colorScheme="blue"
            >
              Prove
            </Button>
            <Button onClick={() => setResetPosition((e) => !e)}>
              Reset Position
            </Button>
          </Stack>

          <Editor
            value={code}
            language="json"
            data-color-mode="light"
            onChange={(value) => setCodeDebounced(value ?? "")}
            height="30vh"
          />
          <Box h="32px" />
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
