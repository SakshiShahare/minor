const {Web3} = require('web3');
const KYC = require('./build/contracts/KYC.json');

async function main() {
    const web3 = new Web3('http://127.0.0.1:7545'); // Connect to Ganache
    const accounts = await web3.eth.getAccounts();

    // Deploying the contract (if not already deployed)
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = KYC.networks[networkId];
    const contract = new web3.eth.Contract(KYC.abi, deployedNetwork.address);

    // Example: Register a user
    const userName = "John Doe";
    const userEmail = "john@example.com";
    const userIdNumber = "1234567890";
    const gasLimit = 3000000; // Set a higher gas limit

    try {
        await contract.methods.registerUser(userName, userEmail, userIdNumber).send({ 
            from: accounts[0], 
            gas: gasLimit // Include gas limit here
        });

        // Example: Verify the user (only admin can do this)
        await contract.methods.verifyUser(accounts[0]).send({ 
            from: accounts[0], 
            gas: gasLimit // Include gas limit here
        });

        // Example: Get user info
        const userInfo = await contract.methods.getUser(accounts[0]).call();
        console.log(userInfo);
    } catch (error) {
        console.error("Error interacting with contract:", error);
    }
}

main().catch(console.error);
