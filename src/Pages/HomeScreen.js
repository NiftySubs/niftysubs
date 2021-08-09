import './HomeScreen.css'
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
  Avatar,
  Skeleton,
  SkeletonCircle,
  Stack,
} from '@chakra-ui/react'
import ChatInterface from '../Components/ChatInterface.js'
import { useState, useEffect, useReducer } from 'react'
import publicLockABI from '../abis/publicLock'
import Web3 from 'web3'
import { Framework } from '@superfluid-finance/js-sdk'
import { Web3Provider } from '@ethersproject/providers'
import { useToast } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { getClient, queryThread } from '../utils/textile'
import { Where } from '@textile/hub-threads-client'
import svgAvatarGenerator from '../utils/avatar'

var sf
var LockContract
var web3

const ACTIONS = {
  SET_LOCK_ADDRESS: 'set-lock-address',
  SET_BLOCK_NUMBER: 'set-block-number',
  SET_SENDER: 'set-sender',
  SET_VIDEO: 'set-video',
  SET_IS_LOCKED: 'set-is-locked',
}

function stateReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOCK_ADDRESS:
      return { ...state, lockAddress: action.payload }
    case ACTIONS.SET_BLOCK_NUMBER:
      return { ...state, blockNumber: action.payload }
    case ACTIONS.SET_SENDER:
      return { ...state, sender: action.payload }
    case ACTIONS.SET_VIDEO:
      return { ...state, video: action.payload }
    case ACTIONS.SET_IS_LOCKED:
      return { ...state, isLocked: action.payload }
    default:
      return state
  }
}

