import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  // Data is loading
  if (fetching) {
    // User not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          {/* <Link mr={2}>Login</Link> */}
          <Button mr={4} colorScheme="whiteAlpha">
            Login
          </Button>
        </NextLink>
        <NextLink href="/register">
          <Button mr={2} colorScheme="whiteAlpha">
            Register
          </Button>
        </NextLink>
      </>
    );

    // Case where User is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="create-post">
          <Button
            as={Link}
            mr={4}
            style={{ textDecoration: "none" }}
            colorScheme="whiteAlpha"
          >
            Create Post
          </Button>
        </NextLink>
        <Box mx={2}>
          <Text fontWeight={"bold"}>{data.me.username}</Text>
        </Box>
        <Button
          variant={"ghost"}
          color={"white"}
          mr={8}
          style={{ textDecoration: "none" }}
          colorScheme="whiteAlpha"
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex position="sticky" top={0} bg="#2B6CB0" p={4} zIndex={1}>
      <Flex align={"center"} maxW={800} flex={1} m="auto">
        <NextLink href="/">
          <Button variant={"ghost"} colorScheme="whiteAlpha">
            <Heading color={"white"} textDecoration={"none"}>
              SLReddit
            </Heading>
          </Button>
        </NextLink>
        <Box ml={"auto"} color={"white"}>
          {body}
        </Box>
      </Flex>
    </Flex>
  );
};
