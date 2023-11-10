import { TITLE_SHORT } from "@/constants/texts";
import { Text } from "@chakra-ui/react";
import Link from "next/link";

export const Title = () => {
  return (
    <Text
      as={Link}
      fontSize="2xl"
      fontWeight="extrabold"
      textAlign={{
        base: "center",
        md: "left",
      }}
      href="/"
    >
      {TITLE_SHORT}
    </Text>
  );
};
