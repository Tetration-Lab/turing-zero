import { Config, toWitness } from "@/interfaces/config";
import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ProofData } from "@noir-lang/backend_barretenberg";
import { useMemo } from "react";
import { fromBytes } from "viem";

export const WitnessModal = ({
  config,
  isOpen,
  onClose,
}: {
  config: Config | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();
  const witness = useMemo(() => {
    if (!config) return;
    try {
      return toWitness(config);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        status: "error",
      });
      console.error(e);
    }
  }, [config]);
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Witnesses</ModalHeader>
        <ModalCloseButton />
        {witness && (
          <ModalBody as={Stack}>
            <Heading fontSize="lg">Tape Init</Heading>
            <Text>[{witness.tapeInit.join(",")}]</Text>
            <Heading fontSize="lg">Tape Out</Heading>
            <Text>[{witness.tapeOut.join(",")}]</Text>
            <Heading fontSize="lg">Final State</Heading>
            <Text>{witness.state}</Text>
            <Heading fontSize="lg">Move</Heading>
            <Text>[{witness.move.join(",")}]</Text>
            <Heading fontSize="lg">Write</Heading>
            <Text>[{witness.write.join(",")}]</Text>
            <Heading fontSize="lg">State Transition</Heading>
            <Text>[{witness.stateTransition.join(",")}]</Text>
            <Heading fontSize="lg">Start (Serialized)</Heading>
            <Text>{witness.start.toString()}</Text>
            <Heading fontSize="lg">End (Serialized)</Heading>
            <Text>{witness.end.toString()}</Text>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
