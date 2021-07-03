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

const ipfs = create("https://f2a059a7ab6b.ngrok.io/");


function Streams() {

    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const [ posterUrl, setPosterUrl ] = useState("");
    const [ isUploadingImage, setIsUploadingImage ] = useState(false);
    const [ streamTitle, setStreamTitle ] = useState("");
    const [ streamDescription, setStreamDescription ] = useState("");
    const [ streamUrl, setStreamUrl ] = useState("");
    const [ streamKey, setStreamKey ] = useState("");
    const [ afterStreamCreated, setAfterStreamCreated ] = useState(false);
    const [ creatingStream, setCreatingStream ] = useState(false);
    const streams = [{imageUrl: "https://ipfs.io/ipfs/QmVv8U6UiZQEchGXKRnFnYNmMXsCdyQR1n8YzGk66fYJv3", streamTitle: "First Stream", status: "created" }]

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const orbitdb = await OrbitDB.createInstance(ipfs);
        const db = await orbitdb.open("/orbitdb/zdpuAs7mtXzHopSJ3sD3dgwiwLbNKpbmQhJeknLAe43aXA7Hd/videosdb");
        console.log(db);
    }

    const handleImageUpload = async ({ target }) => {
        setIsUploadingImage(true);        
        const file = target.files[0];
        const reader = new window.FileReader();
        console.log(reader.readyState);
        reader.readAsArrayBuffer(file);
        reader.onloadend = async () => {
            let imageData = Buffer(reader.result);
            console.log(imageData);
            ipfsImageUpload(imageData);  
        }
    }

    const ipfsImageUpload = async (imageData) => {
        const file = await ipfs.add(imageData);
        console.log(file.path);
        let url = `https://ipfs.io/ipfs/${file.path}`
        console.log(url);
        setPosterUrl(url);
        setIsUploadingImage(false);
    }

    const handleInput = ({ target }, setter) => {
        setter(target.value);
    }

    const createStreamSubmit = async () => {
        setCreatingStream(true);
        const instance = axios.create({
            baseURL: "https://publish.voodfy.com"
        });
        instance.defaults.headers.common["Authorization"] = `Token ${process.env.REACT_APP_VOODFY_ACCESS_TOKEN}`;
        instance.post("/v1/transmissions", {
            title: streamTitle,
            description: streamDescription,
            poster: posterUrl,
        })
        .then((response) => {
            let streamUrl = response.data.result.transmission.rtmpURL;
            let streamKey = response.data.result.transmission.streamKey;
            setStreamUrl(streamUrl);
            setStreamKey(streamKey);
            setAfterStreamCreated(true);
            setCreatingStream(false);
        })
        .catch((error) => {
            console.log(error);
            setCreatingStream(false);
        })
    }

    return (
        <VStack width="100%">
            <HStack width="100%">
                <Heading color="pink.500">Streams</Heading>
                <Spacer />
                <Button colorScheme="pink" onClick={onOpen}>+ Create A Stream</Button>
            </HStack>
            <Divider color="pink" />
            <Table>
                <Thead>
                    <Tr>
                        <Th>Video</Th>
                        <Th>Status</Th>
                        <Th>Options</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
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
                    }
                </Tbody>
            </Table>
            <Modal size="lg" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    {
                        afterStreamCreated ?
                        <>
                        <ModalHeader>
                            <HStack>
                                <RiCheckboxCircleFill fill="#E6017A" /> 
                                <Heading size="md">Stream Created</Heading>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack alignItems="flex-start" spacing={5}>
                                <HStack>
                                    <Text>Stream Url: </Text>
                                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">{streamUrl}</Tag>                             
                                </HStack>
                                <HStack>
                                    <Text>Stream Key: </Text>
                                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">{streamKey}</Tag>
                                </HStack>
                                <Box alignSelf="center">
                                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">This is the only time you will see the stream key.</Tag>
                                </Box>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <HStack width="100%">
                            </HStack>
                        </ModalFooter>
                        </>
                        :
                        <>
                        <ModalHeader>Create Stream</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={3}>
                                {
                                    isUploadingImage ?
                                    <Spinner color="pink.500" />
                                    :
                                    <img src={posterUrl} />
                                }
                                <FormControl id="name" isRequired>
                                    <FormLabel>Stream Name</FormLabel>
                                    <Input focusBorderColor="pink.500" value={streamTitle} onChange={(e) => handleInput(e, setStreamTitle)} />
                                </FormControl>
                                <FormControl id="description" isRequired>
                                    <FormLabel>Stream Description</FormLabel>
                                    <Textarea value={streamDescription} onChange={(e) => handleInput(e, setStreamDescription)} focusBorderColor="pink.500" />
                                </FormControl>
                                <FormControl id="streamPoster">
                                    <FormLabel>Stream Poster</FormLabel>
                                    <Input focusBorderColor="pink.500" onChange={handleImageUpload} type="file" />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <HStack width="100%">
                                <Button isLoading={creatingStream} onClick={createStreamSubmit} colorScheme="pink">Create Stream</Button>
                            </HStack>
                        </ModalFooter>
                        </>
                    }
                </ModalContent>
            </Modal>
        </VStack>
    )
}

export default Streams;