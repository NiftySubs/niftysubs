import "./HomeScreen.css";
import {
  BrowserRouter as Router,
  Link,
  withRouter
} from "react-router-dom";
import {
  Heading,
  VStack,
  HStack,
  Image,
  Tag,
  Text,
  Spinner,
  useToast,
  Grid,
  Box,
  Avatar
} from "@chakra-ui/react";
import { useState, useEffect, useCallback, useReducer } from "react";
import axios from "axios";
import { connectToInfuraIpfs, connectToOrbitDb } from "../utils/ipfs";
import { queryThread, getClient } from "../utils/textile";
import { Where } from "@textile/hub";
import svgAvatarGenerator from "../utils/avatar";

const ACTIONS = {
  SET_IPFS: "set-ipfs",
  SET_DB: "set-db",
  SET_CLIENT: "set-client",
  SET_STREAMS: "set-streams"
}

var ipfs;

function stateReducer(state, action) {
  switch(action.type) {
    case ACTIONS.SET_IPFS:
      return { ...state, ipfs: action.payload }
    case ACTIONS.SET_DB:
      return { ...state, db: action.payload }
    case ACTIONS.SET_CLIENT:
      return { ...state, client: action.payload }
    case ACTIONS.SET_STREAMS:
      return { ...state, streams: [...action.payload] }
    default:
      return state
  }
}

