import { BitText } from "@/components/Text/BitText";
import { AppHeader, Navbar, Section } from "@/components/common";
import { PUZZLE_ABI, getContract } from "@/constants/contracts";
import { parsePuzzleFromContract } from "@/interfaces/puzzle";
import { formatAddress } from "@/utils/address";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  Divider,
  HStack,
  Heading,
  Icon,
  IconButton,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import _ from "lodash";
import Link from "next/link";
import { useState } from "react";
import { useChainId, useContractRead } from "wagmi";

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
          <HStack>
            <Spacer />
            <IconButton
              icon={<Icon as={ChevronLeftIcon} />}
              aria-label="left"
              size="sm"
              isDisabled={page === 0n || isLoading}
              onClick={() => setPage((p) => p - 1n)}
            />
            <IconButton
              icon={<Icon as={ChevronRightIcon} />}
              aria-label="right"
              size="sm"
              isDisabled={(data ?? []).length === 0 || isLoading}
              onClick={() => setPage((p) => p + 1n)}
            />
          </HStack>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
            {isLoading
              ? _.range(10).map((i) => <Skeleton w="100%" h="sm" key={i} />)
              : data?.map((p, i) => {
                  const puzzle = parsePuzzleFromContract(
                    Number(page) * 10 + i,
                    p
                  );

                  return (
                    <Card key={i} p={4}>
                      <Text fontSize="xl" as="b">
                        {puzzle.name}
                      </Text>
                      <Spacer />
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
                      <Divider my={4} opacity={0.1} />
                      <Button
                        colorScheme="primary"
                        as={Link}
                        href={`/?id=${puzzle.id}`}
                      >
                        Play
                      </Button>
                    </Card>
                  );
                })}
          </SimpleGrid>
        </Stack>
      </Section>
    </>
  );
};
