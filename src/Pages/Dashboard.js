import { 
    HStack, 
    VStack, 
    Button, 
    Tag,
} from "@chakra-ui/react";
import { RiSignalTowerFill, RiChatHeartFill } from "react-icons/ri";
import { BrowserRouter as Router, Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Streams from  "../Components/Streams";
import { FaHandHoldingHeart } from "react-icons/fa";
import Fundraisers from "../Components/Fundraisers";
import SuperChats from "../Components/SuperChats";


function Dashboard({ currentAccount }) {

    let { path, url } = useRouteMatch();

    return (
        <HStack alignItems="flex-start" py="50px" px="100px">
            {
                currentAccount ?
                <Router>

                    <VStack alignItems="flex-start">
                        <Link to={`${url}/streams`}><Button justifyContent="flex-start" textAlign="left"  width="200px" variant="ghost" leftIcon={<RiSignalTowerFill />}>Streams</Button></Link>
                        <Link to={`${url}/superchats`}><Button justifyContent="flex-start" width="200px" variant="ghost" leftIcon={<RiChatHeartFill />}>SuperChats</Button></Link>
                        <Link to={`${url}/fundraisers`}><Button justifyContent="flex-start" width="200px" variant="ghost" leftIcon={<FaHandHoldingHeart />}>Fundraisers</Button></Link>
                    </VStack>
                    <VStack alignSelf="flex-start" width="100%">
                        <Switch>
                            <Route exact path={`${path}/`}>
                                <Streams currentAccount={currentAccount} />
                            </Route>
                            <Route exact  path={`${path}/superchats`}>
                                {
                                    <SuperChats currentAccount={currentAccount} />
                                }
                            </Route>
                            <Route exact  path={`${path}/fundraisers`}>
                                <Fundraisers currentAccount={currentAccount} />
                            </Route>
                        </Switch>
                    </VStack>
                </Router>
                :
                <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Connect Wallet First</Tag>
            }
        </HStack>
        
    );
}

export default Dashboard;