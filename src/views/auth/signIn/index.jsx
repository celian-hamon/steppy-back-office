/* eslint-disable */
import React from "react";
// Chakra imports
import {
    Box, Button,
    Flex,
    FormControl, FormErrorMessage,
    FormLabel,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import {MdOutlineRemoveRedEye} from "react-icons/md";
import {RiEyeCloseLine} from "react-icons/ri";
import {Field, Form, Formik} from "formik";

function SignIn() {
    // Chakra color mode
    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
    const textColorBrand = useColorModeValue("brand.500", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
    const googleText = useColorModeValue("navy.700", "white");
    const googleHover = useColorModeValue(
        {bg: "gray.200"},
        {bg: "whiteAlpha.300"}
    );
    const googleActive = useColorModeValue(
        {bg: "secondaryGray.300"},
        {bg: "whiteAlpha.200"}
    );
    const [show, setShow] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const handleClick = () => setShow(!show);
    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            <Flex
                maxW={{base: "100%", md: "max-content"}}
                w='100%'
                mx={{base: "auto", lg: "0px"}}
                me='auto'
                h='100%'
                alignItems='start'
                justifyContent='center'
                mb={{base: "30px", md: "60px"}}
                px={{base: "25px", md: "0px"}}
                mt={{base: "40px", md: "14vh"}}
                flexDirection='column'>
                <Box me='auto'>
                    <Heading color={textColor} fontSize='36px' mb='10px'>
                        Sign In
                    </Heading>
                </Box>
                <Flex
                    zIndex='2'
                    direction='column'
                    w={{base: "100%", md: "420px"}}
                    maxW='100%'
                    background='transparent'
                    borderRadius='15px'
                    mx={{base: "auto", lg: "unset"}}
                    me='auto'
                    mb={{base: "20px", md: "auto"}}>

                    <Formik initialValues={{code: '', password: ''}} onSubmit={async (values, {props, setSubmitting, setErrors}) => {
                        let response = await fetch("http://localhost:80" + "/api/login", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            },
                            body: JSON.stringify(values)
                        });
                        if (response.status === 200) {
                            const data = await response.json();
                            console.log(data);
                            localStorage.setItem("token", data.access_token);
                            window.location.href = "/";
                        } else {
                            setErrors('code', 'Invalid code');
                        }
                    }}>
                        {(props) => (
                            <Form>

                                <Field name='code'>
                                    {({field, form}) => (
                                        <FormControl
                                            isInvalid={form.errors}
                                            isRequired>
                                            <FormLabel>Code</FormLabel>
                                            <InputGroup size='md'>
                                                <Input
                                                    isRequired={true}
                                                    variant='auth'
                                                    fontSize='sm'
                                                    name='code'
                                                    ms={{base: "0px", md: "0px"}}
                                                    type='text'
                                                    placeholder='123543212312'
                                                    mb='24px'
                                                    fontWeight='500'
                                                    size='lg'
                                                    {...field}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='password'>
                                    {({field, form}) => (
                                        <FormControl mt={'10px'}
                                                     isInvalid={form.errors!==undefined}
                                                     isRequired>
                                            <FormLabel>Password</FormLabel>
                                            <InputGroup
                                                size='md'>
                                                <Input
                                                    isRequired={true}
                                                    fontSize='sm'
                                                    placeholder='*********'
                                                    mb='24px'
                                                    size='lg'
                                                    name='password'
                                                    type={show ? "text" : "password"}
                                                    variant='auth'
                                                    {...field}
                                                />
                                                <InputRightElement display='flex' alignItems='center' mt='4px'>
                                                    <Icon
                                                        color={textColorSecondary}
                                                        _hover={{cursor: "pointer"}}
                                                        as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                                        onClick={handleClick}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                        </FormControl>
                                    )}
                                </Field>
                                <Button
                                    fontSize='sm'
                                    variant='brand'
                                    fontWeight='500'
                                    w='100%'
                                    h='50'
                                    mb='24px'
                                    type='submit'
                                    isLoading={props.isSubmitting}>
                                    Sign In
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='start'
                        maxW='100%'
                        mt='0px'>

                    </Flex>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
}

export default SignIn;
