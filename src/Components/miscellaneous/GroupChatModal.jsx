import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  // const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    // setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4444/api/user?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to search the user",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((ele) => ele._id !== user._id));
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select a valid image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "first_chat_app");
      data.append("cloud_name", "dlz45puq4");

      fetch(`https://api.cloudinary.com/v1_1/dlz45puq4/image/upload`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImageLink(data.url.toString(""));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select a valid image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all feilds",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4444/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((ele) => ele._id)),
          chatPic: imageLink,
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Created",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Unable to create the group",
        description: error.response.data,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontSize={"35px"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                type="file"
                p={1.5}
                mb={3}
                accept="image/*"
                placeholder="Upload a Profile Picture"
                onChange={(e) => {
                  postDetails(e.target.files[0]);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Guest, John"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} w={"100%"} flexWrap={"wrap"}>
              {selectedUsers.map((ele) => {
                return (
                  <UserBadgeItem
                    key={ele._id}
                    user={ele}
                    handleFunction={() => handleDelete(ele)}
                  />
                );
              })}
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              searchResult?.slice(0, 4).map((ele) => {
                return (
                  <UserListItem
                    key={ele._id}
                    user={ele}
                    handleFunction={() => handleGroup(ele)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
