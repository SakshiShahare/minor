// Import necessary packages
const express = require('express');
const {Web3} = require('web3');
const bodyParser = require('body-parser');
const KYC = require('./build/contracts/KYC.json'); // Adjust the path to your compiled contract

// Set up Express app
const app = express();
const port = 3002; // Change port as needed

// Middleware
app.use(bodyParser.json()); // For parsing application/json

// Connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545'); // Ensure this matches your Ganache settings
const networkId =  5777;
const deployedNetwork = KYC.networks[networkId];
const contract = new web3.eth.Contract(KYC.abi, deployedNetwork.address);

// Function to validate Ethereum address
function isValidAddress(address) {
    return web3.utils.isAddress(address);
}

// Routes

// Register a new user
app.post('/register', async (req, res) => {
    const { name, email, idNumber, from } = req.body; // Get from body

    // Validate the 'from' address
    if (!isValidAddress(from)) {
        return res.status(400).send({ error: 'Invalid from address.' });
    }

    try {
        const gasLimit = 3000000; // Set a higher gas limit

        // Register user on the smart contract
        await contract.methods.registerUser(name, email, idNumber).send({ from, gas: gasLimit });

        res.status(200).send({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Error registering user.' });
    }
});

// Verify a user
app.post('/verify', async (req, res) => {
    const { userAddress, from } = req.body;

    // Validate the 'from' address
    if (!isValidAddress(from)) {
        return res.status(400).send({ error: 'Invalid from address.' });
    }

    try {
        const gasLimit = 3000000; // Set a higher gas limit

        // Verify user on the smart contract
        await contract.methods.verifyUser(userAddress).send({ from, gas: gasLimit });

        res.status(200).send({ message: 'User verified successfully!' });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).send({ error: 'Error verifying user.' });
    }
});

// Get user information
app.get('/user/:address', async (req, res) => {
    const { address } = req.params;

    // Validate the address parameter
    if (!isValidAddress(address)) {
        return res.status(400).send({ error: 'Invalid user address.' });
    }

    try {
        // Fetch user info from the smart contract
        const userInfo = await contract.methods.getUser(address).call();
        res.status(200).send({ user: userInfo });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).send({ error: 'Error fetching user info.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