export default function HomeScreen({ currentAccount }) {
  const toast = useToast()
  const [isStartingFlow, setIsStartingFlow] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const { id } = useParams()
  const [isSuperFluidLoading, setIsSuperFluidIsLoading] = useState(false)

  const [state, dispatch] = useReducer(stateReducer, {
    lockAddress: '',
    sender: '',
    video: {},
    isLocked: true,
  })

  useEffect(() => {
    // loading the fundraising widget.
    var loadScript = function (src) {
      var tag = document.createElement('script')
      tag.async = false
      tag.src = src
      var body = document.getElementsByTagName('body')[0]
      body.appendChild(tag)
    }
    loadScript('https://niftysubs.github.io/fundraising-widget/main.js')
  }, [])

  useEffect(() => {
    if (currentAccount) getVideoData()
  }, [currentAccount])

  const getVideoData = async () => {
    let client = await getClient()
    let query = new Where('videoId').eq(id)
    let video = await queryThread(
      client,
      process.env.REACT_APP_TEXTILE_THREAD_ID,
      'videoData',
      query
    )
    let lockAddress = video[0].lockAddress
    dispatch({ type: ACTIONS.SET_LOCK_ADDRESS, payload: lockAddress })
    dispatch({ type: ACTIONS.SET_VIDEO, payload: video[0] })
    init(lockAddress)
  }

  const init = async (lockAddress) => {
    setIsSuperFluidIsLoading(true)
    web3 = new Web3(window.ethereum)

    sf = new Framework({
      ethers: new Web3Provider(window.ethereum),
      tokens: ['fUSDC'],
    })

    await sf.initialize()
    console.log(web3)

    LockContract = new web3.eth.Contract(publicLockABI, lockAddress)
    let shouldContentBeLocked = await LockContract.methods.getHasValidKey(
      currentAccount
    )
    dispatch({ type: ACTIONS.SET_IS_LOCKED, payload: shouldContentBeLocked })

    await subscribeToLockEvents()

    changeFlowSender(currentAccount)
  }

  const subscribeToLockEvents = async () => {
    console.log(currentAccount)
    LockContract.events
      .Transfer({ filter: { to: currentAccount }, fromBlock: 0 }, (e) => {})
      .on('connected', (subscriptionId) => {
        console.log(subscriptionId)
      })
      .on('data', (e) => {
        console.log('Key Granted')
        dispatch({ type: ACTIONS.SET_IS_LOCKED, payload: false })
      })

    LockContract.events
      .CancelKey({ filter: { owner: currentAccount }, fromBlock: 0 }, (e) => {})
      .on('connected', (subscriptionId) => {
        console.log(subscriptionId)
      })
      .on('data', (e) => {
        console.log('Key Cancelled!')
        dispatch({ type: ACTIONS.SET_IS_LOCKED, payload: true })
      })
  }

  const changeFlowSender = async (currentAccount) => {
    const bob = sf.user({
      address: currentAccount,
      token: sf.tokens.fUSDCx.address,
    })
    dispatch({ type: ACTIONS.SET_SENDER, payload: bob })
    setIsSuperFluidIsLoading(false)
    setIsPageLoading(false)
  }

  const startFlow = async (flowRate) => {
    setIsStartingFlow(true)
    console.log(state.video.lockAddress)
    const carol = sf.user({
      address: process.env.REACT_APP_SUPERAPP_ADDRESS,
      token: sf.tokens.fUSDCx.address,
    })
    console.log(state.video.lockAddress)
    const userData = await web3.eth.abi.encodeParameters(
      ['address'],
      [state.video.lockAddress]
    )
    const tx = state.sender
      .flow({
        recipient: carol,
        flowRate,
        userData,
      })
      .then(() => {
        setIsStartingFlow(false)
      })
      .catch((error) => {
        setIsStartingFlow(false)
        toast({
          position: 'bottom-right',
          title: `Request Rejected`,
          status: 'error',
          isClosable: true,
        })
      })
  }

  return (
    <div className="HomeScreen">
      <HStack spacing={0} className="MainSectionHome">
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
          <VStack bg="gray.50" spacing={3} className="joincard">
            <Heading color="black" className="cardtitle">
              Join the <span className="titlecardhighlight">niftysubs</span>{" "}
              community!
            </Heading>
            <Heading
              as="h5"
              color="black"
              fontSize={13}
              className="cardsubtitle"
            >
              Discover the best live streams anywhere.
            </Heading>
            {/* <Button alignSelf="flex-start" color="#E6017A" backgroundColor="rgba(230,1,122,0.08)">Connect Wallet</Button> */}
          </VStack>
        </section>
        <HStack
          width="80vw"
          alignItems="flex-start"
          backgroundColor="#EFEFF1"
          height="100%"
          className="mainsection"
        >
          <VStack overflowY="scroll" height="100%" className="videosection">
            <div className="window__frame__image">
              <Skeleton isLoaded={!isPageLoading}>
                {state.isLocked ? (
                  <VStack
                    height="65vh"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {currentAccount && !isSuperFluidLoading ? (
                      <VStack spacing={5}>
                        <Text>Please start your money stream to watch.</Text>
                        <Heading>10 USDC / Month</Heading>
                        <Button
                          isLoading={isStartingFlow}
                          onClick={() => startFlow("3858024691358")}
                          className="subscribebutton"
                          backgroundColor="black"
                          color="white"
                          leftIcon={
                            <Image
                              filter="invert(1)"
                              backgroundColor="transparent"
                              borderRadius="2px"
                              width="20px"
                              height="20px"
                              src="https://gblobscdn.gitbook.com/spaces%2F-MKEcOOf_qoYMObicyRu%2Favatar-1603361891616.png?alt=media"
                            />
                          }
                        >
                          Start Watching
                        </Button>
                      </VStack>
                    ) : (
                      <Tag
                        backgroundColor="rgba(230,1,122,0.08)"
                        color="#E6017A"
                      >
                        Connect Wallet First
                      </Tag>
                    )}
                  </VStack>
                ) : (
                  <iframe
                    className="video-border"
                    // autoplay="true"
                    // src="../assets/c2caftermovie.mp4"
                    style={{ height: "70vh" }}
                    src={`https://embed.voodfy.com/${state.video.videoId}`}
                    width="100%"
                    controls
                  />
                )}
              </Skeleton>
            </div>
            <VStack width="100%">
              <HStack alignItems="flex-start" spacing={5} className="videoinfo">
                <Flex
                  className="videocreatorimage"
                  justifySelf="flex-start"
                  justifyContent="flex-start"
                  alignContent="flex-start"
                >
                  <Box
                    borderStyle="solid"
                    padding="2px"
                    borderRadius="50%"
                    borderWidth="3px"
                    borderColor="#E6017A"
                  >
                    {isPageLoading ? (
                      <SkeletonCircle size="60px" />
                    ) : (
                      <Avatar
                        size="lg"
                        src={svgAvatarGenerator(state.video.currentAccount, {
                          dataUri: true,
                        })}
                      />
                    )}
                  </Box>
                </Flex>
                <VStack
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  className="videodetails"
                >
                  {isPageLoading ? (
                    <Stack>
                      <Skeleton>
                        Stream Title and some long placeholder text
                      </Skeleton>
                      <Skeleton>creator address</Skeleton>
                    </Stack>
                  ) : (
                    <>
                      <Heading as="h6" fontSize="20px" className="creatorname">
                        {state.video.streamTitle}
                      </Heading>
                      <Tag
                        backgroundColor="rgba(230,1,122,0.08)"
                        color="#E6017A"
                        className="videotitle"
                      >
                        {`${state.video.currentAccount.substr(
                          0,
                          6
                        )}...${state.video.currentAccount.substr(-4)}`}
                      </Tag>
                    </>
                  )}
                  {/* Tags */}
                  {/* <HStack className="videogenre">
                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Chess</Tag>
                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">English</Tag>
                    <Tag backgroundColor="rgba(230,1,122,0.08)" color="#E6017A">Strategy</Tag>
                  </HStack> */}
                </VStack>
                <Spacer />
                <HStack
                  alignItems="center"
                  justifyContent="center"
                  justifyItems="center"
                  justifySelf="center"
                  alignSelf="center"
                  alignContent="center"
                >
                  {state.isLocked ? (
                    <Spacer />
                  ) : (
                    <Button
                      isLoading={isStartingFlow}
                      onClick={() => startFlow("0")}
                      className="subscribebutton"
                      backgroundColor="black"
                      color="white"
                      leftIcon={
                        <Image
                          filter="invert(1)"
                          backgroundColor="transparent"
                          borderRadius="2px"
                          width="20px"
                          height="20px"
                          src="https://gblobscdn.gitbook.com/spaces%2F-MKEcOOf_qoYMObicyRu%2Favatar-1603361891616.png?alt=media"
                        />
                      }
                    >
                      Stop Watching
                    </Button>
                  )}
                </HStack>
              </HStack>
              <Box width="100%">
                <div
                  id="fundraising-widget-container"
                  data-fundraise-id="6"
                  data-payable="true"
                ></div>
              </Box>
            </VStack>
          </VStack>
          {isPageLoading ? (
            <Tag>Loading</Tag>
          ) : (
            <ChatInterface
              pubsubTopic={state.video.videoId}
              isLocked={state.isLocked}
              creatorAccount={state.video.currentAccount}
              currentAccount={currentAccount}
            />
          )}
        </HStack>
      </HStack>
    </div>
  );
}
