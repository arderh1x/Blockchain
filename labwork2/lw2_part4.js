const crypto = require("crypto"); // prefer to use this

/* generated key pair */
const keyPair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const privateKey = keyPair.privateKey;
const publicKey = keyPair.publicKey;

const string = "Hello, sign me!";
const corruptedString = string + " He-he";

const signHex = signString(string, 'hex');
const signBase64 = signString(string, 'base64');

function signString(string, format) { // hex or base64
    const sign = crypto.createSign('sha256').update(string).end();
    return sign.sign(privateKey, format);
}

function verifySign(string) {
    const verify = crypto.createVerify('sha256').update(string).end();
    const verified = verify.verify(publicKey, signBase64, 'base64');
    console.log("Is sign validated?", verified)
}

console.log(publicKey.export({ type: 'pkcs1', format: 'pem' }).slice(0, 100), "... [short display]\n");
// PFX / PKCS12: Public Key Cryptography Standards #12(PKCS#12) format, which is also called PFX format.
// This format can be used to create JKS or PEM files.

console.log("Sign (hex): ", signHex);
console.log("\nSign (base64): ", signBase64);

console.log("\n");
verifySign(string);
verifySign(corruptedString);

// private key - proof of authorship and defense against stealing
// [with your private key anyone can create signatures from your name]