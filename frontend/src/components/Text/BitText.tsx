import { Text, chakra } from "@chakra-ui/react";

export const BitText = chakra(Text, {
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
