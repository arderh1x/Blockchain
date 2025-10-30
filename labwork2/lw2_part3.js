const crypto = require("crypto");

function calculateHash(base, nonce) {
    const hashString = base + nonce;
    return crypto.createHash('sha256').update(hashString).digest('hex');

}

function findCollision(n) {
    const base = "student_test";
    let nonce = 0;
    const hashBase = calculateHash(base, nonce);
    console.log(`First string: ${base + nonce}, hash: ${hashBase}`);

    let hashNew = "";
    while (hashBase.substring(0, n) !== hashNew.substring(0, n)) {
        nonce++;
        hashNew = calculateHash(base, nonce);
    }
    console.log(`Needed iterations: ${nonce}`);
    console.log(`Collided string: ${base + nonce}, hash: ${hashNew}`);
}

findCollision(5);