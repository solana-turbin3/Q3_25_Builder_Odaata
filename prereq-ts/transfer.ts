import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";

import devWallet from './dev-wallet.json';

const keypair = Keypair.fromSecretKey(new Uint8Array(devWallet))
const toMe = new PublicKey("DcwsdNovKybMa7VMALj3VD8syjahNrrMzDWthmFoCULa");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

async function sendPartialSol() {
    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: toMe,
                lamports: LAMPORTS_PER_SOL / 10
            })
        );
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = keypair.publicKey;
        const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log(`See TX Here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
        console.error('Something went wrong: ', e);
    }
}

async function sendAllSol() {
    try {
        const balance = await connection.getBalance(keypair.publicKey);
        console.log(`Balance: ${balance}`);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: toMe,
                lamports: balance
            })
        );
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = keypair.publicKey;
        const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value;
        if (!fee) {
            throw new Error('Could not get fee');
        }
        console.log(`Fee: ${fee}`);
        console.log(`Lamports: ${balance - fee}`);
        transaction.instructions.pop();
        transaction.add(SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: toMe,
            lamports: balance - fee,
        }))
        const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log(`See TX Here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
        console.error('Something went wrong: ', e);
    }
}

sendAllSol().then(() => process.exit(0));
