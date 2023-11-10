import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Center,
  Collapse,
  Icon,
  Link,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import LinkNext from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { Menu } from "@/interfaces/menu";
import { Title } from "./Title";

const MENU: Menu[] = [
  {
    label: "Home",
    href: "/",
  },
];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "w3m-button": any;
    }
  }
}

export const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Box mt={-2}>
        <Flex minH="100px" align="center">
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", md: "none" }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant="ghost"
              aria-label="Toggle Navigation"
            />
          </Flex>
          <HStack
            flex={{ base: 1 }}
            justify={{ base: "center", md: "start" }}
            display={{ base: "none", md: "flex" }}
            align="center"
            spacing={10}
          >
            <Title />
            <DesktopNav />
          </HStack>
          <w3m-button size="sm" />
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    </>
  );
};

const DesktopNav = () => {
  const router = useRouter();

  return (
    <Stack direction={"row"} spacing={10}>
      {MENU.map((navItem, i) => (
        <Link
          key={i}
          as={LinkNext}
          href={navItem.href}
          fontWeight={router.pathname === navItem.href ? "bold" : "normal"}
        >
          {navItem.label}
        </Link>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack p={4} display={{ md: "none" }}>
      {MENU.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: any) => {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        pl={8}
        as={LinkNext}
        href={href ?? "#"}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Center>
          <ul>
            <Text fontWeight={router.pathname === href ? "bold" : "normal"}>
              <li> {label}</li>
            </Text>
          </ul>
        </Center>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="all .25s ease-in-out"
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          align={"start"}
        >
          {children &&
            children.map((child: any) => (
              <Box
                onClick={() => {
                  router.push(child.href);
                }}
                key={child.label}
                py={2}
              >
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
