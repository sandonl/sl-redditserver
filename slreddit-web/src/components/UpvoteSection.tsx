import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";

interface UpvoteSectionProps {
  // Selecting a subtype of PostQuery (a giant object with a key called posts)
  post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  return (
    <Flex
      direction="column"
      alignItems={"center"}
      justifyContent={"center"}
      mr={6}
    >
      <IconButton
        variant="outline"
        colorScheme="teal"
        size="xs"
        fontSize="20px"
        aria-label="Upvote"
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        variant="outline"
        colorScheme="teal"
        size="xs"
        fontSize="20px"
        aria-label="Downvote"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
