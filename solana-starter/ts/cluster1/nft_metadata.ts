import wallet from "../turbin3-wallet.json"
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults"
import {createSignerFromKeypair, signerIdentity} from "@metaplex-foundation/umi"
import {irysUploader} from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://developers.metaplex.com/token-metadata/guides/javascript/create-an-nft#uploading-the-metadata

        const image = 'https://gateway.irys.xyz/HR7jBHKBEjnmkBtg7RTXzeZRHTEy3LnUVjh5BoVFDRse'
        const metadata = {
            name: "Rug Man",
            symbol: "RUG_MAN",
            description: "Gently rugging...",
            image,
            attributes: [
                {sunny: true, flowers: true}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image,
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
        // Your metadata URI:  https://gateway.irys.xyz/85ZTCm6xjV2A8o6tZqSH71pg1X7oqiwE3Xau1Fzckk5d
    } catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
