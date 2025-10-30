const crypto = require("crypto");

function generateString(length) {
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = "";
    for (let i = 0; i < length; i++) {
        let randomLetterNumber = Math.floor(Math.random() * abc.length); // Math.floor - rounds down
        result += abc.charAt(randomLetterNumber); // getting char from number position
    }
    return result;
}

const stringOld = generateString(16);
const sha256HashOld = crypto.createHash("sha256").update(stringOld).digest("hex");
console.log(`Generated string: ${stringOld}`);
console.log(`SHA256 hash: ${sha256HashOld}`);

let stringNew = stringOld.substring(0, 15) + "0";
if (stringNew === stringOld) stringNew = stringOld.substring(0, 15) + "1"; // if random string has "0" in end
const sha256HashNew = crypto.createHash("sha256").update(stringNew).digest("hex");

console.log(`\nSlightly new string: ${stringNew}`);
console.log(`SHA256 hash: ${sha256HashNew}`);

// even changing 1 character will completely change whole hash - it's Avalanche effect
// without this user can make predictions about the input, being given only the output, which can break security and algorithm