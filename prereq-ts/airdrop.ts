import { Connection, Keypair, LAMPORTS_PER_SOL} from "@solana/web3.js";
import wallet from './dev-wallet.json';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet))
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

(async () => {
    try {
        const txHash = await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
        console.log(`See TX Here: https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
    } catch (e) {
        console.error('Something went wrong: ', e);
    }
})();
