import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [fromAddress, setFromAddress] = useState(''); // Added fromAddress state
    const [userInfo, setUserInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const registerUser = async () => {
        if (!name || !email || !idNumber || !fromAddress) {
            alert('Please fill in all fields!');
            return;
        }

        const requestData = {
            name,
            email,
            idNumber,
            from: fromAddress // Send fromAddress to the backend
        };

        try {
            const response = await axios.post('http://localhost:3002/register', requestData); // API endpoint
            alert(response.data.message); // Alert the success message
        } catch (error) {
            console.error('Error registering user:', error.response ? error.response.data : error);
            alert('Error registering user: ' + (error.response ? error.response.data.error : 'Unknown error')); // Show error message
        }
    };

    const verifyUser = async () => {
        if (!userAddress || !fromAddress) {
            alert('Please enter the user address and from address.');
            return;
        }

        const verifyData = {
            userAddress,
            from: fromAddress // Send fromAddress to the backend
        };

        try {
            const response = await axios.post('http://localhost:3002/verify', verifyData); // API endpoint
            alert(response.data.message); // Alert the success message
        } catch (error) {
            console.error('Error verifying user:', error.response ? error.response.data : error);
            alert('Error verifying user: ' + (error.response ? error.response.data.error : 'Unknown error')); // Show error message
        }
    };

    const getUser = async () => {
        if (!userAddress) {
            alert('Please enter a user address.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3002/user/${userAddress}`); // API endpoint
            setUserInfo(response.data.user);
        } catch (error) {
            console.error('Error fetching user info:', error.response ? error.response.data : error);
            alert('Error fetching user info: ' + (error.response ? error.response.data.error : 'Unknown error')); // Show error message
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>KYC Blockchain Application</h1>

            <h2>Register User</h2>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
            <input placeholder="From Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} />
            <button onClick={registerUser}>Register</button>

            <h2>Verify User</h2>
            <input placeholder="User Address" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
            <input placeholder="From Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} />
            <button onClick={verifyUser}>Verify</button>

            <h2>Get User Info</h2>
            <button onClick={getUser}>Get User Info</button>
            {userInfo && <div>{JSON.stringify(userInfo)}</div>}
        </div>
    );
}

export default App;
