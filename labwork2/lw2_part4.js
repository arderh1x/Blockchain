const forge = require("node-forge");

const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
const privateKey = keyPair.privateKey;
const publicKey = keyPair.publicKey;

// in progress, not done