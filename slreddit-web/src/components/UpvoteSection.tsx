import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  // Selecting a subtype of PostQuery (a giant object with a key called posts)
  post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >();
  const [, vote] = useVoteMutation();
  return (
    <Flex
      direction="column"
      alignItems={"center"}
      justifyContent={"center"}
      mr={6}
    >
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("upvote-loading");
          await vote({ postId: post.id, value: 1 });
          setLoadingState("not-loading");
        }}
        variant="outline"
        colorScheme={post.voteStatus === 1 ? "green" : "teal"}
        size="sm"
        fontSize="20px"
        isLoading={loadingState === "upvote-loading"}
        aria-label="Upvote"
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downvote-loading");
          await vote({ postId: post.id, value: -1 });
          setLoadingState("not-loading");
        }}
        variant="outline"
        colorScheme={post.voteStatus === -1 ? "red" : "teal"}
        size="sm"
        fontSize="20px"
        isLoading={loadingState === "downvote-loading"}
        aria-label="Downvote"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
