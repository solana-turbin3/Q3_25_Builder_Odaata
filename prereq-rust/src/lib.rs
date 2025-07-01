#[cfg(test)]
mod tests {
    use bs58;
    use solana_client::rpc_client::RpcClient;
    use solana_program::instruction::Instruction;
    use solana_program::{
        instruction::AccountMeta, pubkey::Pubkey, system_instruction::transfer, system_program,
    };
    use solana_sdk::{
        message::Message,
        signature::{Keypair, Signer, read_keypair_file},
        transaction::Transaction,
    };
    use std::io::{self, BufRead};
    use std::str::FromStr;

    // const RPC_URL: &str =
    //     "https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a";
    const RPC_URL: &str = "https://api.devnet.solana.com";

    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!(
            "You've generated a new Solana wallet: {}",
            kp.pubkey().to_string()
        );
        println!();
        println!("To save your wallet, copy and paste the following into a JSON file:");
        println!("{:?}", kp.to_bytes());
    }

    #[test]
    fn airdrop() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Failed to read keypair file");
        let client = RpcClient::new(RPC_URL);
        let lamports: u64 = 2_000_000_000;
        match client.request_airdrop(&keypair.pubkey(), lamports) {
            Ok(sig) => {
                println!("Airdrop successful!");
                println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
            }
            Err(e) => {
                println!("Airdrop failed: {}", e);
            }
        }
    }

    #[test]
    fn transfer_balance() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Failed to read keypair file");
        let to_pubkey = Pubkey::from_str("DcwsdNovKybMa7VMALj3VD8syjahNrrMzDWthmFoCULa").unwrap();
        let client = RpcClient::new(RPC_URL);
        let balance = client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");

        let recent_blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get blockhash");

        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );

        let fee = client
            .get_fee_for_message(&message)
            .expect("Failed to get fee");

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );
        let signature = client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Entire balance transferred: https://explorer.solana.com/tx/{}?cluster=devnet",
            signature
        );
    }

    #[test]
    fn transfer_sol() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Failed to read keypair file");
        let pubkey = keypair.pubkey();
        let message_bytes = b"I verify my Solana Keypair!";
        let sig = keypair.sign_message(message_bytes);

        match sig.verify(&pubkey.to_bytes(), message_bytes) {
            true => println!("Signature verified!"),
            false => println!("Signature verification failed!"),
        }

        let to_pubkey = Pubkey::from_str("DcwsdNovKybMa7VMALj3VD8syjahNrrMzDWthmFoCULa");
        let client = RpcClient::new(RPC_URL);
        let recent_blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get blockhash");
        // First trx with .001 SOL
        // let lamports: u64 = 1_000_000;
        // Second trx with 1 SOL
        let lamports: u64 = 1_000_000_000;
        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey.unwrap(), lamports)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );
        let signature = client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}?cluster=devnet",
            signature
        );
    }

    #[test]
    fn enroll() {
        let client = RpcClient::new(RPC_URL);
        let signer = read_keypair_file("/home/mike/.config/solana/id.json")
            .expect("Failed to read keypair file");
        let mint = Keypair::new();
        let turbin3_prereq_program =
            Pubkey::from_str("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM").unwrap();
        let collection = Pubkey::from_str("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2").unwrap();
        let mpl_core_program =
            Pubkey::from_str("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d").unwrap();
        let sys_program_id = system_program::id();

        let signer_pubkey = signer.pubkey();
        let seeds = &[b"prereqs", signer_pubkey.as_ref()];
        let (prereq_pda, _bump) = Pubkey::find_program_address(seeds, &turbin3_prereq_program);
        // let collection_seed = [99u8, 111, 108, 108, 101, 99, 116, 105, 111, 110];
        // println!("Seeds: {:?}", String::from_utf8_lossy(&collection_seed));
        let collection_seeds = &[b"collection", collection.as_ref()];
        let (authority_pda, _bump) = Pubkey::find_program_address(collection_seeds, &turbin3_prereq_program);
        
        // From the submit_rs discriminator in the turbin3 program IDL
        let data = vec![77, 124, 82, 163, 21, 133, 181, 206];
        let accounts = vec![
            AccountMeta::new(signer.pubkey(), true),
            AccountMeta::new(prereq_pda, false),
            AccountMeta::new(mint.pubkey(), true),
            AccountMeta::new(collection, false),
            AccountMeta::new_readonly(authority_pda, false),
            AccountMeta::new_readonly(mpl_core_program, false),
            AccountMeta::new_readonly(sys_program_id, false),
        ];

        let recent_blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get blockhash");

        let instruction = Instruction {
            program_id: turbin3_prereq_program,
            accounts,
            data,
        };

        let transaction = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&signer.pubkey()),
            &[&signer, &mint],
            recent_blockhash,
        );
        let signature = client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Enrolled here: https://explorer.solana.com/tx/{}?cluster=devnet",
            signature
        );
    }

    // Utility fns not used in the exercise
    #[test]
    fn base58_to_wallet() {
        println!("Enter base58 encoded wallet address:");
        let stdin = io::stdin();
        let base58 = stdin.lock().lines().next().unwrap().unwrap();
        println!("Your wallet file format is:");
        let wallet = bs58::decode(&base58).into_vec().unwrap();
        println!("{:?}", wallet);
    }

    #[test]
    fn wallet_to_base58() {
        println!("Enter wallet JSON byte array:");
        let stdin = io::stdin();
        let wallet = stdin
            .lock()
            .lines()
            .next()
            .unwrap()
            .unwrap()
            .trim_start_matches('[')
            .trim_end_matches(']')
            .split(',')
            .map(|s| s.trim().parse::<u8>().unwrap())
            .collect::<Vec<u8>>();
        println!("Your base58 encoded private key is:");
        let base58 = bs58::encode(&wallet).into_string();
        println!("{:?}", base58);
    }
}
