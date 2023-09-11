import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ConfirmationModal = ({ handleFunction, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <span onClick={onOpen}>{children}</span>
      <Modal
        size={{ base: "xs", md: "lg" }}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent height={"auto"}>
          <ModalHeader
            fontSize={{ base: "18px", md: "24px" }}
            display={"flex"}
            justifyContent={"center"}
            color={"red.300"}
          >
            Delete Account Parmanently
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text
              color={"grey"}
              fontSize={{ base: "12px", md: "16px" }}
              width={{ base: "97%", md: "95%" }}
              textAlign={"center"}
            >
              Are you sure you want to delete your account? This action is
              irreversible and will permanently delete all your data associated
              with your account.
            </Text>
          </ModalBody>

          <ModalFooter mt={2}>
            <Button
              size={{ base: "xs", md: "md" }}
              colorScheme="blue"
              mr={{ base: 1, md: 3 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size={{ base: "xs", md: "md" }}
              colorScheme="red"
              onClick={handleFunction}
            >
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ConfirmationModal;
