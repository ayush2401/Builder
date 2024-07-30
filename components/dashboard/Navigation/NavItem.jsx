import { Flex, Icon, Link } from "@chakra-ui/react";
import React from "react";

const NavItem = ({ icon, children, ...rest }) => {
  const { isActive } = rest;
  return (
    <Link href={`/dashboard/${children.toLowerCase()}`} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        my="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "green.300",
          color: "white",
        }}
        {...(isActive ? { bg: "green.300", color: "white" } : {})}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            {...(isActive ? { color: "white" } : {})}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

export default NavItem;
