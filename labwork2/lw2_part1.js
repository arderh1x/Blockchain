const crypto = require("crypto");
const readline = require("readline");

// getting user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Input string: ", (input) => {
    const sha256Hash = crypto.createHash("sha256").update(input).digest("hex");
    const sha3Hash = crypto.createHash("sha3-256").update(input).digest("hex");

    console.log("SHA-256: ", sha256Hash);
    console.log("SHA-3: ", sha3Hash);

    const diffLength = sha256Hash.length - sha3Hash.length
    if (diffLength > 0) console.log(`SHA256 hash is ${diffLength} characters longer than SHA3 hash.`);
    else if (diffLength < 0) console.log(`SHA3 hash is ${diffLength * -1} characters longer than SHA256 hash.`);
    else console.log(`SHA256 hash and SHA3 hash have the same length.`);

    console.log("SHA-256 is generally faster, but SHA-3 is more secure.");
    rl.close();
});
