import { AppHeader, Navbar, Section } from "@/components/common";
import { PUZZLE_ABI, getContract } from "@/constants/contracts";
import { parseInputOutputTape } from "@/interfaces/config";
import { formatAddress } from "@/utils/address";
import {
  Button,
  Card,
  Divider,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useChainId, useContractInfiniteReads, useContractRead } from "wagmi";

export const PuzzlesPage = () => {
  const chainId = useChainId();
  const [page, setPage] = useState(0n);

  const { data, isLoading } = useContractRead({
    abi: PUZZLE_ABI,
    address: getContract(chainId),
    functionName: "getPuzzles",
    args: [10n, page * 10n],
  });
  return (
    <>
      <AppHeader title="Puzzles" />
      <Section>
        <Navbar />
        <Stack>
          <Heading>Puzzles</Heading>
          <Text>Explore Turing Zero Puzzles!</Text>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }}>
            {data?.map((p, i) => {
              const inputTape = parseInputOutputTape(p.startTape);
              const outputTape = parseInputOutputTape(p.endTape);
              const firstOutputIndex = outputTape.findIndex((e) => e !== " ");
              const lastOutputIndex =
                outputTape.findLastIndex((e) => e !== " ") + 1;

              return (
                <Card key={i} p={4}>
                  <Text fontSize="xl">{p.name}</Text>
                  <Text>{formatAddress(p.creator)}</Text>
                  <HStack align="center">
                    <Text as="b" w="48px">
                      Start:
                    </Text>
                    {inputTape
                      .slice(firstOutputIndex, lastOutputIndex)
                      .map((e) => (
                        <Text
                          lineHeight={0.8}
                          boxSize="14px"
                          fontSize="lg"
                          whiteSpace="pre-line"
                        >
                          {e}
                        </Text>
                      ))}
                  </HStack>
                  <HStack>
                    <Text as="b" w="48px">
                      End:
                    </Text>
                    {outputTape
                      .slice(firstOutputIndex, lastOutputIndex)
                      .map((e) => (
                        <Text
                          lineHeight={0.8}
                          boxSize="14px"
                          fontSize="lg"
                          whiteSpace="pre"
                        >
                          {e}
                        </Text>
                      ))}
                  </HStack>
                  <Divider my={2} />
                  <Button>Play</Button>
                </Card>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Section>
    </>
  );
};
