import { BoxProps, Container } from "@chakra-ui/react";

export const Section = (props: BoxProps) => {
  return (
    <Container
      minH="100dvh"
      maxW="container.xl"
      mx="auto"
      px={{ base: 10, md: 20 }}
      {...props}
    />
  );
};
