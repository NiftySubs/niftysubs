import { create } from "ipfs-http-client";
import OrbitDB from "orbit-db";
const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_IPFS_PROJECT_ID + ':' + process.env.REACT_APP_IPFS_PROJECT_SECRET)?.toString('base64')

const ipfsOptions = {
    EXPERIMENTAL: {
      pubsub: true
    }
}
  

const ipfsAuthOptions = {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,

    }
}

export const connectToInfuraIpfs = async () => {
    const ipfs = await create("https://ipfs-api.voodfy.com", ipfsOptions);
    return ipfs;
}

export const connectToOrbitDb = async (ipfs, databaseUrl) => {
    const orbitdb = await OrbitDB.createInstance(ipfs);
    const db = await orbitdb.docs(databaseUrl);
    return db;
}

