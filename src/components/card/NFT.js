// Chakra imports
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input, Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, {useRef, useState} from "react";
import {Field, Form, Formik} from "formik";
import {RangeDatepicker} from "chakra-dayzed-datepicker";
import {HSeparator} from "../separator/Separator";
import {ExternalLinkIcon} from "@chakra-ui/icons";

export default function NFT(props) {
    const {image, name, author, challenge} = props;
    const [like, setLike] = useState(false);
    const textColor = useColorModeValue("navy.700", "white");
    const textColorBid = useColorModeValue("brand.500", "white");
    const {onOpen, onClose, isOpen} = useDisclosure();
    const [link, setLink] = useState("");
    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);

    return (
        <Card p='20px' style={{
            transition: "background 0.25s",
        }}
              _hover={{
                  background: "whiteAlpha.700",
                  cursor: "pointer",
              }} onClick={onOpen}>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Mettre a jour {props.name}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Formik
                            initialValues={{
                                id: challenge.id,
                                name: props.name,
                                description: props.author,
                                password: props.challenge.password,
                                dates: selectedDates
                            }}
                            onSubmit={async (values, actions) => {
                                values.startAt = values.dates[0].toISOString();
                                values.endAt = values.dates[1].toISOString();
                                const response = await fetch("http://localhost:80" + "/api/challenges/" + props.challenge.id, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "Authorization": "Bearer " + localStorage.getItem("token")
                                    },
                                    body: JSON.stringify(values)
                                });
                                const data = await response.json();
                                if (response.status === 200) {
                                    onClose();
                                } else {

                                    localStorage.removeItem("token");
                                    window.location.href = "/";
                                }
                            }}
                        >
                            {(props) => (
                                <Form>
                                    <Field name='name'>
                                        {({field, form}) => (
                                            <FormControl isRequired>
                                                <FormLabel>Nom</FormLabel>
                                                <Input {...field} placeholder='name'/>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name='description'>
                                        {({field, form}) => (
                                            <FormControl mt={'10px'} isRequired>
                                                <FormLabel>Description</FormLabel>
                                                <Textarea {...field} placeholder='descriptions'/>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name='password'>
                                        {({field, form}) => (
                                            <FormControl mt={'10px'} isRequired>
                                                <FormLabel>Mot de passe</FormLabel>
                                                <Input {...field} placeholder='password'/>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name='dates'>
                                        {({field, form}) => (
                                            <FormControl mt={'10px'} isRequired>
                                                <FormLabel>Dates</FormLabel>
                                                <RangeDatepicker
                                                    selectedDates={selectedDates}
                                                    onDateChange={setSelectedDates}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <ModalFooter px={"2px"} justifyContent={'space-between'}>
                                        <>
                                            <Button variant='ghost'
                                                    type='submit'
                                                    colorScheme={'blue'}
                                                    isLoading={props.isSubmitting}>Mettre a jour</Button>
                                            <Button colorScheme='blue' onClick={onClose}>
                                                Fermer
                                            </Button>
                                        </>
                                    </ModalFooter>
                                </Form>
                            )}
                        </Formik>
                        <HSeparator/>
                            <Formik
                                initialValues={{
                                    id: challenge.id,
                                    dates: selectedDates
                                }}
                                onSubmit={async (values, actions) => {
                                    //Date to unix timestamp
                                    values.startAt = values.dates[0].getTime();
                                    values.endAt = values.dates[1].getTime();
                                    const response = await fetch("http://localhost:80" + "/api/export/" + props.challenge.id, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Accept": "application/json",
                                            "Authorization": "Bearer " + localStorage.getItem("token")
                                        },
                                        body: JSON.stringify(values)
                                    });
                                    //open text reponse
                                    const data = await response.text();
                                    if (response.status === 200) {
                                        const url = window.URL.createObjectURL(new Blob([data]))
                                        setLink(url);

                                    } else {
                                        localStorage.removeItem("token");
                                        window.location.href = "/";
                                    }
                                }}
                            >
                                {(props) => (
                                    <Form >
                                        <Field name='dates'>
                                            {({field, form}) => (
                                                <FormControl mt={'10px'} isRequired>
                                                    <FormLabel>Dates</FormLabel>
                                                    <RangeDatepicker
                                                        selectedDates={selectedDates}
                                                        onDateChange={setSelectedDates}
                                                    />
                                                </FormControl>
                                            )}
                                        </Field>
                                        <ModalFooter px={"2px"} justifyContent={'space-between'}>

                                                <Button variant='ghost'
                                                        type='submit'
                                                        colorScheme={'blue'}
                                                        isLoading={props.isSubmitting}>Exporter</Button>
                                                <Link href={link} display={link ? 'block' : "none"} color={'blue'}>lien <ExternalLinkIcon mx='2px' /></Link>
                                                <Button colorScheme='blue' onClick={onClose}>
                                                    Fermer
                                                </Button>

                                        </ModalFooter>
                                    </Form>
                                )}
                            </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Flex direction={{base: "column"}} justify='center'>
                <Flex flexDirection='column' justify='space-between' h='100%'>
                    <Flex
                        justify='space-between'
                        direction={{
                            base: "row",
                            md: "column",
                            lg: "row",
                            xl: "column",
                            "2xl": "row",
                        }}
                        mb='auto'>
                        <Flex direction='column'>
                            <Text
                                color={textColor}
                                fontSize={{
                                    base: "xl",
                                    md: "lg",
                                    lg: "lg",
                                    xl: "lg",
                                    "2xl": "md",
                                    "3xl": "lg",
                                }}
                                mb='5px'
                                fontWeight='bold'
                                me='14px'>
                                {name}
                            </Text>
                            <Text
                                color='secondaryGray.600'
                                fontSize={{
                                    base: "sm",
                                }}
                                fontWeight='400'
                                me='14px'>
                                {author}
                            </Text>
                        </Flex>

                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
}
