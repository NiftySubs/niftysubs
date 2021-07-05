import "./HomeScreen.css";
import c2c from "../assets/c2caftermovie.mp4";
import dummyimage from "../assets/rishabh-profile.jpg";
import icons from "./socialicondata";
import { Button, Heading, VStack, HStack, Box, Flex, Spacer, Image, Tag, Text, StatGroup, Avatar } from "@chakra-ui/react";
import ChatInterface from "../Components/ChatInterface.js";
import { useState, useEffect } from "react";
import publicLockABI from "../abis/publicLock";
import Web3 from "web3";
import { Framework } from "@superfluid-finance/js-sdk";
import { Web3Provider } from "@ethersproject/providers";
import { useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import OrbitDB from "orbit-db";
import { create } from "ipfs-http-client";
import FundraisingContractABI from "../abis/fundraising";
import svgAvatarGenerator from "../utils/avatar";

var sf;
var lockABI;
var LockContract;

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
  repo: './ipfs'
}



const web3 = new Web3(window.ethereum);
const FundraisingContract = new web3.eth.Contract(FundraisingContractABI, "0x608DA975Dd743Bde9ab6329258E4AD3619A533EF");


const ipfs = create(process.env.REACT_APP_IPFS_URL, ipfsOptions);

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

export default function HomeScreen({ currentAccount }) {
  const [ avatar, setAvatar ] = useState(undefined);
  const toast = useToast();
  const { id } = useParams();
  const [ isLocked, setIsLocked ] = useState(true);
  const [ lockAddress, setLockAddress ] = useState("");
  const [ blockNumber, setBlockNumber ] = useState();
  const [ sender, setSender ] = useState();
  const [ web3, setWeb3 ] = useState();
  const [ isStartingFlow, setIsStartingFlow ] = useState(false);
  const [ isPageLoading, setIsPageLoading ] = useState(true);
  const [ topic, setTopic ] = useState("");
  const [ db, setdb ] = useState();
  const [ fundraiseId, setFundraiseId ] = useState();
  const [ sf, setSf ] = useState(new Framework({
    ethers: new Web3Provider(window.ethereum),
    tokens: ['fUSDC']
  }));


  useEffect(async () => {
    var loadScript = function (src) {
      var tag = document.createElement('script');
      tag.async = false;
      tag.src = src;
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(tag);
    }

    let svg = svgAvatarGenerator("0x22b2DD2CFEF2018D15543c484aceF6D9B5435863", {dataUri: true});
    setAvatar(svg);

    

    loadScript("https://niftysubs.github.io/fundraising-widget/main.js");


    const orbitdb = await OrbitDB.createInstance(ipfs);
    let db = await orbitdb.docs("/orbitdb/zdpuAz6e2rGQ917hroubfJuazTQDTHdvDPhm7QhKkMiu64SD7/videosdb");
    await db.load();
    setdb(db);
    let transmission = await db.query((docs) => docs._id == id);
    console.log(transmission);
    setTopic(transmission[0].pubsubTopic);
    setLockAddress(transmission[0].lockAddress);
  }, []);

  useEffect(() => {
    if(currentAccount) {
      init();
    }
  },[currentAccount])


  const init = async () => {
    let web3 = new Web3(window.ethereum);
    setWeb3(web3);

    

    await sf.initialize();

    lockABI = `
      event Transfer(address indexed from, address indexed to, uint256 value);
      event CancelKey(key.tokenId, _keyOwner, msg.sender, refund);
    `;


    LockContract = new web3.eth.Contract(publicLockABI, "0x471510Cc19959e8207F68Da71c9f311e8848C424");

    setBlockNumber(await web3.eth.getBlockNumber());


    LockContract.events.Transfer({filter: {to: currentAccount}, fromBlock: blockNumber}, (e) => {
    })
    .on("connected", (subscriptionId) => {
    })
    .on("data", (e) => {
      setIsLocked(false);
    })

    LockContract.events.CancelKey({filter: {to: currentAccount}, fromBlock: blockNumber}, (e) => {
    })
    .on("connected", (subscriptionId) => {
    })
    .on("data", (e) => {
      setIsLocked(true);
    })

    let fundraises = await FundraisingContract.methods.getFundraises(currentAccount).call();
    console.log(fundraises);
    setFundraiseId(fundraises[fundraises.length - 1]);
    changeFlowSender(currentAccount);
  }

  const changeFlowSender = async (currentAccount) => {
    const bob = sf.user({address: currentAccount, token: sf.tokens.fUSDCx.address});
    let details = await bob.details(); 
    console.log(details);
    setSender(bob);
    setIsPageLoading(false);
  }

  const startFlow = async (flowRate) => {
    setIsStartingFlow(true);
    const carol = sf.user({address: "0xc309a55038868645ff39889d143436d2D6C109bE", token: sf.tokens.fUSDCx.address});
    const userData = await web3.eth.abi.encodeParameters(
      ["address"],
      ["0x471510Cc19959e8207F68Da71c9f311e8848C424"]
    );
    const tx = sender.flow({
      recipient: carol,
      flowRate,
      userData,
      onTranasction: hash => {
        console.log(hash);
      }
    })
    .then(() => {
      setIsStartingFlow(false);
    })
    .catch((error) => {
      setIsStartingFlow(false);
      toast({
        position: "bottom-right",
        title: `Request Rejected`,
        status: "error",
        isClosable: true
      })      
    });
  }

  return (
    <div className="HomeScreen">
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
        <HStack width="80vw" alignItems="flex-start" backgroundColor="#EFEFF1" height="100%" className="mainsection">
          <VStack overflowY="scroll" height="100%" className="videosection">
            <div className="window__frame__image">
              {
                isLocked ? 
                <VStack height="65vh" alignItems="center" justifyContent="center">
                  {
                    currentAccount && !isPageLoading ? 
                    <VStack spacing={5}>
                      <Text>Please start your money stream to watch.</Text>
                      <Heading>10 USDC / Month</Heading> 
                      <Button isLoading={isStartingFlow} onClick={() => startFlow("3858024691358")} className="subscribebutton" backgroundColor="black"  color="white" leftIcon={<Image filter="invert(1)" backgroundColor="transparent" borderRadius="2px" width="20px" height="20px" src="https://gblobscdn.gitbook.com/spaces%2F-MKEcOOf_qoYMObicyRu%2Favatar-1603361891616.png?alt=media" />}>Start Watching</Button>
                    </VStack>
                    :
                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Connect Wallet First</Tag>
                  }
                </VStack>
                : 
                <video
                className="video-border"
                controls
                autoplay="true"
                src={c2c}
                type="video/mp4"
                width="100%"
              />
              }              
            </div>
            <VStack width="100%">
              <HStack spacing={5} className="videoinfo">
                <Flex className="videocreatorimage" justifySelf="flex-start" justifyContent="flex-start" alignContent="flex-start">
                  <Box borderStyle="solid" padding="2px" borderRadius="50%" borderWidth="3px" borderColor="#E6017A">
                    <Avatar width="70px" height="70px" borderStyle="solid" borderColor="#E6017A" borderWidth="2px" padding="1px" size="sm" bg="transparent" src={avatar} />
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
                  {
                    isLocked ? 
                    <Spacer />
                    :
                    <Button isLoading={isStartingFlow} onClick={() => startFlow("0")} className="subscribebutton" backgroundColor="black"  color="white" leftIcon={<Image filter="invert(1)" backgroundColor="transparent" borderRadius="2px" width="20px" height="20px" src="https://gblobscdn.gitbook.com/spaces%2F-MKEcOOf_qoYMObicyRu%2Favatar-1603361891616.png?alt=media" />}>Stop Watching</Button>
                  }
                </HStack>
              </HStack>
              <Box width="100%">
                <div id="fundraising-widget-container" data-fundraise-id="6" data-payable="true"></div>
              </Box>
            </VStack>
            
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
          <ChatInterface pubsubTopic={topic} isLocked={isLocked} currentAccount={currentAccount} />
        </HStack>
      </HStack>
    </div>
  );
}
