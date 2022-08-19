import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setSignUpName] = useState();
  const [email, setSignUpEmail] = useState();
  const [password, setSignUpPassword] = useState();
  const [confirmPassword, setSignUpConfirmPassword] = useState();
  const [picture, setSignUpPicture] = useState();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

  const handleConfirmPasswordShow = () =>
    setConfirmPasswordShow(!confirmPasswordShow);

  const handlePasswordShow = () => setPasswordShow(!passwordShow);

  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill in all the fields!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user',
        {
          name,
          email,
          password,
          picture,
        },
        config
      );

      toast({
        title: 'Successfully Registered!',
        description: 'You are being navigated to the chats page!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
      });

      localStorage.setItem('userInfos', JSON.stringify(data));
      setLoading(false);
      setTimeout(() => {
        navigate(0);
      }, 3000);
    } catch (err) {
      toast({
        title: 'Error Occured trycatch!',
        description: err.response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  const postDetails = (pictures) => {
    setLoading(true);
    if (pictures === undefined) {
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    if (pictures.type === 'image/jpeg' || pictures.type === 'image/png') {
      const data = new FormData();
      data.append('file', pictures);
      data.append('upload_preset', 'whats-app-clone');
      data.append('cloud_name', 'rtopalli');
      fetch('https://api.cloudinary.com/v1_1/rtopalli/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setSignUpPicture(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          toast({
            title: 'Error Occured!',
            description: err.response.data.message,
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
          });
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing='5px'>
      <FormControl id='signup-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter Your Name'
          onChange={(e) => {
            setSignUpName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id='signup-email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter Your Email'
          onChange={(e) => {
            setSignUpEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id='signup-password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={passwordShow ? 'text' : 'password'}
            placeholder='Enter Your Password'
            onChange={(e) => {
              setSignUpPassword(e.target.value);
            }}
          />
          <InputRightElement w='4.5rem' color='#000'>
            <Button h='1.75rem' size='sm' onClick={handlePasswordShow}>
              {passwordShow ? <Icon as={VscEye} /> : <Icon as={VscEyeClosed} />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='signup-confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={confirmPasswordShow ? 'text' : 'password'}
            placeholder='Confirm Your Password'
            onChange={(e) => {
              setSignUpConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement w='4.5rem' color='#000'>
            <Button h='1.75rem' size='sm' onClick={handleConfirmPasswordShow}>
              {confirmPasswordShow ? (
                <Icon as={VscEye} />
              ) : (
                <Icon as={VscEyeClosed} />
              )}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='signup-picture'>
        <FormLabel>Upload a Profile Picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        w='100%'
        colorScheme='green'
        style={{ marginTop: 25 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
