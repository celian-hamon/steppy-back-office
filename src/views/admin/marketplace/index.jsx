import React, {useEffect, useState} from "react";

// Chakra imports
import {
    Box,
    Button,
    Flex, FormControl, FormLabel,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";

// Custom components
import NFT from "components/card/NFT";
import {CreateChallenge} from "./components/createChallenge";
import {Field, Form, Formik} from "formik";
import redirect from "react-router-dom/es/Redirect";

export default function Challenges() {
    const [challenges, setChallenges] = useState([]);
    useEffect(async () => {
        const response = await fetch("http://localhost:80" + "/api/challenges", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });
        const data = await response.json();
        setChallenges(data);
    }, []);

    // Chakra Color Mode
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorBrand = useColorModeValue("brand.500", "white");
    return (

        <Box pt={{base: "180px", md: "80px", xl: "80px"}}>
            {/* Main Fields */}
            <Flex
                flexDirection='column'
                gridArea={{xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2"}}>
                {/*<Banner />*/}
                <Flex direction='column' width={"100%"}>
                    <Flex>
                        <ImportUsers/>
                        <CreateChallenge/>
                    </Flex>
                    <SimpleGrid columns={{base: 1, md: 3}} gap='20px'>
                        {
                            challenges.map((challenge, index) => {
                                return <NFT
                                    key={index}
                                    name={challenge.name}
                                    author={challenge.description}
                                    challenge={challenge}
                                />
                            })
                        }
                    </SimpleGrid>
                </Flex>
            </Flex>
        </Box>
    );
}

function ImportUsers() {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            <Button
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                w='100%'
                h='50'
                mr='24px'
                onClick={onOpen}
            >
                Importer des utilisateurs
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalContent>
                        <ModalHeader>Importer des données</ModalHeader>
                        <ModalBody>
                            <Formik initialValues={{
                                file: null,
                            }} onSubmit={async (values, formikHelpers)=>{
                                const formData = new FormData();
                                const fileField = document.querySelector('input[type="file"]');
                                const uploadedFile = fileField.files[0];

                                formData.append( 'csv', uploadedFile );
                                const response = await fetch("http://localhost:80" + "/api/import", {
                                    method: "POST",
                                    headers: {
                                        "Accept": "application/json",
                                        "Authorization": "Bearer " + localStorage.getItem("token")
                                    },
                                    body: formData
                                });
                                const data = await response.json();
                                if (response.status === 200) {
                                    onClose();
                                } else {
                                    localStorage.removeItem("token");
                                    redirect("/");
                                }
                            }}>
                                {(props) => (
                                    <Form>
                                        <Field name='file'>
                                            {({field}) => (
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        type="file"
                                                        name="file"
                                                        accept="image/png, .svg, .csv"
                                                        onChange={(event) => {
                                                            const files = event.target.files;
                                                            let myFiles =Array.from(files);
                                                            props.setFieldValue("csv", myFiles);
                                                        }}
                                                    />
                                                </FormControl>
                                            )}
                                        </Field>
                                        <ModalFooter>
                                                <Button type='submit' colorScheme='blue' mr={0}
                                                        isLoading={props.isSubmitting}>Importer</Button>
                                                <Button ml={"10px"} variant={'ghost'} onClick={onClose}>Fermer</Button>
                                        </ModalFooter>
                                    </Form>
                                )}

                            </Formik>
                        </ModalBody>
                    </ModalContent>
                </ModalContent>
            </Modal>
        </>
    )
}
