import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      fontSize={12}
      color={"white"}
      backgroundColor={"purple.600"}
      fontWeight={"medium"}
      cursor={"pointer"}
      onClick={handleFunction}
      variant="solid"
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
