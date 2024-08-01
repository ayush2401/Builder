"use client";

import React from "react";
import { Box, useColorModeValue, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import SidebarContent from "@/components/dashboard/Sidebar/SidebarContent";
import MobileNav from "@/components/dashboard/Navigation/MobileNav";
import { useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";

export default function App({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loading } = useSelector((state) => state.dashboard);
  return (
    <>
      <LoadingOverlay active={loading} spinner text="Loading your content...">
        <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
          <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
          <Drawer
            autoFocus={false}
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size="full"
          >
            <DrawerContent>
              <SidebarContent onClose={onClose} />
            </DrawerContent>
          </Drawer>
          {/* mobilenav */}
          <MobileNav onOpen={onOpen} />
          <Box ml={{ base: 0, md: 60 }} p="4">
            {children}
          </Box>
        </Box>
      </LoadingOverlay>
    </>
  );
}
