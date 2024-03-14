import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useDisclosure
} from "@chakra-ui/react";
import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
import {RangeDatepicker} from "chakra-dayzed-datepicker";
import redirect from "react-router-dom/es/Redirect";

export function CreateChallenge(props) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
    return (
        <>
            <Button
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                w='100%'
                h='50'
                mb='24px'
                onClick={onOpen}
            >
                Creer un challenge
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Creer un challenge</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Formik
                            initialValues={{
                                name: '',
                                description: '',
                                password: '',
                                dates: selectedDates
                            }}
                            onSubmit={async (values, actions) => {
                                values.startAt = values.dates[0].toISOString();
                                values.endAt = values.dates[1].toISOString();
                                const response = await fetch("http://localhost:80" + "/api/challenges/", {
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
                                    redirect("/");
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
                                    <ModalFooter pr={'0px'}>
                                        <Button variant='ghost'
                                                type='submit'
                                                isLoading={props.isSubmitting}>Creer</Button>
                                        <Button colorScheme='blue' mr={3} onClick={onClose}
                                        >
                                            Fermer
                                        </Button>
                                    </ModalFooter>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}