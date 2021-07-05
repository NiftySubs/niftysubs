import { useState, useEffect, useCallback } from "react";
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
    useToast,
} from "@chakra-ui/react";
import Web3 from "web3";
import SuperChatContractABI from "../abis/superChat";

const web3 = new Web3(window.ethereum);
const SuperChatContract = new web3.eth.Contract(SuperChatContractABI, "0xE85b157E7685Ce6Bc35fd33c1dfb7E887E7470AF")

function SuperChats({ currentAccount }) {

    const [ superChatReceived, setSuperChatReceived ] = useState([]);
    const [ superChatSent, setSuperChatSent ] = useState([]);
    const [ isLoadingSuperChats, setIsLoadingSuperChats ] = useState(false);

    const getSuperChats = useCallback(
        async () => {
            setIsLoadingSuperChats(true);
            const superChatReceivedId = await SuperChatContract.methods.superchatReceived().call({ from: currentAccount });
            const superChatSentId = await SuperChatContract.methods.superChatPaid().call({ from: currentAccount });
            let superChatReceived = [];
            let superChatSent = [];
            for(const id of superChatReceivedId) {
                const superchat = await SuperChatContract.methods.superchatFromIndex(id).call();
                superChatReceived.push({...superchat, id: id});
            }
            setSuperChatReceived([...superChatReceived]);
            for(const id of superChatSentId) {
                const superchat = await SuperChatContract.methods.superchatFromIndex(id).call();
                superChatSent.push({...superchat, id: id});
            }
            setSuperChatSent([...superChatSent]);
            setIsLoadingSuperChats(false);
        },
        [currentAccount]
    )
    useEffect(() => {
        getSuperChats();
    }, [currentAccount, getSuperChats]);

    return (
        <VStack width="100%">
            <HStack width="100%">
                <Heading color="pink.500">SuperChats</Heading>
            </HStack>
            <Divider color="pink" />
            {
                currentAccount ?
                <HStack width="100%">
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>From</Th>
                                <Th>Message</Th>
                                <Th>Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                isLoadingSuperChats ?
                                <Spinner />
                                :
                                superChatReceived.map((superchat) => {
                                    return (
                                        <Tr key={superchat["id"]}>
                                            <Td>
                                                <Text>
                                                    {`${superchat["sender"].substr(0,5)}...${superchat["sender"].substr(-5)}`}
                                                </Text>
                                            </Td>
                                            <Td>
                                                {superchat["message"]}
                                            </Td>
                                            <Td>
                                                {`${web3.utils.fromWei(superchat["amount"], "ether")} ETH`}
                                            </Td>
                                        </Tr>
                                    );
                                })
                            }
                        </Tbody>
                    </Table>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>To</Th>
                                <Th>Message</Th>
                                <Th>Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                isLoadingSuperChats ?
                                <Spinner />
                                :
                                superChatSent.map((superchat) => {
                                    return (
                                        <Tr>
                                            <Td>
                                                <Text>
                                                    {`${superchat["receiver"].substr(0,5)}...${superchat["receiver"].substr(-5)}`}
                                                </Text>
                                            </Td>
                                            <Td>
                                                {superchat["message"]}
                                            </Td>
                                            <Td>
                                                {`${web3.utils.fromWei(superchat["amount"], "ether")} ETH`}
                                            </Td>
                                        </Tr>
                                    );
                                })
                            }
                        </Tbody>
                    </Table>
                </HStack>
                :
                null
            }
        </VStack>
    );
}

export default SuperChats;