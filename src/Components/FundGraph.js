import {
    VStack, 
    HStack, 
    Heading, 
    Table, 
    Button, 
    Spacer, 
    Thead, 
    Th, 
    Tr,
    Divider,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    InputGroup,
    Input,
    FormHelperText,
    Image,
    Textarea,
    Spinner,
    Text,
    Tag,
    Box,
    Tbody,
    Td
} from "@chakra-ui/react";
import { init } from "events";
import { create } from "ipfs-http-client";
import OrbitDB from "orbit-db";
import { useEffect, useState } from "react";
import axios from "axios";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { MdContentCopy } from "react-icons/md";



function FundGraph() {

    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const [ posterUrl, setPosterUrl ] = useState("");
    const [ isUploadingImage, setIsUploadingImage ] = useState(false);
    const [ streamTitle, setStreamTitle ] = useState("");
    const [ streamDescription, setStreamDescription ] = useState("");
    const [ streamUrl, setStreamUrl ] = useState("");
    const [ streamKey, setStreamKey ] = useState("");
    const [ afterStreamCreated, setAfterStreamCreated ] = useState(false);
    const [ creatingStream, setCreatingStream ] = useState(false);
    

    // useEffect(() => {
    //     // init();
    // }, []);


    return (
        <VStack width="100%">
            <HStack width="100%">
                <Heading color="pink.500">Stream Flow</Heading>
            </HStack>
            <Divider color="pink" />
            <Table variant="striped">
                <Thead>
                    <Tr>
                        <Th>Fundraise ID</Th>
                        <Th>Fundraise Period</Th>
                        <Th>Fund Raised</Th>
                        <Th>Fundraiser Address</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {/* {
                        streams.map((stream) => {
                            return (
                                <Tr>
                                    <Td>
                                        <HStack spacing={4}>
                                            <Image width="200px" src={stream.imageUrl} />
                                            <Text alignSelf="flex-start">{stream.streamTitle}</Text>
                                        </HStack>
                                    </Td>
                                    <Td>
                                        <Tag textTransform="uppercase">{stream.status}</Tag>
                                    </Td>
                                </Tr>
                            )
                        })
                    } */}
                </Tbody>
            </Table>
        </VStack>
    )
}

export default FundGraph;