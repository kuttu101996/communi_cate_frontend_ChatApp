import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton key={1} height={"40px"} />
      <Skeleton key={2} height={"40px"} />
      <Skeleton key={3} height={"40px"} />
      <Skeleton key={4} height={"40px"} />
      <Skeleton key={5} height={"40px"} />
      <Skeleton key={6} height={"40px"} />
      <Skeleton key={7} height={"40px"} />
      <Skeleton key={8} height={"40px"} />
    </Stack>
  );
};

export default ChatLoading;
