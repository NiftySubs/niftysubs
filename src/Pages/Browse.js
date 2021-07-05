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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
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

function Browse() {
  let { path, url } = useRouteMatch();

  return (
    <Router>
      <article className="browsescreen">
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
        <section className="mainpanel">
          <div className="browsetitle">Browse</div>
          <section className="videocards">
            <div className="videocard">
              <img src={brimg1} alt="browse" className="videocardimage"/>
              <div className="videocardtitle">Just Chatting</div>
              <div className="videocardsubtitle">365K Viewers</div>
              <div className="videocardtag">IRL</div>
            </div>
            <div className="videocard">
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
            </div>
          </section>
        </section>
      </article>
    </Router>
  );
}

export default Browse;
