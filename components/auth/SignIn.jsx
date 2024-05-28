"use client"

import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Link, Button, Heading, Text } from "@chakra-ui/react";
import { useColorModeValue } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function SignIn() {

  const [email , setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    router.push('/dashboard');
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to access <Link href="https://greenhood.sg" target="__blank" color={"blue.400"}>greenhood</Link> FMS✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </FormControl>
            <Stack spacing={10}>
              <Stack direction={{ base: "column", sm: "row" }} align={"start"} justify={"space-between"}>
                <Checkbox>Remember me</Checkbox>
                <Link color={"black"}>Forgot password?</Link>
              </Stack>
              <Button
               loadingText="Logging in..."
                onClick={handleLogin}
                bg={"green.300"}
                color={"white"}
                _hover={{
                  bg: "black",
                }}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
                <Text align={'center'}>
                 Don't have an account? <Link href='/signup' color={'blue.400'}>Click here</Link>
                </Text>
              </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
