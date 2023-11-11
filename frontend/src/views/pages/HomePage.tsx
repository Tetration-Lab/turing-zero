import {
  Text,
  Heading,
  Stack,
  Wrap,
  Button,
  Tooltip,
  Box,
  HStack,
  Card,
  IconButton,
  Icon,
  Grid,
  GridItem,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { Section, Navbar, Footer, AppHeader } from "@/components/common";
import {
  useAccount,
  useChainId,
  useContractRead,
  useSwitchNetwork,
} from "wagmi";
import { ZERO_ADDRESS, chains, web3Modal } from "@/constants/web3";
import _ from "lodash";
import { DESCRIPTION, TITLE } from "@/constants/texts";
import { useEffect, useMemo, useState } from "react";
import { initConfigString } from "@/constants/config";
import { Config, parseConfig, parseInputOutputTape } from "@/interfaces/config";
import { useTuring } from "@/hooks/useTuring";
import DagreGraph, {
  d3Node,
  d3Link,
  labelType,
} from "@/components/common/DagreGraph";
import styles from "@/styles/turing.module.css";
import { useProver } from "@/hooks/useProver";
import { N_STEP } from "@/constants/turing";
import { Editor } from "@/components/Editor";
import { FaArrowRotateRight } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/router";
import { PUZZLE_ABI, getContract } from "@/constants/contracts";
import { BitText } from "@/components/Text/BitText";
import { formatAddress } from "@/utils/address";
import { ProofData } from "@noir-lang/backend_barretenberg";
import { useSubmitTx } from "@/hooks/useSubmitTx";

export const HomePage = () => {
  const {
    switchNetwork,
    isLoading: isSwitching,
    pendingChainId,
  } = useSwitchNetwork();
  const { isConnected, address } = useAccount();
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

  const prover = useProver();
  const txSubmitter = useSubmitTx();
  const [resetPosition, setResetPosition] = useState(false);
  const [proof, setProof] = useState<{
    proof: ProofData;
    finalState: number;
  } | null>(null);
  const reset = () => {
    turing.reset();
    setProof(null);
  };

  const {
    query: { id },
  } = useRouter();
  const iid = useMemo(() => {
    reset();
    const iid = parseInt(String(id));
    if (!isNaN(iid)) return BigInt(iid);
    return null;
  }, [id]);
  const { data: puzzles } = useContractRead({
    abi: PUZZLE_ABI,
    address: getContract(chainId),
    functionName: "getPuzzles",
    args: [iid !== null ? 1n : 0n, iid ?? 0n],
  });
  const { data: solved } = useContractRead({
    abi: PUZZLE_ABI,
    address: getContract(chainId),
    functionName: "solvedPuzzles",
    args: [address ?? ZERO_ADDRESS, iid ?? 0n],
  });
  const puzzle = useMemo(() => {
    if (puzzles?.[0]) {
      const p = puzzles[0];
      const inputTape = parseInputOutputTape(p.startTape);
      const outputTape = parseInputOutputTape(p.endTape);
      const firstOutputIndex = outputTape.findIndex((e) => e !== " ");
      const lastOutputIndex = outputTape.findLastIndex((e) => e !== " ") + 1;
      return {
        ...p,
        inputTape,
        outputTape,
        firstOutputIndex,
        lastOutputIndex,
      };
    }
  }, [puzzles]);

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
                      variant="outline"
                      colorScheme={
                        isConnected && chainId === c.id ? "primary" : "gray"
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
          <Stack spacing={4}>
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
              h={{ base: "20vh", sm: "30vh" }}
              p={{ base: 0, sm: 4 }}
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
              <IconButton
                aria-label="Reset Position"
                icon={
                  <Icon
                    as={FaArrowRotateRight}
                    transition="all 0.2s ease-in-out"
                    transform={resetPosition ? "rotate(180deg)" : "rotate(0)"}
                  />
                }
                onClick={() => setResetPosition((e) => !e)}
                position="absolute"
                top={0}
                right={0}
              >
                Reset Position
              </IconButton>
            </Box>
            <HStack justify="center">
              <Text>
                Current Step: {turing.step}, Max Step: {N_STEP}
              </Text>
            </HStack>
            <Stack justify="center" direction={{ base: "column", sm: "row" }}>
              <Button onClick={turing.next} colorScheme="green">
                Next Step
              </Button>
              <Button
                onClick={() => turing.setSimulating(true)}
                colorScheme="blue"
              >
                Simulate Till End
              </Button>
              <Button onClick={reset} colorScheme="red">
                Reset
              </Button>
            </Stack>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
              gap={4}
            >
              <GridItem h="40vh" order={{ base: 1, md: -1 }} colSpan={3}>
                <Editor code={code} setCodeDebounced={setCodeDebounced} />
              </GridItem>
              <GridItem colSpan={2}>
                <Stack as={Card} p={4}>
                  {puzzle ? (
                    <>
                      {solved && (
                        <Badge
                          colorScheme="green"
                          fontSize="md"
                          w="fit-content"
                        >
                          SOLVED!
                        </Badge>
                      )}
                      <Heading fontSize="2xl">{puzzle.name}</Heading>
                      <Text>{formatAddress(puzzle.creator)}</Text>
                      <Stack align="end" spacing={0}>
                        <Text as="b">Start:</Text>
                        <HStack
                          justify="center"
                          w="100%"
                          spacing={0}
                          scrollSnapAlign="center"
                        >
                          {puzzle.inputTape
                            .slice(
                              puzzle.firstOutputIndex,
                              puzzle.lastOutputIndex
                            )
                            .map((e, i) => (
                              <BitText key={i}>{e}</BitText>
                            ))}
                        </HStack>
                        <Text as="b">End:</Text>
                        <HStack
                          justify="center"
                          w="100%"
                          spacing={0}
                          scrollSnapAlign="center"
                        >
                          {puzzle.outputTape
                            .slice(
                              puzzle.firstOutputIndex,
                              puzzle.lastOutputIndex
                            )
                            .map((e, i) => (
                              <BitText key={i}>{e}</BitText>
                            ))}
                        </HStack>
                      </Stack>
                      <Divider my={2} opacity={0.1} />
                      <Text fontSize="sm" color="primary.500" as="b">
                        {!_.isEqual(turing.initialInput, puzzle.inputTape) &&
                          "Initial input is not the same!"}
                        {!_.isEqual(turing.endInput, puzzle.outputTape) &&
                          "End input is not the same. Please simulate till end!"}
                      </Text>
                      <Button
                        colorScheme="telegram"
                        isDisabled={
                          !_.isEqual(turing.initialInput, puzzle.inputTape) ||
                          !_.isEqual(turing.endInput, puzzle.outputTape) ||
                          !!proof ||
                          solved
                        }
                        isLoading={prover.isProving}
                        onClick={async () => {
                          if (config) {
                            const proof = await prover.proveTuring(config);
                            setProof(proof);
                          }
                        }}
                      >
                        Prove 😎
                      </Button>
                      <Button
                        colorScheme="primary"
                        isDisabled={!proof || solved}
                        isLoading={txSubmitter.isSubmitting}
                        onClick={async () => {
                          if (!isConnected) {
                            web3Modal.open();
                            return;
                          }
                          if (proof !== null && iid !== null) {
                            await txSubmitter.submitPuzzle(
                              iid,
                              proof.finalState,
                              proof.proof.proof
                            );
                            reset();
                          }
                        }}
                      >
                        {isConnected ? "Submit 🫡" : "Connect Wallet"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Heading fontSize="2xl">Find Puzzle To Play!</Heading>
                      <Text>
                        You can find a puzzle to play by clicking the button
                        below.
                      </Text>
                      <Button colorScheme="green" as={Link} href="/puzzles">
                        Go
                      </Button>
                    </>
                  )}
                </Stack>
              </GridItem>
            </Grid>
            <Box h="32px" />
          </Stack>
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
