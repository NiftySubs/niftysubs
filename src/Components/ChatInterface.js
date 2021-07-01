import { VStack, Input, HStack, Text, Button, Spacer, Box } from "@chakra-ui/react";
import seedColor from "seed-color";
function ChatInterface() { 

    const messages = [{sender: "harpal", message: "hi elio!"}, {sender: "elio", message: "hey harpal!"}]

    return (
        <VStack margin={0} spacing={4} height="calc(100vh - 65px)" backgroundColor="white" padding={3} alignItems="flex-start" width="20vw">
            <VStack alignItems="flex-start"  width="100%">
                <Text>Chat</Text>
                <VStack justifyContent="flex-end" height="calc(100vh - 65px - 23vh)">
                    <VStack alignItems="flex-start" justifySelf="flex-end">
                        {
                            messages.map(message => {
                                return (
                                    <Box>
                                        <Text color={seedColor(message.sender).toHex()} as="i">{message.sender}</Text>
                                        <Text ml="10px" as="span">{message.message}</Text>
                                    </Box>
                                );
                            })
                        }
                    </VStack>
                    
                </VStack>
            </VStack>
            <VStack justifySelf="flex-end" width="100%">
                <Input width="100%" placeholder="Send a message" backgroundColor="gray.200" />
                <HStack width="100%">
                    <Button colorScheme="red">SuperChat</Button>
                    <Spacer />
                    <Button colorScheme="facebook">Send</Button>
                </HStack>
            </VStack>
        </VStack>
    );  
}

export default ChatInterface;