import React from "react";
import NavItem from "../Navigation/NavItem";
import { Box, CloseButton, Flex, useColorModeValue, Text, Avatar } from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings } from "react-icons/fi";
import Image from "next/image";

const LinkItems = [
  { name: "Home", icon: FiHome },
  { name: "Data", icon: FiTrendingUp },
  { name: "Explore", icon: FiCompass },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];
const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" my={4} justifyContent="space-between">
        <Image priority={true} src={"/greenhood.jpg"} width={150} height={30} className="z-[-1]" alt="Logo"/>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

export default SidebarContent;
