import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon, Input,
  MenuButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, {useEffect, useMemo, useState} from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {GoPlus} from "react-icons/go";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
import {SearchBar} from "../../../../components/navbar/searchBar/SearchBar";
import {MdOutlineMoreHoriz, MdOutlinePlusOne} from "react-icons/md";
import {Field, Form, Formik} from "formik";
import redirect from "react-router-dom/es/Redirect";
export default function MessagesTable(props) {
  const { columnsData } = props;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:80'+'/api/health-messages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const data = await response.json();
      setMessages(data.map((message) => {
        return {
          message: message.message,
          supprimer: message.id
        }
      }));
    }
    fetchData();
  }, []);


  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => messages, [messages]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 10;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Messages de santé
        </Text>
        <Flex flexDirection={'row'}>
          <SearchBar mr={'10px'}
            onChange={(e) => {
                tableInstance.setGlobalFilter(e.target.value || undefined);
            }}
          />
          <AddMessageModal setMessages={setMessages} messages={messages}/>
        </Flex>
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody  {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "MESSAGE") {
                    data = (
                      <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "SUPPRIMER") {
                    data = (
                        <Button colorScheme='red' onClick={async ()=>{
                          const response = await fetch('http://localhost:80'+`/api/health-messages/${cell.value}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                          });
                            if (response.status === 204) {
                              setMessages(messages.filter((user) => user.supprimer !== cell.value));
                            }
                        }}>Supprimer</Button>
                    );
                  }
                  return (
                      <>
                        <Td
                            {...cell.getCellProps()}
                            key={index}
                            fontSize={{ sm: "14px" }}
                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                            borderColor='transparent'>
                          {data}
                        </Td>
                      </>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
}

function AddMessageModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {messages, setMessages} = props;
  return (
    <>
      <Button
          onClick={onOpen}
          colorScheme={'blue'}>
        <Icon as={GoPlus} color={'white'} w='30px' h='30px' />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalContent>
            <ModalHeader>Nouveau message de santé</ModalHeader>
            <ModalBody>
              <Formik initialValues={{
                message: '',
              }} onSubmit={async (values, formikHelpers)=>{
                const response = await fetch("http://localhost:80" + "/api/health-messages", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                  },
                  body: JSON.stringify(values)
                });
                const data = await response.json();
                if (response.status === 201) {
                  let buff = [...messages];
                    buff.push({
                        message: data.message,
                        supprimer: data.id
                    });
                  setMessages(buff);
                  onClose();
                } else {
                  localStorage.removeItem("token");
                  window.location.href="/";
                }
              }}>
                {(props) => (
                    <Form>
                      <Field name='message'>
                        {({field}) => (
                            <FormControl>
                              <FormLabel>Message de Santé</FormLabel>
                              <Input {...field} id='message' placeholder='Message de santé' />
                            </FormControl>
                        )}
                      </Field>
                      <ModalFooter>
                        <Button type='submit' colorScheme='blue' mr={0}
                                isLoading={props.isSubmitting}>Créer</Button>
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
  );
}