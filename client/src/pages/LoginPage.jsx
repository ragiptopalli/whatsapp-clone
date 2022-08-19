import React from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfos"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"#00A884"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
      >
        <Text
          fontSize="3xl"
          fontFamily="Roboto"
          fontWeight="regular"
          color="white"
          textAlign="center"
        >
          WhatsApp Clone
        </Text>
      </Box>
      <Box
        bg="#00A884"
        w="100%"
        p={4}
        borderRadius="lg"
        borderColor="#00A884"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList mb="1em">
            <Tab color="#fff" w="50%">
              Login
            </Tab>
            <Tab color="#fff" w="50%">
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default LoginPage;
