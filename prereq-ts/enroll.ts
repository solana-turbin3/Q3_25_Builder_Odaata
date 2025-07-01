import {Program, AnchorProvider, Wallet} from '@coral-xyz/anchor';
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";

import myWallet from '/home/mike/.config/solana/id.json';

const myKeypair = Keypair.fromSecretKey(new Uint8Array(myWallet));

const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const PREREQ_PROGRAM_ID = new PublicKey("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");

const mintCollection = new PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

const connection = new Connection('https://api.devnet.solana.com');
const provider = new AnchorProvider(connection, new Wallet(myKeypair), {commitment: 'confirmed'});

async function enroll() {
    const program = await Program.at(PREREQ_PROGRAM_ID, provider);
    try {

        const accountSeeds = [
            Buffer.from("prereqs"),
            myKeypair.publicKey.toBuffer(),
        ];
        const [accountKey, _accountBump] = PublicKey.findProgramAddressSync(accountSeeds, program.programId);
        const txHash = await program.methods
            .initialize('odaata')
            .accountsPartial({
                user: myKeypair.publicKey,
                account: accountKey,
                system_program: SystemProgram.programId,
            })
            .signers([myKeypair])
            .rpc();
        console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
}

async function submitTs() {
    try {
        const program = await Program.at(PREREQ_PROGRAM_ID, provider);
        const accountSeeds = [
            Buffer.from("prereqs"),
            myKeypair.publicKey.toBuffer(),
        ];
        const [accountKey, _accountBump] = PublicKey.findProgramAddressSync(accountSeeds, program.programId);
        const mintTs = Keypair.generate();
        const txHash = await program.methods
            .submitTs()
            .accountsPartial({
                user: myKeypair.publicKey,
                account: accountKey,
                mint: mintTs.publicKey,
                collection: mintCollection,
                mpl_core_program: MPL_CORE_PROGRAM_ID,
                system_program: SystemProgram.programId,
            })
            .signers([myKeypair, mintTs])
            .rpc();
        console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
}

submitTs().then(() => {
    process.exit(0)
});
