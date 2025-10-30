import Web3 from 'web3';

const web3 = new Web3('http://127.0.0.1:8545');

//Deploy & run transactions -> Deployed Contracts -> Copy Address
const contractAddress = '0xa53d8ba183D0071Bd1Da5ec75AEaEf994e1a391e';

// Solidity compiler -> ABI -> Copy ABI to clipboard
const ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_newGreet",
                "type": "string"
            }
        ],
        "name": "setGreet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "greet",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const contract = new web3.eth.Contract(ABI, contractAddress);

async function main() {
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts: ", accounts);
    const sender = accounts[0];

    const startGreet = await contract.methods.greet().call();
    console.log("Greet message from Remix: ", startGreet);

    await contract.methods.setGreet("Hello from Web3 and VS!").send({ from: sender });

    const newGreet = await contract.methods.greet().call();
    console.log("New greet message: ", newGreet);
}

main();