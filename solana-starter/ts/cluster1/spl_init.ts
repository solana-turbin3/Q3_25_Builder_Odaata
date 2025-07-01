import {Keypair, Connection, Commitment} from "@solana/web3.js";
import {createMint} from '@solana/spl-token';

import wallet from "../turbin3-wallet.json"
import {getAcctExplorerUrl} from "./lib/getExplorerLinks";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        console.log(`Successfully created a mint ${mint}`);
        console.log(`link: ${getAcctExplorerUrl(mint)}`)
        // Successfully created a mint AYhWHaye5rdFqiAtD7AuVXqQTQD5gH8qCxAYLetf42VB
        // https://explorer.solana.com/address/AYhWHaye5rdFqiAtD7AuVXqQTQD5gH8qCxAYLetf42VB?cluster=devnet
        // https://explorer.solana.com/tx/4F8XTDrorD1H8sZMe6PmNXeUqfoQsySrxcbb4cVJ9jJBdgT1nazjDN23c2tqpqYQWfWT3EDt3HFgrxSDhW2FCA2K?cluster=devnet
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
