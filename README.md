<h1 align="center">NiftySubs - Your Decentralized Live Streaming Platform</h1>

<p align="center">
  <a href="https://github.com/niftysubs/niftysubs">
    <img src="./src/assets/niftysubs.svg" alt="Logo" width="480" height="240">
  </a>
  <h6 align="center">Built at ETHGlobal HackMoney 2021</h6>
  </p>
  
  <p align="center"><a href="https://www.youtube.com/watch?v=skJes2cwNTI">Watch Demo Video on YouTube</a></p>

<h4 align="center">NiftySubs uses a pay-as-you-use model, you can now watch your favorite creators at minimal cost only on NiftySubs</h4>

<p align="center">
    <a href="https://github.com/NiftySubs/niftysubs/issues">Report Bug</a>
    ·
    <a href="https://github.com/NiftySubs/niftysubs/issues">Request Feature</a>
  </p>

> Note: Development on this project has been stopped.

##  Features

<p> ✔️ Pay-as-you-watch, cheapest video streaming experience. </p>
<p> ✔️ Superchat feature, show love tour favorite creators and get your message highlighted! </p>
<p> ✔️ Creators can do NFT giveaways to viewers!  </p>
<p> ✔️ Broswe through old streams by your favorite creators. </p>
<p> ✔️ Donate money to a creator or raise money for a cause using our custom widget-embed hassle free </p>
<p> ✔️ Customized dashboard for creators as a one access place for their statistics. </p>
 
 **A lot more to come!**

## Architecture

![Flow of Control](./src/assets/architecture1.png)
![Flow of Build of Network](./src/assets/architecture2.png)
![Dataset Info](./src/assets/architecture3.png)

### Built With
We have used the following technologies for this project:
* [Solidity](https://docs.soliditylang.org/en/v0.8.3/) (Language for writing smart contracts of the Dapp)
* [Chainlink](https://chain.link/) (For selecting the winner of NFT from the list of viewers!)
* [Filecoin](https://filecoin.io/) (Voodify service for the persistence of video and transmissions)
* [Infura](https://infura.io/) (Connect to the blockchain to provide event list widget to the creators)
* [IPFS](https://ipfs.io/) (IPFS PubSub for chat feature and orbitdb for storing data)
* [Superfluid](https://www.superfluid.finance/) (Superfluid CFA to enable the pay-as-you-use feature)
* [Ʉnlock Protocol](https://unlock-protocol.com/)(Unlock lets is easily lock and manage access to our monetized content on NiftySubs.)
* [Voodfy](https://www.voodfy.com/)(Voodfy uses Filecoin combined with IPFS to store your videos reliably and securely. We use it for live video streaming)
* [Metamask](https://metamask.io) (Wallet Provider)
* [The Graph](https://thegraph.com/) (Query historical events to provide info on our dapp to both the creators and viewers)
* [OrbitDB](https://orbitdb.org/) (For storing metadata about the video and creator profile information and pubsub live chat)
* [Tailwind](https://tailwind.com) (CSS framework)
* [ReactJS](https://reactjs.org/) (web UI)

## Getting Started

* Clone the repo:

`git clone https://github.com/NiftySubs/niftysubs.git && cd niftysubs`

### Run the Project


Once you are in the project directory nstall the required dependencies using a package manager `yarn` or `npm`.

`yarn add` or `npm install`

`yarn start` or `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

<b>License</b>: MIT
