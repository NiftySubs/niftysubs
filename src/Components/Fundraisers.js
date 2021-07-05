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
import FundraisingContractABI from "../abis/fundraising";
import { FaExternalLinkAlt } from "react-icons/fa";

const web3 = new Web3(window.ethereum);
const FundraisingContract = new web3.eth.Contract(FundraisingContractABI, "0x608DA975Dd743Bde9ab6329258E4AD3619A533EF");

function Fundraisers({ currentAccount }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ isLoadingFundraises, setIsLoadingFundraises ] = useState(false); 
    const [ fundraises, setFundraises ] = useState([]);
    const [ fundraiseAgenda, setFundraiseAgenda ] = useState("");
    const [ fundraiseGoal, setFundraiseGoal ] = useState("");
    const [ fundraiseBeneficiary, setFundraiseBeneficiary ] = useState("");
    const [ fundraiseDeadline, setFundraiseDeadline ] = useState("");


    

    const getFundraises = useCallback(async () => {
        setIsLoadingFundraises(true);
        const fundraisesId = await FundraisingContract.methods.getFundraises(currentAccount).call();
        let fundraises = [];
        for(const id of fundraisesId) {
            const fundraise = await FundraisingContract.methods.getFundraise(id).call();
            fundraises.push({...fundraise, id: id});
        }
        setFundraises([...fundraises]);
        setIsLoadingFundraises(false);
    },[currentAccount]);

    useEffect(() => {
        getFundraises();
    }, [getFundraises]);

    

    const init = async () => {
        let getBlock = await web3.eth.getBlockNumber();
        FundraisingContract.once("FundraiseCreated", {filter: { fundraiser: currentAccount }, fromBlock: getBlock }, function(error, event) {
            console.log(event);
            getFundraises();
        });
        getFundraises();        
    }

    const handleInput = ({ target }, setter) => {
        setter(target.value);
    }

    const createFundraise = async (modalCloser) => {
        let deadlineDate = new Date(fundraiseDeadline).valueOf() / 1000;
        
        let fundraiseGoalWei = web3.utils.toWei(fundraiseGoal);
        FundraisingContract.methods.createFundraise(
            fundraiseBeneficiary,
            fundraiseGoalWei,
            fundraiseAgenda,
            deadlineDate
        ).send({ from: currentAccount })
        .then((receipt) => {
            console.log(receipt);
            modalCloser();
            getFundraises();
        })
        .catch((error, receipt) => {
            console.log(error);
        })
    }


    const claimFunds = async (id) => {
        FundraisingContract.methods.claimDonation(id)
        .call({ from: currentAccount })
        .then((receipt) => {
            console.log(receipt);
        })
        .catch((error, receipt) => {
            toast({
                position: "bottom-right",
                title: `Try Again!`,
                status: "error",
                isClosable: true
            }) 
        })

    }

    return (
        <VStack width="100%">
            <HStack width="100%">
                <Heading color="pink.500">Fundraisers</Heading>
                <Spacer />
                <Button colorScheme="pink" onClick={onOpen}>+ Create A Fundraiser</Button>
            </HStack>
            <Divider color="pink" />
            {
                currentAccount ?
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Fundraise Id</Th>
                            <Th>Fundraise Agenda</Th>
                            <Th>Fundraise Beneficiary</Th>
                            <Th>Funds Raised</Th>
                            <Th>Goal</Th>
                            <Th>Deadline</Th>
                            <Th>Claim</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            isLoadingFundraises ?
                            <Spinner />
                            :
                            fundraises.map((fundraise) => {
                                return (
                                    <Tr key={fundraise["id"]}>
                                        <Td>{fundraise["id"]}</Td>
                                        <Td>
                                            <HStack><Text>{fundraise["fundraiseAgenda"]}</Text><FaExternalLinkAlt /></HStack>
                                        </Td>
                                        <Td>
                                            <Text>{`${fundraise["beneficiary"].substr(0,5)}...${fundraise["beneficiary"].substr(-5)}`}</Text>                                        
                                        </Td>
                                        <Td>
                                            {`${web3.utils.fromWei(fundraise["amountFunded"], "ether")} ETH`}
                                        </Td>
                                        <Td>
                                            {`${web3.utils.fromWei(fundraise["fundraiseGoal"], "ether")} ETH`}
                                        </Td>
                                        <Td>
                                            <Tag>{`${new Date(parseInt(fundraise["fundraiseDeadline"]) * 1000).toDateString()}`}</Tag>
                                        </Td>
                                        <Td>
                                            <Button onClick={() => claimFunds(fundraise["id"])}>Claim</Button>
                                        </Td>
                                    </Tr>
                                );
                            })
                        }
                    </Tbody>
                </Table>
                :
                null
            }
            
            <Modal size="lg" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Fundraiser</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <FormControl id="agenda" isRequired>
                                <FormLabel>Fundraise Agenda</FormLabel>
                                <Input focusBorderColor="pink.500" value={fundraiseAgenda} onChange={(e) => handleInput(e, setFundraiseAgenda)} />
                            </FormControl>
                            <FormControl id="beneficiary" isRequired>
                                <FormLabel>Fundraise Beneficiary</FormLabel>
                                <Input focusBorderColor="pink.500" value={fundraiseBeneficiary} onChange={(e) => handleInput(e, setFundraiseBeneficiary)} />
                            </FormControl>
                            <FormControl id="goal" isRequired>
                                <FormLabel>Fundraise Goal</FormLabel>
                                <Input focusBorderColor="pink.500" value={fundraiseGoal} onChange={(e) => handleInput(e, setFundraiseGoal)} />
                            </FormControl>
                            <FormControl id="agenda" isRequired>
                                <FormLabel>Fundraise Deadline</FormLabel>
                                <Input type="date" focusBorderColor="pink.500" value={fundraiseDeadline} onChange={(e) => handleInput(e, setFundraiseDeadline)} />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => createFundraise(onClose)}>Create Fundraise</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    )
}

export default Fundraisers;
