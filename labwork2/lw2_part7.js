const crypto = require('crypto');
const sha256 = (data) => crypto.createHash("sha256").update(data).digest("hex");

function buildMerkleTree(transactions) {
    let level = transactions.map(leaf => sha256(JSON.stringify(leaf)));
    const tree = [level]; // array of arrays

    while (level.length > 1) {
        if (level.length % 2 === 1) {
            level.push(level[level.length - 1]); // if odd, last element doubles and create own pair
        }

        const nextLevel = [];
        for (let i = 0; i < level.length; i += 2) {
            nextLevel.push(sha256(level[i] + level[i + 1]));
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

    getMerkleProof(txId) {
        let merkleTree = buildMerkleTree(this.data);
        let tx = merkleTree[0][txId];
        let proof = [];

        for (let i = 0; i < merkleTree.length - 1; i++) {
            const level = merkleTree[i];
            const index = level.indexOf(tx); // returns the first index 
            // at which a given element can be found in the array,
            if (index === -1) { //  -1 if it is not present.
                console.log("Invalid index.");
                return [];
            }

            const directionBool = index % 2; //  1 [true] - left, 0 [false] - right
            const siblingIndex = directionBool ? index - 1 : index + 1;
            if (siblingIndex < level.length) {
                proof.push({ hash: level[siblingIndex], direction: directionBool ? "left" : "right" });
            }
            tx = sha256(
                directionBool
                    ? level[siblingIndex] + level[index]
                    : level[index] + level[siblingIndex]
            );
        }
        return proof;
    }

    verifyProof(txId, proof, root) {

        let tx = buildMerkleTree(this.data)[0][txId];
        for (let step of proof) {
            tx = step.direction === "left"
                ? sha256((step.hash + tx))
                : sha256((tx + step.hash));
        }
        return tx === root;
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
    { from: "Ivan", to: "Vlad", amount: 70 },
    { from: "Bank", to: "Geo", amount: 5 },
    { from: "Pan", to: "Owl", amount: 60 },
]);

const txId = 2;
const proof = demoBC.chain[1].getMerkleProof(txId);

console.log(`Merkle proof for transaction with id = ${txId}:`);
console.log(proof); // can be not-displayable in debug console

console.log("Is proof valid if transaction exist? ", demoBC.chain[1].verifyProof(txId, proof, demoBC.chain[1].merkleRoot));
console.log("Transaction don't exist, is proof valid? ", demoBC.chain[1].verifyProof(4, proof, demoBC.chain[1].merkleRoot));

const genesisProof = demoBC.chain[1].getMerkleProof(0); // as non-valid
console.log("Corrupting proof... is proof valid? ", demoBC.chain[1].verifyProof(txId, genesisProof, demoBC.chain[1].merkleRoot));

demoBC.chain[1].data[2].amount = 1000;
console.log("Corrupting data in transactions... Is proof valid? ", demoBC.chain[1].verifyProof(txId, proof, demoBC.chain[1].merkleRoot));
