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
  chakra,
} from "@chakra-ui/react";
import { useState } from "react";
import { useChainId, useContractInfiniteReads, useContractRead } from "wagmi";

const BitText = chakra(Text, {
  baseStyle: {
    flexShrink: 0,
    border: "1px solid black",
    overflowX: "auto",
    lineHeight: 0.6,
    boxSize: "24px",
    fontSize: "lg",
    whiteSpace: "pre",
    textAlign: "center",
    p: 1,
  },
});

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
                  <Stack align="end" spacing={0}>
                    <Text as="b">Start:</Text>
                    <HStack
                      justify="center"
                      w="100%"
                      spacing={0}
                      scrollSnapAlign="center"
                    >
                      {inputTape
                        .slice(firstOutputIndex, lastOutputIndex)
                        .map((e) => (
                          <BitText>{e}</BitText>
                        ))}
                    </HStack>
                    <Text as="b">End:</Text>
                    <HStack
                      justify="center"
                      w="100%"
                      spacing={0}
                      scrollSnapAlign="center"
                    >
                      {outputTape
                        .slice(firstOutputIndex, lastOutputIndex)
                        .map((e) => (
                          <BitText>{e}</BitText>
                        ))}
                    </HStack>
                  </Stack>
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
