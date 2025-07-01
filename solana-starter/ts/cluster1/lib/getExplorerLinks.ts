import {PublicKey} from "@solana/web3.js";

type ClusterName = 'devnet' | 'localnet' | 'mainnet';

const EXPLORER_HOST = 'https://explorer.solana.com';

export const getTxExplorerUrl = (signature: string, cluster: ClusterName = 'devnet') => {
    return `${EXPLORER_HOST}/tx/${signature.toString()}?cluster=${cluster}`;
};

export const getAcctExplorerUrl = (address: string | PublicKey, cluster: ClusterName = 'devnet') => {
    return `${EXPLORER_HOST}/address/${address.toString()}?cluster=${cluster}`;
};
