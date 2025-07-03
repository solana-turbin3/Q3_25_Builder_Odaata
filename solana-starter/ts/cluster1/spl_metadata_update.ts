import {bs58} from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults"
import {fetchMetadataFromSeeds, updateV1} from "@metaplex-foundation/mpl-token-metadata";
import {createSignerFromKeypair, signerIdentity, publicKey} from "@metaplex-foundation/umi";

import wallet from "../turbin3-wallet.json"
import {getTxExplorerUrl} from "./lib/getExplorerLinks";

// Define our Mint address
const mint = publicKey("AYhWHaye5rdFqiAtD7AuVXqQTQD5gH8qCxAYLetf42VB")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        const initialMetadata = await fetchMetadataFromSeeds(umi, {mint});
        const result = await updateV1(umi, {
            mint,
            authority: signer,
            // Uploaded using `Irys` via `./nft_image.ts`
            data: {...initialMetadata, uri: 'https://gateway.irys.xyz/DgjeZa9EooEXHBGvDgzVP5vtoAydbDjB8s9hcsLdGmPH'},
        }).sendAndConfirm(umi);
        const txBs58 = bs58.encode(result.signature)
        console.log(txBs58);
        console.log(getTxExplorerUrl(txBs58));
        /**
         * 4WvdczGheeBGbH6VHMFW9hb3aqwhqPxG9j4NfTDRm4QT4ej9UaoDpGiFrT7Lz2sKyDte9bW3Xjj6DePrhmzcvB7m
         * https://explorer.solana.com/tx/4WvdczGheeBGbH6VHMFW9hb3aqwhqPxG9j4NfTDRm4QT4ej9UaoDpGiFrT7Lz2sKyDte9bW3Xjj6DePrhmzcvB7m?cluster=devnet
         */
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
