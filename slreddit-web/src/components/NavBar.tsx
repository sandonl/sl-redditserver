import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { Router, useRouter } from "next/router";

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
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>Register</Link>
        </NextLink>
      </>
    );

    // Case where User is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="create-post">
          <Button as={Link} mr={4} style={{ textDecoration: "none" }}>
            create post
          </Button>
        </NextLink>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          variant="link"
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
          <Link>
            <Heading> SLReddit </Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
