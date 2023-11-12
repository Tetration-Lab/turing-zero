import { chains, web3Modal } from "@/constants/web3";
import { Button, Text, Tooltip, Wrap } from "@chakra-ui/react";
import { useAccount, useChainId, useSwitchNetwork } from "wagmi";

export const ChainList = () => {
  const {
    switchNetwork,
    isLoading: isSwitching,
    pendingChainId,
  } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const chainId = useChainId();

  return (
    <Wrap spacingX={2}>
      {chains.map((c) => (
        <Tooltip label={c.name} key={c.id}>
          <Button
            size="sm"
            gap={2}
            isLoading={isSwitching && pendingChainId === c.id}
            variant="outline"
            colorScheme={isConnected && chainId === c.id ? "primary" : "gray"}
            cursor={isConnected && chainId === c.id ? "default" : "pointer"}
            onClick={
              isSwitching || (isConnected && chainId === c.id)
                ? undefined
                : async () => {
                    if (!isConnected || !switchNetwork) web3Modal.open();
                    else switchNetwork(c.id);
                  }
            }
          >
            <Text as="b">{c.name}</Text>
          </Button>
        </Tooltip>
      ))}
    </Wrap>
  );
};
