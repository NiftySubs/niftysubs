import { 
    Modal, 
    ModalOverlay,
    ModalBody,
    ModalContent,
    Link,
    Button,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useState, useEffect } from "react"; 

function NetworkModal({ isOpen, chainId, ethereum }) {

    useEffect(() => {
        
    }, [chainId])

    const toast = useToast();
    const [isAddingMainnetChain, setIsAddingMainnetChain] = useState(false);
    const [isAddingTestnetChain, setIsAddingTestnetChain] = useState(false);

    const addChain = async (chainOptions, settingChain) => {
        settingChain(true);    
        
        window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chainOptions]
        }).then(() => {
            settingChain(false);
            toast({
                position: "top-right",
                title: "Connected",
                status: "success",
                isClosable: true
            });
        })
        .catch((err, type) => {
            console.log(err);
            settingChain(false);
            toast({
                position: "top-right",
                title: `Request Rejected`,
                status: "error",
                isClosable: true
            })
        });
    }

    const mainnetOptions = {
        chainId: "0x89",
        chainName: "Matic Network",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
        blockExplorerUrls: ["https://polygonscan.com"]
    }

    const testnetOptions = {
        chainId: "0x4",
        chainName: "Rinkeby Network",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
        blockExplorerUrls: ["https://rinkeby.etherscan.io"]
    }

    return (
        <Modal
            isCentered  
            closeModalOnOverlayClick={false} 
            isOpen={isOpen}
            motionPreset="slideInBottom"
            onClose={undefined}
        >
            <ModalOverlay />
            {
                ethereum ? 
                <ModalContent>
                    <ModalHeader textAlign="center">Incorrect Chain Selected!</ModalHeader>
                    <ModalBody textAlign="center">
                        Please connect to supported Network.
                    </ModalBody>
                    <ModalFooter justifyContent="center">
                        <Button isLoading={isAddingTestnetChain} onClick={() => addChain(testnetOptions, setIsAddingTestnetChain)} colorScheme="pink">
                              Add Rinkeby Testnet  
                        </Button> 
                        <Button ml={3} isLoading={isAddingMainnetChain} onClick={() => addChain(mainnetOptions, setIsAddingMainnetChain)} colorScheme="pink" mr={3}>
                            Add Matic Mainnet 
                        </Button>
                                      
                    </ModalFooter>
                </ModalContent>
                :
                <ModalContent>
                    <ModalHeader>Metamask Not Installed!</ModalHeader>
                    <ModalBody>
                        Please Install Metamask.
                    </ModalBody>
                    <ModalFooter>
                        <Link 
                            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" 
                            isExternal
                        >
                            <Button colorScheme="blue" mr={3} rightIcon={<FaExternalLinkAlt />}>
                                Install On Chrome 
                            </Button>
                        </Link>
                        <Link href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/" isExternal>
                            <Button colorScheme="orange" rightIcon={<FaExternalLinkAlt />}>
                                Install On Firefox 
                            </Button>
                        </Link>
                    </ModalFooter>
                </ModalContent> 
            }
        </Modal>
    );
}

export default NetworkModal;