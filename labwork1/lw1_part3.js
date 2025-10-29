const axios = require("axios");

/* step 1 */
const apiKey = "5KFF4AEFDU8PRQ5FDJQRE6QP247I9835WR";
const url = "https://api.etherscan.io/v2/api?chainid=1&module=proxy"; // changed to v2 and combined some parameters

/* step 2 */
async function getLatestBlockNumber(apiKey) {
    //https://docs.etherscan.io/api-reference/endpoint/ethblocknumber
    const params = {
        action: "eth_blockNumber",
        apikey: apiKey
    };

    const response = await axios.get(url, { params });
    if (response.status === 200) {
        /* step 5 */
        if (response.message === "NOTOK") {
            console.log(response.result);
        }
        return response.data.result;
    } else console.log("Request failed with status code: ", response.status);
}


/* step 3 */
async function getBlockByNumber(apiKey, number) {
    //https://docs.etherscan.io/api-reference/endpoint/ethgetblockbynumber
    const params = {
        action: "eth_getBlockByNumber",
        tag: number,
        boolean: "true",
        apikey: apiKey
    };

    const response = await axios.get(url, { params });
    if (response.status === 200) {
        /* step 5 */
        if (response.message === "NOTOK") {
            console.log(response.result);
        }
        return response.data.result;
    } else console.log("Request failed with status code: ", response.status);
}

/* step 6 */
async function getTransactionCountByNumber(apiKey, number) {
    //https://docs.etherscan.io/api-reference/endpoint/ethgetblocktransactioncountbynumber
    const params = {
        action: "eth_getBlockTransactionCountByNumber",
        tag: number,
        boolean: "true",
        apikey: apiKey
    };

    const response = await axios.get(url, { params });
    if (response.status === 200) {
        /* step 5 */
        if (response.message === "NOTOK") {
            console.log(response.result);
        }
        return response.data.result;
    } else console.log("Request failed with status code: ", response.status);
}



(async () => {
    const latestBlockNumber = await getLatestBlockNumber(apiKey);
    const latestBlock = await getBlockByNumber(apiKey, latestBlockNumber);

    /* step 4 */
    const blockNumber = parseInt(latestBlock.number, 16); // 16 => from hex to dec
    const timestamp = new Date(parseInt(latestBlock.timestamp, 16) * 1000).toLocaleString(); // to seconds
    const transactionsCount = latestBlock.transactions.length;
    const hash = latestBlock.hash;
    const previousHash = latestBlock.parentHash;

    console.log("Latest block information: ");
    console.log("Block number: ", blockNumber);
    console.log("Timestamp: ", timestamp);
    console.log("Transaction amount: ", transactionsCount);
    console.log("Block hash: ", hash);
    console.log("Previous hash: ", previousHash, '\n');

    console.log("Transactions amount in last 5 blocks: ")
    let transactionsSum = 0;
    for (let i = 0; i < 5; i++) {
        let blockNum = (blockNumber - i).toString(16);
        let trCount = parseInt(await getTransactionCountByNumber(apiKey, blockNum), 16);
        transactionsSum += trCount;
        console.log(`${i} block from latest: ${trCount}`);
    }

    console.log(`\nAverage transactions amount in 5 latest blocks: ${transactionsSum / 5}`);
})();
