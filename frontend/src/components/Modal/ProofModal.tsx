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
} from "@chakra-ui/react";
import { ProofData } from "@noir-lang/backend_barretenberg";
import { useMemo } from "react";
import { fromBytes } from "viem";

export const ProofModal = ({
  proof,
  isOpen,
  onClose,
}: {
  proof?: ProofData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const formattedProof = useMemo(() => {
    if (!proof) return;
    return {
      proof: fromBytes(proof.proof, "hex"),
      inputs: proof.publicInputs.map((input) => fromBytes(input, "number")),
    };
  }, [proof]);
  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Proof</ModalHeader>
        <ModalCloseButton />
        {formattedProof && (
          <ModalBody as={Stack}>
            <Heading fontSize="lg">Public Inputs</Heading>
            <Text>[{formattedProof.inputs.join(",")}]</Text>
            <Heading fontSize="lg">Proof</Heading>
            <Text>{formattedProof.proof}</Text>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
