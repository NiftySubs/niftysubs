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
    Input,
    Image,
    Textarea,
    Spinner,
    Text,
    Tag,
    Box,
    Tbody,
    Td,
    useToast
} from "@chakra-ui/react";
import { init } from "events";
import { create } from "ipfs-http-client";
import OrbitDB from "orbit-db";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { RiCheckboxCircleFill } from "react-icons/ri";
import UnlockABI from "../abis/unlock";
import PublicLockABI from "../abis/publicLock";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import Identities from 'orbit-db-identity-provider';


const ipfsOptions = {
    EXPERIMENTAL: {
      pubsub: true
    },
    repo: './ipfs'
}

const ipfs = create("http://4f370b3fefd1.ngrok.io/", ipfsOptions);

const web3 = new Web3(window.ethereum);
const unlockContract = new web3.eth.Contract(UnlockABI, "0xd8c88be5e8eb88e38e6ff5ce186d764676012b0b");

function Streams({ currentAccount }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const [ posterUrl, setPosterUrl ] = useState("");
    const [ isUploadingImage, setIsUploadingImage ] = useState(false);
    const [ streamTitle, setStreamTitle ] = useState("");
    const [ streamDescription, setStreamDescription ] = useState("");
    const [ streamUrl, setStreamUrl ] = useState("");
    const [ streamKey, setStreamKey ] = useState("");
    const [ lockAddress, setLockAddress ] = useState("");
    const [ afterStreamCreated, setAfterStreamCreated ] = useState(false);
    const [ creatingStream, setCreatingStream ] = useState(false);
    const [ db, setdb ] = useState();
    const [ loadingText, setLoadingText ] = useState("");
    const [ streams, setStreams ] = useState([]);
    const [ isPageLoading, setIsPageLoading ] = useState(true);
    // const streams = [{imageUrl: "https://ipfs.io/ipfs/QmVv8U6UiZQEchGXKRnFnYNmMXsCdyQR1n8YzGk66fYJv3", streamTitle: "First Stream", status: "created" }]

    const options = { id: 'test1' }

    const getStreams = useCallback(async () => {
        const orbitdb = await OrbitDB.createInstance(ipfs);
        // const identity = await Identities.createIdentity(options);
        // console.log(identity);
        // const orbitdb = await OrbitDB.createInstance(ipfs, { identity: identity })
        let db = await orbitdb.docs("/orbitdb/zdpuAz6e2rGQ917hroubfJuazTQDTHdvDPhm7QhKkMiu64SD7/videosdb");
        console.log(db);
        await db.load();
        setdb(db);
        const streams = await db.query((docs) => docs.creator == currentAccount);
        setStreams([...streams]);
        console.log(streams);
        setIsPageLoading(false);
    }, [currentAccount]);

    useEffect(() => {
        getStreams();
    }, [getStreams]);

    const init = async () => {
        getStreams();
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

    const sendData = async () => {
        const hash1 = await db.put({ _id: 'QmAwesomeIpfsHash1', creator_Address: 'abcd1', stream_Url: 'xyz1', lockAddress: 'abc1', chatDBAddr: 'chat1'});
        console.log(hash1);
    }

    const createStreamSubmit = async () => {
        setCreatingStream(true);
        setAfterStreamCreated(false);
        setLoadingText("Creating Stream");
        const instance = axios.create({
            baseURL: "https://publish.voodfy.com"
        });
        instance.defaults.headers.common["Authorization"] = `Token ${process.env.REACT_APP_VOODFY_ACCESS_TOKEN}`;
        instance.post("/v1/transmissions", {
            title: streamTitle,
            description: streamDescription,
            poster: posterUrl,
        })
        .then(async (response) => {
            let streamUrl = response.data.result.transmission.rtmpURL;
            let streamKey = response.data.result.transmission.streamKey;
            let videoId = response.data.result.transmission.id;
            setStreamUrl(streamUrl);
            setStreamKey(streamKey);
            console.log(response);
            setLoadingText("Creating Lock");
            createLock(videoId);
        })
        .catch((error) => {
            console.log(error);
            toast({
                position: "bottom-right",
                title: `Try Again!`,
                status: "error",
                isClosable: true
            }) 
            setCreatingStream(false);
        })
    }

    const createLock = async (videoId) => {
        unlockContract.methods.createLock(
            "2153999999",
            "0x0000000000000000000000000000000000000000",
            "1000000000000000000000000000000000000000000",
            "0",
            "lockforvideo",
            web3.utils.asciiToHex(uuidv4()).toString().substr(0,25)
        ).send({ from: currentAccount })
        .then(async (receipt) => {
            let lockAddress = receipt.events.NewLock.returnValues.newLockAddress;
            setLoadingText("Waiting For Approval");
            makeSuperAppLockManager(lockAddress, videoId);
        })
        .catch((error, receipt) => {
            console.log(error);
        })
    }

    const makeSuperAppLockManager = async (lockAddress, videoId) => {
        const PublicLockContract = new web3.eth.Contract(PublicLockABI, lockAddress);
        PublicLockContract.methods.addLockManager("0xc309a55038868645ff39889d143436d2D6C109bE").send({ from: currentAccount })
        .then(async (receipt) => {
            setLoadingText("Storing Video Data");
            const hash = await db.put({ _id: videoId, streamTitle, streamDescription, posterUrl, creator: currentAccount, pubsubTopic: videoId, streamUrl: `https://embed.voodfy.com/${videoId}`, lockAddress: lockAddress });
            console.log(hash);
            let stream = { _id: videoId, streamTitle, streamDescription, posterUrl, creator: currentAccount, pubsubTopic: videoId, streamUrl: `https://embed.voodfy.com/${videoId}`, lockAddress: lockAddress };
            setStreams(streams => [...streams, stream]);  
            console.log(streams); 
            setLockAddress(lockAddress);
            setAfterStreamCreated(true);
            setCreatingStream(false);
            setStreamTitle("");
            setStreamDescription("");
            setPosterUrl("");
            setLoadingText("");
        })
        .catch((error, receipt) => {
            console.log(error);
        });
        setLoadingText("Making SuperApp Lock Manager");
    }

    return (
        <VStack width="100%">
            <HStack width="100%">
                <Heading color="pink.500">Streams</Heading>
                <Spacer />
                <Button isLoading={isPageLoading} colorScheme="pink" onClick={onOpen}>+ Create A Stream</Button>
            </HStack>
            <Divider color="pink" />
            {
                isPageLoading ? 
                <Spinner colorScheme="pink"/>
                :
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
                                    <Tr key={stream._id}>
                                        <Td>
                                            <HStack spacing={4}>
                                                <Image width="200px" src={stream.posterUrl} />
                                                <Text alignSelf="flex-start">{stream.streamTitle}</Text>
                                            </HStack>
                                        </Td>
                                        <Td>
                                            <Tag textTransform="uppercase">{stream._id}</Tag>
                                        </Td>
                                        <Td>

                                        </Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            }
            
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
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
                                <HStack>
                                    <Text>Lock Address: </Text>
                                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">{lockAddress}</Tag>
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
                                <Button loadingText={loadingText} isLoading={creatingStream} onClick={createStreamSubmit} colorScheme="pink">Create Stream</Button>
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