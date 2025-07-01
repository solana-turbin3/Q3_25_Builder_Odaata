import {Commitment, Connection, Keypair, PublicKey} from "@solana/web3.js"
import {getOrCreateAssociatedTokenAccount, transfer} from "@solana/spl-token";

import wallet from "../turbin3-wallet.json"
import {getTxExplorerUrl} from "./lib/getExplorerLinks";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("AYhWHaye5rdFqiAtD7AuVXqQTQD5gH8qCxAYLetf42VB");
const token_decimals = 1_000_000;

// Recipient address
// Shuva the builder :)
// const to = new PublicKey("8CMN1nBf2gnQSEaoAMngJCiHqZ8AvPPZpL6Eb7fvwqF3");
// mehan05 the builder :)
const to = new PublicKey("Ed59fPEf2dBjfwKHEJJWZBoWvzi8ieGJ9Rm1xcf1beSC");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(connection, keypair, fromAta.address, toAta.address, keypair.publicKey, 10 * token_decimals);
        console.log(`Success! tx: ${tx}`);
        console.log(getTxExplorerUrl(tx));
        //Success! tx: 5vRG1yyWbXndqCahCNAcK5JNHEb6vXsJdGdC6StCYn7g11RM3b17fQTDLyswWQHag7fhD74LASDLeu4NL1d79xCt
        // https://explorer.solana.com/tx/5vRG1yyWbXndqCahCNAcK5JNHEb6vXsJdGdC6StCYn7g11RM3b17fQTDLyswWQHag7fhD74LASDLeu4NL1d79xCt?cluster=devnet
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();