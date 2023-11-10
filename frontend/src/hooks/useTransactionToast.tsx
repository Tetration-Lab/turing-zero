import { getChain } from "@/constants/web3";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Icon, Link, keyframes, useToast } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa6";
import { Hex } from "viem";
import { useChainId } from "wagmi";

export const useTransactionToast = () => {
  const toast = useToast({
    duration: 3500,
    position: "top-right",
    isClosable: true,
    size: "md",
  });
  const chainId = useChainId();

  const spinKeyframes = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  const ViewOnExplorer = ({ hash }: { hash: Hex }) => (
    <Link
      href={`${getChain(chainId)?.blockExplorers.default.url}/tx/${hash}`}
      isExternal
    >
      View on block explorer <Icon as={ExternalLinkIcon} />
    </Link>
  );

  const submitted = (hash: Hex) => {
    toast({
      title: "Transaction Submitted",
      colorScheme: "blue",
      icon: (
        <Icon
          as={FaSpinner}
          animation={`${spinKeyframes} 1s ease-in infinite`}
        />
      ),
      description: <ViewOnExplorer hash={hash} />,
    });
  };

  const success = (hash: Hex) => {
    toast({
      title: "Transaction Success",
      status: "success",
      description: <ViewOnExplorer hash={hash} />,
    });
  };

  const error = (hash: Hex) => {
    toast({
      title: "Transaction Error",
      status: "error",
      description: <ViewOnExplorer hash={hash} />,
    });
  };

  const errorMessage = (message: ReactNode) => {
    toast({
      title: "Transaction Error",
      status: "error",
      description: message,
    });
  };

  return {
    submitted,
    success,
    error,
    errorMessage,
  };
};
