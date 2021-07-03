import Header from "../Components/Header";
import { HStack, VStack, Button, Heading } from "@chakra-ui/react";
import { RiSignalTowerFill, RiMoneyDollarCircleFill, RiChatHeartFill } from "react-icons/ri";
import { BrowserRouter as Router, Link, Route, useRouteMatch } from "react-router-dom";


function Dashboard() {

    let { path, url } = useRouteMatch();

    return (
        <HStack py="50px" px="100px">
            <Router>

                <VStack alignItems="flex-start">
                    <Link to={`${url}/streams`}><Button textAlign="left"  width="200px" variant="ghost" leftIcon={<RiSignalTowerFill />}>Streams</Button></Link>
                    <Link to={`${url}/flows`}><Button width="200px" variant="ghost" leftIcon={<RiMoneyDollarCircleFill />}>Flows</Button></Link>
                    <Link to={`${url}/superchats`}><Button width="200px" variant="ghost" leftIcon={<RiChatHeartFill />}>SuperChats</Button></Link>
                    <Link to={`${url}/superchats`}><Button width="200px" variant="ghost" leftIcon={<RiSignalTowerFill />}>Streams</Button></Link>
                </VStack>
                <VStack>
                    <Route exact path={`${path}/streams`}>
                        {
                            <Heading>Streams</Heading>
                        }
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
                </VStack>
            </Router>
        </HStack>
    );
}

export default Dashboard;