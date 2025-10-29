const crypto = require('crypto');

class Block {
    /* step 1 */
    constructor(index, data, previousHash = "0", type = "default") {
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
        this.type = type; // for step 6 - alternate mining 
    }

    /* step 2 */
    calculateHash() {
        const hashString = this.index + this.timestamp + this.data + this.previousHash + this.nonce;
        return crypto.createHash('sha256').update(hashString).digest('hex');
        // getting string from block's fields for hashing 
        // => calling sha256-algorithm for hash 
        // => updating with string for calculating
        // => getting result value in hex-encoding 
    }

    /* step 3 */
    mineBlock(difficulty, type) {
        const timeStart = Date.now();

        if (type === "default") {
            while (this.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
                // "hello".substring(1, 4) => "ell"
                // "dr".repeat(3) => "drdrdr"
                this.nonce++;
                this.hash = this.calculateHash();
            }
        }

        /* step 6 */
        else if (type === "alternate") {
            while (this.hash[2] !== '3') {
                // string - char's array
                this.nonce++;
                this.hash = this.calculateHash();
            }
        }

        else {
            console.log("Unknown type.");
            return 0;
        }

        const timeEnd = Date.now();
        console.log(`Block mined: <${this.hash}>, ` +
            `Operation takes ${timeEnd - timeStart} milliseconds and ${this.nonce} iterations.`);
    }
}


/* step 4 */
class Blockchain {
    constructor(difficulty) {
        this.chain = [this.createGenesisBlock()]; // chain always start with genesis block
        this.difficulty = difficulty;
    }

    createGenesisBlock() {
        return new Block(0, "Genesis Block", "0");
    }

    addBlock(data, type = "default") {
        const newBlock = new Block(this.chain.length, data, this.getLastBlock().hash, type);
        newBlock.mineBlock(this.difficulty, type);
        this.chain.push(newBlock);
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
        // [0, 1, 2] => length = 3, last item's index = 2 
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) return false;
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;

            if (currentBlock.type === "default") {
                if (currentBlock.hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) return false;
            }

            else if (currentBlock.type === "alternate") {
                if (currentBlock.hash[2] !== '3') return false;
            }
        }
        return true;
    }
}


/* step 5 */
let demoBC = new Blockchain(3);
demoBC.addBlock("1 block");
demoBC.addBlock("2 block");
demoBC.addBlock("3 block");
demoBC.addBlock("Alt block", "alternate");
console.log("Is Chain Valid? ", demoBC.isChainValid());

demoBC.chain[1].data = "Hacked!";
console.log("\nBlock was hacked, so...");
console.log("Is Chain Valid? ", demoBC.isChainValid()); 