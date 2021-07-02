import { VStack, Input, HStack, Text, Button, Spacer, Box, Tag, Avatar, Flex } from "@chakra-ui/react";
import seedColor from "seed-color";
import OrbitDb, { Identities } from "orbit-db";
import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import IPFSpubsub from "orbit-db-pubsub";
import svgAvatarGenerator from "../utils/avatar";

var orbitdb;
var db;
var pubsub;

function ChatInterface({ currentAccount, isLocked }) {
    const [isConnectingToDatabase, setIsConnectingToDatabase ] = useState(false);
    const [ isStreaming, setIsStreaming ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ messages, setMessages ] = useState([]);
    const [ topic, setTopic ] = useState("video");

    useEffect(() => {
        
    }, []);
    
    useEffect(() => {
        if(currentAccount)
            init();
    }, [currentAccount]);

    useEffect(() => {

    }, [messages, isLocked]);

    const init = async () => {
        const ipfs = create("http://127.0.0.1:5001");
        orbitdb = await OrbitDb.createInstance(ipfs);
        db = await orbitdb.docs("niftysubs");
        pubsub = new IPFSpubsub(ipfs, "niftysubs");
        // initDb();
        subscribeToTopic();
    } 

    const subscribeToTopic = async () => {
        await pubsub.subscribe(topic, handleMessage, handleNewPeer);
        console.log(`Subscribed to ${topic}`);
    }

    const handleMessage = (topic, message) => {
        // let newMessage = {_id: uuidv4(), sender: currentAccount, message: message};
        setMessages(messages => [...messages, message]);
        // console.log(message);
    }

    const handleNewPeer = (address, peer) => {
        console.log("someone joined");
        console.log(`Hello ${peer}`);
    }

    // const initDb = async () => {
    //     db.load();
    //     const prevMessages = await db.get("");
    //     setMessages(messages => [...messages, ...prevMessages]);
    //     console.log(db);
    //     db.events.on("ready", () => {
    //         console.log("Database Ready!");
    //     });
    //     db.events.on("write", (address, entry, heads) => {
    //         console.log(heads);
    //         let newMessage = { _id: heads[0].payload.value._id, sender: heads[0].payload.value.sender, message: heads[0].payload.value.message };  
    //         setMessages(messages => [...messages, newMessage]);
    //         console.log("write event");
    //     });
    //     db.events.on("peer", (peer) => {
    //         console.log(`Hello ${peer}`);
    //     });
    // }

    const handleChange = ({ target }) => {
        setMessage(target.value);
    } 

    const sendMessage = async () => {
        let newMessage = await pubsub.publish(topic, { _id: uuidv4(), message: message, sender: currentAccount, isSuperChat: false, value: 0 });
    }

    const sendSuperChat = async () => {
        let newMessage = await pubsub.publish(topic, { _id: uuidv4(), message: message, sender: currentAccount, isSuperChat: true, value: 0.1 });
    }

    return (
        <VStack margin={0} spacing={4} height="calc(100vh - 65px)" backgroundColor="white" padding={3} alignItems="flex-start" width="20vw">
            <VStack alignItems="flex-start"  width="100%">
                <Text fontSize="20px">Chat</Text>
                <VStack width="100%" justifyContent="flex-end" height="calc(100vh - 65px - 23vh)">
                    <VStack width="100%" alignItems="flex-start" justifySelf="flex-end">
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
                                                <Text margin="0 !important">{message.value}</Text>
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
            </VStack>
            {
                isLocked ? 
                <VStack mt="40px !important" justifySelf="flex-end" justifyItems="center" width="100%">
                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Please Start Streaming To Chat</Tag>
                </VStack>
                :
                <VStack justifySelf="flex-end" width="100%">
                    <Input marginTop="0 !important" value={message} onChange={handleChange} width="100%" placeholder="Send a message" backgroundColor="gray.200" />
                    <HStack width="100%">
                        <Button onClick={sendSuperChat} colorScheme="red">SuperChat</Button>
                        <Spacer />
                        <Button onClick={sendMessage} colorScheme="facebook">Send</Button>
                    </HStack>
                </VStack>
            }
            
        </VStack>
    );  
}

export default ChatInterface;