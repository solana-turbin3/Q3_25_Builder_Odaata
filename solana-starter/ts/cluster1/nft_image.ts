import {readFileSync} from "fs";
import path from 'path';

import {createGenericFile, createSignerFromKeypair, signerIdentity} from "@metaplex-foundation/umi"
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults"
import {irysUploader} from "@metaplex-foundation/umi-uploader-irys"

import wallet from "../turbin3-wallet.json"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

// const giraffeIconPath = path.resolve(__dirname, '../../../../Giraffe_SPL_Token_icon.png');
// https://gateway.irys.xyz/DgjeZa9EooEXHBGvDgzVP5vtoAydbDjB8s9hcsLdGmPH

const nftRugFieldPath = path.resolve(__dirname, './lib/NFT_Image_Rug_Field.png');
const nftRugFieldName = 'RugMan.png';
// Your image URI:  https://gateway.irys.xyz/HR7jBHKBEjnmkBtg7RTXzeZRHTEy3LnUVjh5BoVFDRse

export async function uploadImage(imagePath: string, irysFileName: string) {
    try {
        //1. Load image
        console.log(`Uploading image from: ${imagePath}`);
        const image = readFileSync(imagePath);

        //2. Convert image to generic file.
        const umiImage = createGenericFile(image, irysFileName, {
            tags: [{name: 'Content-Type', value: 'image/png'}],
        });

        //3. Upload image
        const [myUri] = await umi.uploader.upload([umiImage])

        console.log("Your image URI: ", myUri);
    } catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
}

uploadImage(nftRugFieldPath, nftRugFieldName).then(() => process.exit(0));
