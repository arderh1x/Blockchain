const crypto = require("crypto");

const keyPair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const privateKey = keyPair.privateKey;

const publicKey = keyPair.publicKey;
const document = {
    id: 1,
    text: "Some text in this document."
}
const signBase64 = signDocument(document, 'base64');


function signDocument(document) {
    const documentString = JSON.stringify(document);
    const sign = crypto.createSign('sha256').update(documentString).end();
    return sign.sign(privateKey, 'base64');
}

function verifySign(document, sign, publicKey) {
    const documentString = JSON.stringify(document);
    const verify = crypto.createVerify('sha256').update(documentString).end();
    const verified = verify.verify(publicKey, sign, 'base64');
    console.log("Is sign validated?", verified)
}

console.log("(A) True document and sign.");
verifySign(document, signBase64, publicKey);

console.log("\n(B) Corrupted document.");
const corruptedDocument = structuredClone(document);
corruptedDocument.text += "He-he";
verifySign(corruptedDocument, signBase64, publicKey);

console.log("\n(C) Corrupted sign.");
const corruptedSign = signBase64.substring(0, (signBase64.length - 2)) + "00";
if (corruptedSign === signBase64) corruptedSign = signBase64.substring(0, (signBase64.length - 2)) + "11";
verifySign(document, corruptedSign, publicKey);