const crypto = require('crypto');

/* step 1 */
class Validator {
    constructor(name, stake) {
        this.name = name;
        this.stake = stake;
        this.blocksOwned = 0; // for statistic
    }
}

/* step 3 */
class Block {
    constructor(index, data, validator, previousHash = "0") {
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.validator = validator;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const hashString = this.index + this.timestamp + this.data + this.validator + this.previousHash;
        return crypto.createHash('sha256').update(hashString).digest('hex');
    }
}


/* step 4 */
class Blockchain {
    constructor(validators) {
        this.chain = [this.createGenesisBlock()];
        this.validators = validators; // list
    }

    createGenesisBlock() {
        return new Block(0, "Genesis Block", "Genesis Validator", "0");
    }

    addBlock(data) {
        const validator = this.chooseValidator();
        const newBlock = new Block(this.chain.length, data, validator.name, this.getLastBlock().hash);
        console.log(`Block <${newBlock.hash}> ` +
            `validated by ${validator.name} (stake = ${validator.stake})`);
        this.chain.push(newBlock);
    }

    /* step 2 */
    chooseValidator() {
        const totalStake = this.validators.reduce((sum, validator) => sum + validator.stake, 0); // 0 - initial value
        let randPosition = Math.random() * totalStake; // Math.random => [0, 1]
        for (const validator of this.validators) {
            // The for...of statement executes a loop that operates on a sequence of values sourced from an iterable object.
            randPosition -= validator.stake;
            if (randPosition < 0) {
                validator.blocksOwned++;
                return validator;
            }
        }
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) return false;
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
        }
        return true;
    }
}



/* step 5 */
let validatorsList = [
    new Validator("Tom", 5),
    new Validator("Bob", 10),
    new Validator("Charlie", 1),
]
let validatorsListCopy = structuredClone(validatorsList);
// for clearing "blocksOwned" data from previous blockchain 

let demoBC = new Blockchain(validatorsList);
for (let i = 0; i < 5; i++) {
    demoBC.addBlock(`${i} block`);
}
for (let i = 0; i < validatorsList.length; i++) {
    let validator = demoBC.validators[i];
    console.log(`${validator.name} owned ${validator.blocksOwned} blocks`);
}
console.log("Is Chain Valid? ", demoBC.isChainValid());

demoBC.chain[1].data = "Hacked!";
console.log("\nBlock was hacked, so...");
console.log("Is Chain Valid? ", demoBC.isChainValid());


console.log("\n\n");
let demoBC_big = new Blockchain(validatorsListCopy);
for (let i = 0; i < 100; i++) {
    demoBC_big.addBlock(`${i} block`);
}
for (let i = 0; i < validatorsList.length; i++) {
    let validator = demoBC_big.validators[i];
    console.log(`${validator.name} owned ${validator.blocksOwned} blocks`);
}
console.log("Is Chain Valid? ", demoBC_big.isChainValid());