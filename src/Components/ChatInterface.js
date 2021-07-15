import { 
    VStack, 
    Input, 
    HStack, 
    Text, 
    Button, 
    Box, 
    Tag, 
    Avatar, 
    Flex, 
    Image, 
    useToast
} from "@chakra-ui/react";
import seedColor from "seed-color";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import IPFSpubsub from "orbit-db-pubsub";
import svgAvatarGenerator from "../utils/avatar";
import Web3 from "web3";
import SuperchatABI from "../abis/superChat";
import { connectToInfuraIpfs, connectToOrbitDb } from "../utils/ipfs";

var ipfs;
var orbitdb;
var db;
var pubsub;
var web3;
var SuperChatContract;

function ChatInterface({ currentAccount, isLocked, pubsubTopic }) {
    const toast = useToast();
    const [ isConnectingToDatabase, setIsConnectingToDatabase ] = useState(false);
    const [ isStreaming, setIsStreaming ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ messages, setMessages ] = useState([]);
    const [ superchatContractAddress, setSuperchatContractAddress ] = useState("0xE85b157E7685Ce6Bc35fd33c1dfb7E887E7470AF");
    const [ isSuperChatting, setIsSuperChatting ] = useState(false);
    const [ superChatValue, setSuperChatValue ] = useState("0");
    const [ loadingText, setLoadingText ] = useState("");
    
    useEffect(() => {
        init();
    }, [pubsubTopic]);

    useEffect(() => {
        if(currentAccount != undefined)
            setCurrentAccount();
    }, [currentAccount]);
    
    useEffect(() => {
    }, [messages, isLocked]);

    const setCurrentAccount = async () => {
        web3 = new Web3(window.ethereum);
        SuperChatContract = new web3.eth.Contract(SuperchatABI, superchatContractAddress);
    }

    const init = async () => {
        try {
            setIsConnectingToDatabase(true);
            setLoadingText("Connecting To IPFS");
            ipfs = await connectToInfuraIpfs();
            setLoadingText("Connecting To Database");
            db = await connectToOrbitDb(ipfs, process.env.REACT_APP_ORBIT_DB_ADDRESS);
            setLoadingText("Connecting to PubSub");
            pubsub = new IPFSpubsub(ipfs, process.env.REACT_APP_ORBIT_DB_ADDRESS);
            subscribeToTopic();
        } catch(err) {
            console.log(err);
        }
    } 

    const subscribeToTopic = async () => {
        await pubsub.subscribe(pubsubTopic, handleMessage, handleNewPeer);
        console.log(`Subscribed to ${pubsubTopic}`);
        setIsConnectingToDatabase(false);
    }

    const handleMessage = (topic, message) => {
        setMessages(messages => [...messages, message]);
    }

    const handleNewPeer = (address, peer) => {
       
    }

    const handleChange = ({ target }) => {
        setMessage(target.value);
    } 

    const handleSuperChatValue = ({ target }) => {
        setSuperChatValue(target.value);
    }

    const sendMessage = async () => {
        let newMessage = await pubsub.publish(pubsubTopic, { _id: uuidv4(), message: message, sender: currentAccount, isSuperChat: false, value: 0 });
        setMessage("");
    }

    const sendSuperChat = async () => {
        if(parseFloat(superChatValue) > 0) {
            setIsSuperChatting(true);
            console.log(superChatValue);
            let weiAmount = web3.utils.toWei(superChatValue, "ether");
            SuperChatContract.methods.superChat("0x22b2DD2CFEF2018D15543c484aceF6D9B5435863", weiAmount, message, uuidv4()).send({ from: currentAccount, value: weiAmount })
            .on("transactionHash", (hash) => {
                console.log(hash);
                sendSuperChatMessage(message, superChatValue);
                setIsSuperChatting(false);
            })
            .on("error", (error, receipt) => {
                toast({
                    position: "bottom-right",
                    title: `Request Rejected`,
                    status: "error",
                    isClosable: true
                })
                setIsSuperChatting(false);
            })
        } else {
            toast({
                position: "bottom-right",
                title: `SuperChat value is 0`,
                status: "error",
                isClosable: true
            })
        }
    }

    const sendSuperChatMessage = async (message, value) => {
        let newMessage = await pubsub.publish(pubsubTopic, { _id: uuidv4(), message: message, sender: currentAccount, isSuperChat: true, value: superChatValue });
        setMessage("");
        setSuperChatValue(0);
        setIsSuperChatting(false);
    }

    return (
        <VStack margin={0} spacing={4} height="calc(100vh - 65px)" backgroundColor="white" padding={3} alignItems="flex-start" width="20vw">
            {
                isConnectingToDatabase ?
                <Tag justifySelf="center" alignSelf="center">{loadingText}</Tag>
                :
                <>
                    <>
                        <Text fontSize="20px">Chat</Text>
                        <VStack width="100%" justifyContent="flex-end" height="calc(100vh - 65px - 23vh)">
                            <VStack overflowY="scroll" width="100%" alignItems="flex-start" justifySelf="flex-end">
                                {
                                    messages.length == 0 ?
                                    null
                                    :
                                    messages.map(message => {
                                        return (
                                            message.isSuperChat ? 
                                            <VStack width="100%" key={message._id} borderRadius={5} background={seedColor(message.sender).toHex()}>
                                                <HStack color="white" width="100%" px={5} py={2}>
                                                    <Avatar backgroundColor="white" borderStyle="solid" borderColor="#E6017A" borderWidth="2px" size="md" bg="transparent" src={svgAvatarGenerator(message.sender, {dataUri: true})} />
                                                    <VStack alignItems="flex-start" width="100%">
                                                        <Text>{message.sender.substr(0,6)}...{message.sender.substr(-6)}</Text>
                                                        <Text margin="0 !important">{message.value} ETH</Text>
                                                    </VStack>
                                                </HStack>
                                                <Flex px={8} py={3} width="100%" backdropFilter="brightness(1.5)" color="white">
                                                    <Text>{message.message}</Text>
                                                </Flex>
                                            </VStack>
                                            :
                                            <Box key={message._id} maxWidth="18vw">
                                                <Text isTruncated color={seedColor(message.sender).toHex()} as="i">{message.sender.substr(0,3)}...{message.sender.substr(-3)}</Text>
                                                <Text ml="10px" as="span">{message.message}</Text>
                                            </Box>
                                        );
                                    })
                                }
                            </VStack>  
                        </VStack>
                        <Box width="100%">
                            {
                                isLocked ? 
                                <VStack alignItems="center" mt="40px !important" justifySelf="flex-end" justifyItems="center" width="100%">
                                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Please Start Streaming To Chat</Tag>
                                </VStack>
                                :
                                <VStack justifySelf="flex-end" width="100%">
                                    <Input isRequired focusBorderColor="pink.400" isRequired={true} marginTop="0 !important" value={message} onChange={handleChange} width="100%" placeholder="Send a message" backgroundColor="gray.200" />
                                    <HStack width="100%">
                                        <Input width="80px" value={superChatValue} focusBorderColor="pink.400" onChange={handleSuperChatValue} />
                                        <Button isLoading={isSuperChatting} onClick={sendSuperChat} colorScheme="red">SuperChat</Button>
                                        <Button onClick={sendMessage} colorScheme="facebook">Send</Button>
                                    </HStack>
                                </VStack>
                            }
                        </Box>
                    </>
                </>
            }
        </VStack>
    );  
}

export default ChatInterface;