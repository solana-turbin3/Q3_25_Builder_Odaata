import {bs58} from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
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
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,
        };

        let data: DataV2Args = {
            name: 'Giraffe',
            symbol: 'GRF',
            uri: '',
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        };

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        const txBs58 = bs58.encode(result.signature)
        console.log(txBs58);
        console.log(getTxExplorerUrl(txBs58));
        /**
         * 2w4br7xvKwUq1P2b63ZMcHW1nAu78EKEL8LYmqgMRwPL5mSeNqEN8oEKg5H6YUxbcEgxqvy2mYQKSCc6dXGNtruu
         * https://explorer.solana.com/tx/2w4br7xvKwUq1P2b63ZMcHW1nAu78EKEL8LYmqgMRwPL5mSeNqEN8oEKg5H6YUxbcEgxqvy2mYQKSCc6dXGNtruu?cluster=devnet
         */
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
