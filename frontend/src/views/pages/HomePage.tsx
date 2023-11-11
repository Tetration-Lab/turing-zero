import {
  Text,
  Heading,
  Stack,
  Wrap,
  Button,
  Tooltip,
  useToast,
  Box,
  SimpleGrid,
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
import DagreGraph, {d3Node, d3Link, labelType} from "dagre-d3-react"
import styles from "@/styles/turing.module.css";

export const HomePage = () => {
  const {
    switchNetwork,
    isLoading: isSwitching,
    pendingChainId,
  } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const toast = useToast();

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

  const convertNode = ():d3Node[] => {
    if (config) {
      const nodes = Object.keys(config?.states).map((s) =>  {
        const labelType: labelType = 'string'
        return {
          id: s,
          label: s,
          labelType,
          class: styles.turingNode
        }
      });
      nodes.push({
        id: 'halt',
        label: 'halt',
        labelType: 'string',
        class: styles.turingNode
      })
      return nodes;
    } else return []
  }

  const convertLink = (): d3Link[] => {
    const cfg = JSON.parse(code)
    const links: d3Link[] = []
    if (config) {
      Object.keys(cfg.states).map(name => {
        const state = cfg.states[name]
        Object.keys(state).map(input => {
          const command = state[input]
          const target = command.to ? command.to : name
          links.push({
            source: name,
            target,
            label: input,
            class: styles.turingPath
          })
        })
      })
    }
    return links
  }

  return (
    <>
      <AppHeader title="Bounties" />
      <Section>
        <Navbar />
        <Stack>
          <Heading>{TITLE}</Heading>
          <Text>{DESCRIPTION}</Text>
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
            <DagreGraph 
              nodes={convertNode() ?? []}
              links={convertLink() ?? []}
              config={{
                rankdir: 'LR',
                align: 'DL',
                ranker: 'tight-tree'
              }}
              // width='100'
              // height='100'
              animate={1000}
              shape='circle'
              fitBoundaries
              zoomable
              >

            </DagreGraph>
            <SimpleGrid
              columns={turing.input.length + 3}
              width="fit-content"
              alignSelf="center"
            >
              {[
                config?.null,
                config?.null,
                ...turing.input.split(""),
                config?.null,
              ].map((c) => (
                <Text
                  w="30px"
                  fontSize="xl"
                  border="1px solid gray"
                  px={2}
                  h="full"
                >
                  {c}
                </Text>
              ))}
            </SimpleGrid>

            <Box
              sx={{
                ".view-lines monaco-mouse-cursor-text": {
                  fontSize: 20,
                },
              }}
            >
              <Editor
                value={code}
                language="json"
                data-color-mode="light"
                onChange={(value) => setCodeDebounced(value ?? "")}
                height="50vh"
                className="editor"
                //style={{
                //fontSize: 14,
                //backgroundColor: "#f5f5f5",
                //fontFamily:
                //"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                //}}
              />
            </Box>
          </Stack>
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
