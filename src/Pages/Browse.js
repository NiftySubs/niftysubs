import "./HomeScreen.css";
import {
  BrowserRouter as Router,
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
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { connectToInfuraIpfs, connectToOrbitDb } from "../utils/ipfs";



var ipfs;

function Browse() {

  const [ streams, setStreams ] = useState([]);
  const [ db, setdb ] = useState();
  const [ isPageLoading, setIsPageLoading ] = useState(false);
  const toast = useToast();

  const getTransmissions = useCallback(
    async () => {
      ipfs = await connectToInfuraIpfs();
      let db = await connectToOrbitDb(ipfs, process.env.REACT_APP_ORBIT_DB_ADDRESS);
      await db.load();
      setdb(db);
      const instance = axios.create({
          baseURL: "https://publish.voodfy.com"
      });
      instance.defaults.headers.common["Authorization"] = `Token ${process.env.REACT_APP_VOODFY_ACCESS_TOKEN}`;
      instance.get("/v1/transmissions")
      .then(async (response) => {
          let transmissionsId = [...response.data.result.transmissions];
          var streams = [];
          
          for (const id of transmissionsId) {
            let transmission = await db.query((docs) => docs._id == id._id);
            console.log(transmission);
            streams.push(transmission);
          }
          console.log(streams);
          setStreams([...streams]);
          console.log(streams);
          setIsPageLoading(false);
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
    },
  []);


  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    getTransmissions();
  }

  return (
    <Router>
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
              streams.map((stream) => {
                <VStack alignItems="flex-start">
                  <Image width="300px" src={stream.posterUrl} />
                  <Text>{stream.streamTitle}</Text>
                  <Text>{stream.creator}</Text>
                </VStack>
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

            
            {/* <div className="videocard">
              <img src={brimg1} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div> */}
            {/* <div className="videocard">
              <img src={brimg3} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div>
            <div className="videocard">
              <img src={brimg4} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div>
            <div className="videocard">
              <img src={brimg5} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div>
            <div className="videocard">
              <img src={brimg6} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div>
            <div className="videocard">
              <img src={brimg7} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div>
            <div className="videocard">
              <img src={brimg8} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div>
            <div className="videocard">
              <img src={brimg9} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div>
            <div className="videocard">
              <img src={brimg10} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div> */}
            </Grid>
          }
        </VStack>
      </HStack>
    </Router>
  );
}

export default Browse;
