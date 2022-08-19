import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setLoginEmail] = useState("");
  const [password, setLoginPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState(false);

  const handlePasswordShow = () => setPasswordShow(!passwordShow);

  const handleSubmit = async (e) => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please type your email and password!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Logged in!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfos", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (err) {
      toast({
        title: "Please type your password!",
        description: err.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          onChange={(e) => {
            setLoginEmail(e.target.value);
          }}
          type="email"
          placeholder="Enter Your Email"
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
            type={passwordShow ? "text" : "password"}
            placeholder="Enter password"
            value={password}
          />
          <InputRightElement w="4.5rem" color="#000">
            <Button h="1.75rem" size="sm" onClick={handlePasswordShow}>
              {passwordShow ? <Icon as={VscEye} /> : <Icon as={VscEyeClosed} />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        w="100%"
        colorScheme="green"
        style={{ marginTop: 25, backgroundColor: "#C6F6D5", color: "#276749" }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={(e) => {
          e.preventDefault();
          setLoginEmail("guest@example.com");
          setLoginPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