function Browse() {

  const [ isPageLoading, setIsPageLoading ] = useState(true); 
  const toast = useToast();
  const [ state, dispatch ] = useReducer(stateReducer, { ipfs: "", db: "", streams: [], client: "" });

  const getTransmissions = async () => {
    ipfs = await connectToInfuraIpfs();
    dispatch({ type: ACTIONS.SET_IPFS, payload: ipfs });
    let db = await connectToOrbitDb(ipfs, process.env.REACT_APP_ORBIT_DB_ADDRESS);
    await db.load();
    dispatch({ type: ACTIONS.SET_DB, payload: db });
    
    let client = await getClient();
    console.log(client);
    dispatch({ type: ACTIONS.SET_CLIENT, payload: client });

    const instance = axios.create({
      baseURL: "https://publish.voodfy.com"
    });

    instance.defaults.headers.common["Authorization"] = `Token ${process.env.REACT_APP_VOODFY_ACCESS_TOKEN}`;
    instance.get("/v1/transmissions")
    .then(async (response) => {
        if(response.data.result.transmissions != null) {
          let transmissionsId = [...response.data.result.transmissions];
          let streams = [];
          console.log(transmissionsId);
        
          for await (const id of transmissionsId) {
            let query = new Where('videoId').eq(id._id);
            let transmission = await queryThread(client, process.env.REACT_APP_TEXTILE_THREAD_ID, "videoData", query);
            console.log(transmission);
            streams.push(transmission[0]);
          }
          console.log(streams);
          dispatch({ type: ACTIONS.SET_STREAMS, payload: streams });
          setIsPageLoading(false); 
        } else {
          setIsPageLoading(false);
        }
    })
    .catch((error) => {
        console.log(error);
        toast({
            position: "bottom-right",
            title: `Try Again!`,
            status: "error",
            isClosable: true
        }) 
        setIsPageLoading(false);
    })
  }


  useEffect(() => {
    getTransmissions();
  }, []);


  return (
      <HStack alignItems="flex-start" spacing={5} className="MainSectionHome">
        <section className="sidepanel">
          <Heading as="h4" fontSize={15} className="sidepaneltitle">
            Recommended Channels
          </Heading>
          <VStack
            marginTop={3}
            alignContent="flex-start"
            spacing={3}
            className="artists"
          >
            <HStack className="artist">
              <VStack alignItems="flex-start" alignContent="flex-start">
                <Text className="artistname">KasparvoChess</Text>
                <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">
                  Chess
                </Tag>
              </VStack>
              <div className="watchcount">🔴 17.3K</div>
            </HStack>
            <HStack className="artist">
              <VStack alignItems="flex-start" alignContent="flex-start">
                <Text className="artistname">KasparvoChess</Text>
                <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">
                  Sports
                </Tag>
              </VStack>
              <div className="watchcount">🔴 17.3K</div>
            </HStack>
            <HStack className="artist">
              <VStack alignItems="flex-start" alignContent="flex-start">
                <Text className="artistname">KasparvoChess</Text>
                <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">
                  Gaming
                </Tag>
              </VStack>
              <div className="watchcount">🔴 17.3K</div>
            </HStack>
          </VStack>
          <div className="showmore">Show More</div>
          <VStack spacing={3} className="joincard">
            <Heading className="cardtitle">
              Join the <span className="titlecardhighlight">niftysubs</span>{" "}
              community!
            </Heading>
            <Heading as="h5" fontSize={13} className="cardsubtitle">
              Discover the best live streams anywhere.
            </Heading>
            {/* <Button alignSelf="flex-start" color="#E6017A" backgroundColor="rgba(230,1,122,0.08)">Connect Wallet</Button> */}
          </VStack>
        </section>
        <VStack pr={5} alignItems="flex-start" className="mainpanel">
          <div className="browsetitle">Browse</div>
          {
            isPageLoading ? 
            <Spinner />
            :
            <Grid gap={3} templateColumns="repeat(4, 1fr)" className="videocards">
              {
                state.streams.map((stream) => {
                  return(
                    <Link key={stream._id} to={`/video/${stream.videoId}`}>
                      <VStack _hover={{ bg: "gray.200" }} alignItems="flex-start">
                        <Image width="300px" src={stream.posterUrl} />
                        <HStack py={2} px={0} spacing={4} alignItems="flex-start">
                          <Avatar borderStyle="solid" borderColor="#E6017A" borderWidth="2px" padding="1px" size="md" bg="transparent" src={svgAvatarGenerator(stream.currentAccount, { dataUri: true })} />
                          <VStack alignItems="flex-start" spacing={2}>
                            <Text fontSize="13px">{stream.streamTitle}</Text>
                            <Tag fontSize="12px">{`${stream.currentAccount.substr(0,6)}...${stream.currentAccount.substr(-4)}`}</Tag>
                          </VStack>
                        </HStack>
                        
                      </VStack>
                    </Link>
                  );
                })
              }
              <VStack alignItems="flex-start">
                <Image width="300px" src="https://images.unsplash.com/photo-1549213821-4708d624e1d1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8MTYlM0E5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80" />
                <Text>Just Chating</Text>
                </VStack>
              <VStack alignItems="flex-start">
                <Image width="300px" src="https://static-cdn.jtvnw.net/previews-ttv/live_user_eryctriceps-440x248.jpg" />
                <Text>PRO CONTROLLER FORTNITE PRO - All Day Stream </Text>
              </VStack>
              <VStack alignItems="flex-start">
                <Image width="300px" src="https://static-cdn.jtvnw.net/previews-ttv/live_user_symfuhny-440x248.jpg" />
                <Text>INSANE HIGH KILL WINS + NEW KEYBOARD JUST DROPPED!!! | !Keyboard</Text>
              </VStack>
              <VStack alignItems="flex-start">
                <Image width="300px" src="https://static-cdn.jtvnw.net/previews-ttv/live_user_kyle-440x248.jpg" />
                <Text>Sports Radio 104.3 The Fan LIVE | "Denver’s Sports Station"</Text>
              </VStack>
              <VStack alignItems="flex-start">
                <Image width="300px" src="https://static-cdn.jtvnw.net/previews-ttv/live_user_impactwrestling-440x248.jpg" />
                <Text>IMPACT Wrestling on Twitch! Classic Wrestling Events 24/7/365</Text>
              </VStack>
            </Grid>
          }
        </VStack>
      </HStack>
  );
}

export default withRouter(Browse);
