const crypto = require('crypto');
const sha256 = (data) => crypto.createHash("sha256").update(data).digest("hex");

function buildMerkleTree(transactions) {
    //let txAmount = transactions.length;

    let level = transactions.map(tx => sha256(JSON.stringify(tx)));
    // making every transaction data into string, and calc hash

    const tree = [level]; // array of arrays
    while (level.length > 1) {
        const nextLevel = [];

        for (let i = 0; i < level.length; i += 2) {
            if (i + 1 < level.length) nextLevel.push(sha256(level[i] + level[i + 1]));
            else nextLevel.push(level[i]);
        }

        tree.push(nextLevel);
        level = nextLevel;
    }
    return tree;
}


class Block {
    constructor(data, previousHash, merkleTree = []) {
        this.timestamp = Date.now();
        this.data = data; // need to be array of objects
        this.previousHash = previousHash;
        this.merkleTree = merkleTree;
        this.merkleRoot = this.merkleTree[this.merkleTree.length - 1][0];
        this.hash = this.calculateHash();

    }

    calculateHash() {
        const merkleTree = buildMerkleTree(this.data);
        const merkleRoot = merkleTree[merkleTree.length - 1][0];

        const hashString = this.timestamp + this.previousHash + merkleRoot;
        return crypto.createHash('sha256').update(hashString).digest('hex');
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        const data = ["Genesis Block"];
        return new Block(data, "0", buildMerkleTree(data));
    }

    addBlock(data) {
        const newBlock = new Block(data, this.getLastBlock().hash, buildMerkleTree(data));
        console.log(`Block <${newBlock.hash}>`,
            `\nTransactions: `);
        newBlock.data.forEach((tx) => console.log(` From ${tx.from} to ${tx.to}, amount: ${tx.amount}`));

        console.log("Merkle tree:");
        newBlock.merkleTree.forEach((level, index) => {
            console.log(` Level ${index}:`);
            level.forEach(hash => console.log(`  ${hash}`));
        });
        console.log(`Merkle root: ${newBlock.merkleRoot}`);

        console.log("\n");
        this.chain.push(newBlock);
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



const demoBC = new Blockchain();
demoBC.addBlock([
    { from: "Tom", to: "Bob", amount: 10 },
    { from: "Den", to: "Rem", amount: 45 },
    { from: "Ivan", to: "Vlad", amount: 70 }
]);

demoBC.addBlock([
    { from: "Bank", to: "Geo", amount: 5 },
    { from: "Pan", to: "Owl", amount: 60 },
]);

console.log("Is chain valid?", demoBC.isChainValid());
demoBC.chain[2].data[0].amount = 1000;

console.log("Block was hacked. Is chain still valid?", demoBC.isChainValid());