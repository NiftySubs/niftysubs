import Header from "../Components/Header.js";
import "./HomeScreen.css";
import c2c from "../assets/c2caftermovie.mp4";
import dummyimage from "../assets/rishabh-profile.jpg";
import icons from "./socialicondata";
import { Button, Heading, VStack, HStack, Box, Flex, Spacer } from "@chakra-ui/react";

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
  return (
    <div className="HomeScreen">
      <Header />
      <HStack spacing={0} className="MainSectionHome">
        <section className="sidepanel">
          <div className="sidepaneltitle">Recommended Channels</div>
          <VStack alignContent="flex-start" spacing={3} className="artists">
            <div className="artist">
              <div>
                <div className="artistname">KasparvoChess</div>
                <div className="category">Chess</div>
              </div>
              <div className="watchcount">🔴 17.3K</div>
            </div>
            <div className="artist">
              <div>
                <div className="artistname">KasparvoChess</div>
                <div className="category">Just Chatting</div>
              </div>
              <div className="watchcount">🔴 17.3K</div>
            </div>
            <div className="artist">
              <div>
                <div className="artistname">KasparvoChess</div>
                <div className="category">Minecraft</div>
              </div>
              <div className="watchcount">🔴 17.3K</div>
            </div>
            <div className="artist">
              <div>
                <div className="artistname">KasparvoChess</div>
                <div className="category">Fortnite</div>
              </div>
              <div className="watchcount">🔴 17.3K</div>
            </div>
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
            <Button alignSelf="flex-start" color="#E6017A" backgroundColor="rgba(230,1,122,0.08)">Connect Wallet</Button>
          </VStack>
        </section>
        <HStack backgroundColor="#EFEFF1" height="100%" className="mainsection">
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
                <img
                  className="creatorimage"
                  src={dummyimage}
                  alt="creator profile"
                />
              </Flex>
              <VStack justifyContent="flex-start" alignItems="flex-start" className="videodetails">
                <div className="creatorname">KasparvoChess</div>
                <div className="videotitle">
                  Grand Chess Tour 2021 - Paris Rapid Day 3 | kasparovchess.com
                </div>
                <div className="videogenre">
                  <div className="genrecategory">Chess</div>
                  <div className="genrelanguage">English</div>
                  <div className="genretype">Strategy</div>
                </div>
              </VStack>
              <Spacer/>
              <HStack alignItems="center" justifyContent="center" justifyItems="center" justifySelf="center" alignSelf="center" alignContent="center">
                <Button className="subscribebutton" leftIcon={<img width="10px" height="10px" src="https://gblobscdn.gitbook.com/spaces%2F-MKEcOOf_qoYMObicyRu%2Favatar-1603361891616.png?alt=media" />}>Subscribe</Button>
              </HStack>
            </HStack>
            <div className="creatordetails">
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
            </div>
          </VStack>
          <section className="chatsection"></section>
        </HStack>
      </HStack>
    </div>
  );
}
