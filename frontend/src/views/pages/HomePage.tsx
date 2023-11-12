import {
  Text,
  Heading,
  Stack,
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
  Link as ChakraLink,
  useDisclosure,
} from "@chakra-ui/react";
import { Section, Navbar, Footer, AppHeader } from "@/components/common";
import { useAccount, useChainId, useContractRead } from "wagmi";
import { ZERO_ADDRESS, web3Modal } from "@/constants/web3";
import _ from "lodash";
import { DESCRIPTION, TITLE } from "@/constants/texts";
import { useMemo, useState } from "react";
import { useTuring } from "@/hooks/useTuring";
import DagreGraph from "@/components/common/DagreGraph";
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
import { useGraphNodeLink } from "@/hooks/useGraphNodeLink";
import { useConfig } from "@/useConfig";
import { ChainList } from "@/components/common/ChainList";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ProofModal } from "@/components/Modal/ProofModal";
import { WitnessModal } from "@/components/Modal/WitnessModal";
import { parsePuzzleFromContract } from "@/interfaces/puzzle";
import { AUTO_LOAD } from "@/constants/config";

export const HomePage = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  const proofModal = useDisclosure();
  const witnessModal = useDisclosure();
  const isModalOpen = proofModal.isOpen || witnessModal.isOpen;

  const { code, setCodeDebounced, config, load } = useConfig({
    autoLoad: AUTO_LOAD,
  });
  const turing = useTuring(config);

  const { links, nodes } = useGraphNodeLink({
    config,
    currentInput: turing.currentInput,
    currentProgram: turing.currentProgram,
    input: turing.input,
  });

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
      return parsePuzzleFromContract(Number(iid), puzzles[0]);
    }
  }, [puzzles, iid]);

  return (
    <>
      <ProofModal
        proof={proof?.proof}
        isOpen={proofModal.isOpen}
        onClose={proofModal.onClose}
      />
      <WitnessModal
        config={config}
        isOpen={witnessModal.isOpen}
        onClose={witnessModal.onClose}
      />
      <AppHeader title="Home" />
      <Section>
        <Navbar />
        <Stack>
          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            gap={1}
          >
            <Stack spacing={1}>
              <Heading>{TITLE}</Heading>
              <Text>{DESCRIPTION}</Text>
              <Text as="i">
                Made with love by{" "}
                <ChakraLink isExternal href="https://www.tetrationlab.com/">
                  Tetration Lab <ExternalLinkIcon boxSize="12px" />
                </ChakraLink>{" "}
                team!
              </Text>
            </Stack>
            <Stack gap={1}>
              <Text fontSize="lg" as="b">
                Supported Chains
              </Text>
              <ChainList />
            </Stack>
          </Stack>
          <Box h="24px" />
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
                  isOpen={turing.currentInput === i && !isModalOpen}
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
                  nodes={nodes}
                  links={links}
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
              {!AUTO_LOAD && <Button onClick={load}>Load From Editor</Button>}
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
              <Button onClick={witnessModal.onOpen} colorScheme="orange">
                View Witness
              </Button>
            </Stack>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
              gap={4}
            >
              <GridItem
                h={{ base: "30vh", md: "50vh" }}
                order={{ base: 1, md: -1 }}
                colSpan={3}
              >
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
                            .slice(puzzle.firstIndex, puzzle.lastIndex)
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
                            .slice(puzzle.firstIndex, puzzle.lastIndex)
                            .map((e, i) => (
                              <BitText key={i}>{e}</BitText>
                            ))}
                        </HStack>
                      </Stack>
                      <Divider my={2} opacity={0.1} />
                      <Text fontSize="sm" color="primary.500" as="b">
                        {!_.isEqual(turing.endInput, puzzle.outputTape) &&
                          "Output is not the same. Please simulate till end!"}
                      </Text>
                      {!_.isEqual(turing.initialInput, puzzle.inputTape) && (
                        <Button
                          onClick={() => {
                            const newCode = code.replace(
                              /"input":\s*".*"/g,
                              `"input": "${puzzle.inputTape.join("").trim()}"`
                            );
                            setCodeDebounced(newCode);
                          }}
                        >
                          Copy Input To Editor
                        </Button>
                      )}
                      <Button
                        colorScheme="telegram"
                        isDisabled={
                          !_.isEqual(turing.initialInput, puzzle.inputTape) ||
                          !_.isEqual(turing.endInput, puzzle.outputTape) ||
                          !!proof
                        }
                        isLoading={prover.isProving}
                        onClick={async () => {
                          if (config) {
                            const proof = await prover.proveTuring(config);
                            proofModal.onOpen();
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
                        {isConnected
                          ? solved
                            ? "Solved 🥰"
                            : "Submit 🫡"
                          : "Connect Wallet"}
                      </Button>
                      {solved && (
                        <Button colorScheme="green" as={Link} href="/puzzles">
                          Explore More Puzzles
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Heading fontSize="2xl">Find Puzzle To Play!</Heading>
                      <Text>
                        You can find a puzzle to play by clicking the button
                        below.
                      </Text>
                      <Button colorScheme="green" as={Link} href="/puzzles">
                        Explore Puzzles
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
