import Header from "../Components/Header";
import { 
    HStack, 
    VStack, 
    Button, 
    Heading,
    Spacer,
    Divider,
    Table,
    Thead,
    Tr,
    Th,
    Center,
    Tbody,
    Tfoot,
    Td,
    TableCaption,
} from "@chakra-ui/react";
import { RiSignalTowerFill, RiMoneyDollarCircleFill, RiChatHeartFill } from "react-icons/ri";
import { BrowserRouter as Router, Link, Route, Switch, useRouteMatch } from "react-router-dom";
import { create } from "ipfs-http-client";
import Streams from  "../Components/Streams";
import { FaHandHoldingHeart } from "react-icons/fa";


function Dashboard() {

    let { path, url } = useRouteMatch();



    return (
        <HStack py="50px" px="100px">
            <Router>

                <VStack alignItems="flex-start">
                    <Link to={`${url}/streams`}><Button justifyContent="flex-start" textAlign="left"  width="200px" variant="ghost" leftIcon={<RiSignalTowerFill />}>Streams</Button></Link>
                    <Link to={`${url}/flows`}><Button justifyContent="flex-start" width="200px" variant="ghost" leftIcon={<RiMoneyDollarCircleFill />}>Flows</Button></Link>
                    <Link to={`${url}/superchats`}><Button justifyContent="flex-start" width="200px" variant="ghost" leftIcon={<RiChatHeartFill />}>SuperChats</Button></Link>
                    <Link to={`${url}/fundraisers`}><Button justifyContent="flex-start" width="200px" variant="ghost" leftIcon={<FaHandHoldingHeart />}>Fundraisers</Button></Link>
                </VStack>
                <VStack alignSelf="flex-start" width="100%">
                    <Switch>
                        <Route exact path={`${path}/streams`}>
                            <Streams />
                        </Route>
                        <Route exact  path={`${path}/flows`}>
                            {
                                <Heading>Flows</Heading>
                            }
                            {   
                           <Table variant="striped" width="100vh" height="50vh" size="lg">
                           <Thead>
                             <Tr>
                               <Th isNumeric>Stream Flow ID</Th>
                               <Th isNumeric>Flow Sum</Th>
                               <Th isNumeric>Flow Rate</Th>
                               <Th isNumeric>Flow lastUpdate</Th>
                               <Th isNumeric>Flow Token</Th>
                               <Th isNumeric>Flow Owner</Th>
                               <Th isNumeric>Flow Receipient</Th>
                             </Tr>
                           </Thead>
                           <Tbody>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumberic><b>ETH</b> 0.2 </Td>
                               <Td isNumeric>3</Td>
                               <Td isNumeric>01-01-2021</Td>
                               <Td isNumeric>ETH</Td>
                               <Td isNumeric>0x234</Td>
                               <Td isNumeric>0x123</Td>
                             </Tr>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumberic><b>ETH</b> 0.2 </Td>
                               <Td isNumeric>3</Td>
                               <Td isNumeric>01-01-2021</Td>
                               <Td isNumeric>ETH</Td>
                               <Td isNumeric>0x234</Td>
                               <Td isNumeric>0x123</Td>
                             </Tr>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumberic><b>ETH</b> 0.2 </Td>
                               <Td isNumeric>3</Td>
                               <Td isNumeric>01-01-2021</Td>
                               <Td isNumeric>ETH</Td>
                               <Td isNumeric>0x234</Td>
                               <Td isNumeric>0x123</Td>
                             </Tr>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumberic><b>ETH</b> 0.2 </Td>
                               <Td isNumeric>3</Td>
                               <Td isNumeric>01-01-2021</Td>
                               <Td isNumeric>ETH</Td>
                               <Td isNumeric>0x234</Td>
                               <Td isNumeric>0x123</Td>
                             </Tr>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumberic><b>ETH</b> 0.2 </Td>
                               <Td isNumeric>3</Td>
                               <Td isNumeric>01-01-2021</Td>
                               <Td isNumeric>ETH</Td>
                               <Td isNumeric>0x234</Td>
                               <Td isNumeric>0x123</Td>
                             </Tr>
                           </Tbody>
                            <TableCaption>Stream Flow Analytics</TableCaption>
                         </Table> 
                        }
                        </Route>
                        <Route exact  path={`${path}/superchats`}>
                            {
                                <Heading>SuperChats</Heading>
                            }
                            {   
                           <Table variant="striped" width="100vh" height="50vh" size="lg">
                           <Thead>
                             <Tr>
                               <Th isNumeric>Super Chat ID</Th>
                               <Th isNumeric>Transaction</Th>
                               <Th isNumeric>Address</Th>
                               <Th isNumeric>Underlying Address</Th>
                               <Th isNumeric>SuperToken Name</Th>
                               <Th isNumeric>Symbol</Th>
                             </Tr>
                           </Thead>
                           <Tbody>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumeric>0X123</Td>
                               <Td isNumeric>0X234</Td>
                               <Td isNumeric>0X567</Td>
                               <Td isNumeric>Hola</Td>
                               <Td isNumeric>ETH</Td>
                             </Tr>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumeric>0X123</Td>
                               <Td isNumeric>0X234</Td>
                               <Td isNumeric>0X567</Td>
                               <Td isNumeric>Hola</Td>
                               <Td isNumeric>ETH</Td>
                             </Tr>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumeric>0X123</Td>
                               <Td isNumeric>0X234</Td>
                               <Td isNumeric>0X567</Td>
                               <Td isNumeric>Hola</Td>
                               <Td isNumeric>ETH</Td>
                             </Tr>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumeric>0X123</Td>
                               <Td isNumeric>0X234</Td>
                               <Td isNumeric>0X567</Td>
                               <Td isNumeric>Hola</Td>
                               <Td isNumeric>ETH</Td>
                             </Tr>
                             <Tr>
                               <Td isNumeric>1</Td>
                               <Td isNumeric>0X123</Td>
                               <Td isNumeric>0X234</Td>
                               <Td isNumeric>0X567</Td>
                               <Td isNumeric>Hola</Td>
                               <Td isNumeric>ETH</Td>
                             </Tr>
                             
                           </Tbody>
                            <TableCaption>Super Chat Analytics</TableCaption>
                         </Table> 
                        }
                        </Route>
                        <Route exact  path={`${path}/fundraisers`}>
                            {
                                <Heading>Fundraisers</Heading>
                            }
                        </Route>
                    </Switch>
                </VStack>
            </Router>
        </HStack>
    );
}

export default Dashboard;