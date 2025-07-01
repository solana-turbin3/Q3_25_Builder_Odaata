import {Keypair, PublicKey, Connection, Commitment} from "@solana/web3.js";
import {getOrCreateAssociatedTokenAccount, mintTo} from '@solana/spl-token';

import wallet from "../turbin3-wallet.json"
import {getTxExplorerUrl} from "./lib/getExplorerLinks";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000;

// Mint address
const mint = new PublicKey("AYhWHaye5rdFqiAtD7AuVXqQTQD5gH8qCxAYLetf42VB");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, 100 * token_decimals)
        console.log(`Your mint txid: ${mintTx}`);
        console.log(`link: ${getTxExplorerUrl(mintTx)}`);
        /**
         * Your ata is: 9mR2upEXQPf9A2uiLNifHAwtQp52181r5AkREGayVvxZ
         * Your mint txid: 5nU3KL9oU1LiM356yQeH9pj2kNTMc7DgPR6oX4rK9kPPG1FxG6ttdvDKYeqiasXEAG1UdWGyfGY4upMEKetqj1Fe
         * link: https://explorer.solana.com/tx/5nU3KL9oU1LiM356yQeH9pj2kNTMc7DgPR6oX4rK9kPPG1FxG6ttdvDKYeqiasXEAG1UdWGyfGY4upMEKetqj1Fe?cluster=devnet
         */
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
