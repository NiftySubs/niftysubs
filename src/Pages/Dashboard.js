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
    Center
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
                        </Route>
                        <Route exact  path={`${path}/superchats`}>
                            {
                                <Heading>SuperChats</Heading>
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