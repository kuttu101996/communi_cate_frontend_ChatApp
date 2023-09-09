import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import emailValidator from "email-validator";

const Signup = () => {
  const [isValid, setIsValid] = useState(false);
  const [show, setShow] = useState(false);
  const [showCnf, setShowCnf] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const postDetails = async (pics) => {
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

      await fetch(
        `https://api.cloudinary.com/v1_1/dlz45puq4/image/upload`,
        // { public_id: `${data}` },
        {
          method: "POST",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString(""));
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
    setLoading(true);
    if (isValid === false) {
      toast({
        title: "Please enter a valid Email address",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Please check the password",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const head = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // comm-u-cate.onrender.com
      const { data } = await axios.post(
        `https://commu-cate.onrender.com/api/user/register`,
        { name, email, password, pic },
        head
      );

      if (data) {
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }

      setLoading(false);
      setIsValid(false);
      return;
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            const email = e.target.value;
            setIsValid(emailValidator.validate(email));
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Choose a password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4rem">
            <Button
              size="sm"
              h="1.7rem"
              onClick={() => {
                setShow(!show);
              }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showCnf ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={(e) => {
              setConfirmpassword(e.target.value);
            }}
          />
          <InputRightElement width={"4rem"}>
            <Button
              size="sm"
              h="1.7rem"
              onClick={() => {
                setShowCnf(!showCnf);
              }}
            >
              {showCnf ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="Upload a Profile Picture"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
