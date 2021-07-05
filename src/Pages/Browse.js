import "./HomeScreen.css";
import {
  BrowserRouter as Router,
  Link,
  Route,
  useRouteMatch,
} from "react-router-dom";
import c2c from "../assets/c2caftermovie.mp4";
import dummyimage from "../assets/rishabh-profile.jpg";
import icons from "./socialicondata";
import {
  Button,
  Heading,
  VStack,
  HStack,
  Box,
  Flex,
  Spacer,
  Image,
  Tag,
  Text,
  StatGroup,
  Spinner,
  useToast,
  Grid
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import brimg1 from "../assets/browseimages/videocard1.png";
import brimg2 from "../assets/browseimages/videocard2.png";
import brimg3 from "../assets/browseimages/videocard3.png";
import brimg4 from "../assets/browseimages/videocard4.png";
import brimg5 from "../assets/browseimages/videocard5.png";
import brimg6 from "../assets/browseimages/videocard6.png";
import brimg7 from "../assets/browseimages/videocard7.png";
import brimg8 from "../assets/browseimages/videocard8.png";
import brimg9 from "../assets/browseimages/videocard9.png";
import brimg10 from "../assets/browseimages/videocard10.png";
import axios from "axios";
import { create } from "ipfs-http-client";
import Web3 from "web3";
import OrbitDB from "orbit-db";

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
  repo: './ipfs'
}

const ipfs = create("http://4f370b3fefd1.ngrok.io/", ipfsOptions);

const web3 = new Web3(window.ethereum);

function Browse() {
  let { path, url } = useRouteMatch();
  const [ streams, setStreams ] = useState([]);
  const [ isPageLoading, setIsPageLoading ] = useState(false);
  const [ db, setdb ] = useState();
  const toast = useToast();

  const getTransmissions = useCallback(
    async () => {
      const orbitdb = await OrbitDB.createInstance(ipfs);
      let db = await orbitdb.docs("/orbitdb/zdpuAz6e2rGQ917hroubfJuazTQDTHdvDPhm7QhKkMiu64SD7/videosdb");
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
    // getTransmissions();
  }, []);

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
