import bs58 from 'bs58';
import promptSync from 'prompt-sync';

function encode(secret: number[]): string {
    const bytes = new Uint8Array(secret);
    return bs58.encode(bytes);
}

function decode(encoded: string): number[] {
    const decoded = bs58.decode(encoded);
    return Array.from(decoded);
}

// Create a prompt function
const prompt = promptSync();

// Get user input
const secretInput = prompt('What is your json wallet secret? ', '');
if (secretInput) {
    console.log(`bs58: ${encode(JSON.parse(secretInput))}`);
    process.exit(0);
}

// Get input with default value
const encodedInput = prompt('What is your bs58 encoded secret? ', '');
if (encodedInput) {
    console.log(`json: ${JSON.stringify(decode(encodedInput))}`);
}
