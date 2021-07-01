import Header from "../Components/Header.js";
import "./HomeScreen.css";
import c2c from "../assets/c2caftermovie.mp4";
import dummyimage from "../assets/rishabh-profile.jpg";
import icons from "./socialicondata";
import { Button, Heading, VStack, HStack, Box, Flex, Spacer, Image, Tag, Text } from "@chakra-ui/react";
import ChatInterface from "../Components/ChatInterface.js";
import { useState, useEffect } from "react";

const IconComponent = ({ src, link, name }) => {
  return (
    <a
      className={`${name} mainIcon social-box w-inline-block`}
      href={link}
      rel="noreferrer"
      target="_blank"
    >
      <img className="z-10 fimg" src={src} alt="icon" />
    </a>
  );
};
export default function HomeScreen() {

  const [currentAccount, setCurrentAccount] = useState(undefined);

  useEffect(() => {
    console.log("App Ready!");
  },[])

  return (
    <div className="HomeScreen">
      <Header currentAccountSetter={setCurrentAccount} currentAccount={currentAccount} />
      <HStack spacing={0} className="MainSectionHome">
        <section className="sidepanel">
          <Heading as="h4" fontSize={15} className="sidepaneltitle">Recommended Channels</Heading>
          <VStack marginTop={3} alignContent="flex-start" spacing={3} className="artists">
            <HStack className="artist">
              <VStack alignItems="flex-start" alignContent="flex-start">
                <Text className="artistname">KasparvoChess</Text>
                <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Chess</Tag>
              </VStack>
              <div className="watchcount">🔴 17.3K</div>
            </HStack>
            <HStack className="artist">
              <VStack alignItems="flex-start" alignContent="flex-start">
                <Text className="artistname">KasparvoChess</Text>
                <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Sports</Tag>
              </VStack>
              <div className="watchcount">🔴 17.3K</div>
            </HStack>
            <HStack className="artist">
              <VStack alignItems="flex-start" alignContent="flex-start">
                <Text className="artistname">KasparvoChess</Text>
                <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Gaming</Tag>
              </VStack>
              <div className="watchcount">🔴 17.3K</div>
            </HStack>
          </VStack>
          <div className="showmore">Show More</div>
          <VStack spacing={3} className="joincard">
            <div className="cardtitle">
              Join the <span className="titlecardhighlight">niftysubs</span>{" "}
              community!
            </div>
            <Heading as="h5" fontSize={13} className="cardsubtitle">
              Discover the best live streams anywhere.
            </Heading>
            {/* <Button alignSelf="flex-start" color="#E6017A" backgroundColor="rgba(230,1,122,0.08)">Connect Wallet</Button> */}
          </VStack>
        </section>
        <HStack width="80vw" alignItems="flex-start" backgroundColor="#EFEFF1" height="100%" className="mainsection">
          <VStack overflowY="scroll" height="100%" className="videosection">
            <div className="window__frame__image">
              <video
                className="video-border"
                controls
                autostart="true"
                autoPlay
                loop={true}
                muted
                src={c2c}
                type="video/mp4"
                width="100%"
              />
            </div>
            <HStack spacing={5} className="videoinfo">
              <Flex className="videocreatorimage" justifySelf="flex-start" justifyContent="flex-start" alignContent="flex-start">
                <Box borderStyle="solid" padding="2px" borderRadius="50%" borderWidth="3px" borderColor="#E6017A">
                  <Image
                    className="creatorimage"
                    src={dummyimage}
                    alt="creator profile"
                  />
                </Box>
              </Flex>
              <VStack justifyContent="flex-start" alignItems="flex-start" className="videodetails">
                <Heading as="h6" fontSize="20px" className="creatorname">KasparvoChess</Heading>
                <Text className="videotitle">
                  Grand Chess Tour 2021 - Paris Rapid Day 3 | kasparovchess.com
                </Text>
                <HStack className="videogenre">
                  <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Chess</Tag>
                  <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">English</Tag>
                  <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Strategy</Tag>
                </HStack>
              </VStack>
              <Spacer/>
              <HStack alignItems="center" justifyContent="center" justifyItems="center" justifySelf="center" alignSelf="center" alignContent="center">
                <Button borderStyle="solid" borderWidth="1px" borderColor="black" className="subscribebutton" backgroundColor="white"  color="black" leftIcon={<Image backgroundColor="transparent" borderRadius="2px" width="20px" height="20px" src="https://gblobscdn.gitbook.com/spaces%2F-MKEcOOf_qoYMObicyRu%2Favatar-1603361891616.png?alt=media" />}>Start Watching</Button>
              </HStack>
            </HStack>
            {/* <div className="creatordetails">
              <div>
                <img
                  className="creatorprofile"
                  src={dummyimage}
                  alt="creator profile"
                />
              </div>
              <div className="creatorprofiledesc">
                <div className="creatortitle">About KasparvoChess</div>
                <div className="creatorbio">
                  Learn. Watch. Play on https://kasparovchess.com
                </div>
              </div>
              <div className="socialiconcontainer">
                <div className="icons">
                  {icons.map((icon, key) => (
                    <IconComponent
                      key={key}
                      src={icon.src}
                      name={icon.name}
                      link={icon.link}
                    />
                  ))}
                </div>
              </div>
            </div> */}
          </VStack>
          <ChatInterface />
        </HStack>
      </HStack>
    </div>
  );
}
