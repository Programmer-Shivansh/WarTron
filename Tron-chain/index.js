const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const DiamSdk = require('diamante-sdk-js');
const {
    Keypair,
    TransactionBuilder,
    Operation,
    Networks, Asset
} = require('diamante-base');
const { Horizon } = require('diamante-sdk-js');

const app = express();
const port = 3001;

// Use body-parser middleware
app.use(bodyParser.json());

// Use CORS middleware with specific origin
app.use(cors());

app.get("/",(req, res) => {
    res.send("Hello, World!");
})
app.post('/create-keypair', (req, res) => {
    try {
        // console.log('Received request to create keypair');
        const keypair = Keypair.random();
        // console.log('Keypair created:', keypair.publicKey(), keypair.secret());
        res.json({
            publicKey: keypair.publicKey(),
            secret: keypair.secret()
        });
    } catch (error) {
        console.error('Error in create-keypair:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/fund-account', async (req, res) => {
    try {
        const { publicKey } = req.body;
        console.log(`Received request to fund account ${publicKey}`);
        const fetch = await import('node-fetch').then(mod => mod.default);
        const response = await fetch(`https://friendbot.diamcircle.io/?addr=${publicKey}`);
        if (!response.ok) {
            throw new Error(`Failed to activate account ${publicKey}: ${response.statusText}`);
        }
        const result = await response.json();
        // console.log(`Account ${publicKey} activated`, result);
        res.json({ message: `Account ${publicKey} funded successfully` });
    } catch (error) {
        console.error('Error in fund-account:', error);
        res.status(500).json({ error: error.message });
    }
});
app.post('/make-payment', async (req, res) => {
    try {
        const { senderSecret, receiverPublicKey, amount } = req.body;
        console.log(`Received request to make payment from ${senderSecret} to ${receiverPublicKey} with amount ${amount}`);
        if (typeof senderSecret !== 'string' || typeof receiverPublicKey !== 'string' || typeof amount !== 'string' ) {
            throw new Error('senderSecret and receiverPublicKey and amount must be strings');
        }

        const server = new DiamSdk.Horizon.Server('https://diamtestnet.diamcircle.io'); // Ensure URL is correct
        const senderKeypair = DiamSdk.Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        // Load sender's account
        const account = await server.loadAccount(senderPublicKey);

        // Create and build the transaction
        const transaction = new DiamSdk.TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: DiamSdk.Networks.TESTNET,
        })
            .addOperation(
                DiamSdk.Operation.payment({
                    destination: receiverPublicKey,
                    asset: DiamSdk.Asset.native(),
                    amount: (parseFloat(amount)).toFixed(7).toString() // Ensure amount is formatted correctly
                })
            )
            .setTimeout(100) // Adjust timeout as needed
            .build();

        // Sign the transaction
        transaction.sign(senderKeypair);

        // Submit the transaction
        const result = await server.submitTransaction(transaction);
        console.log(`Payment made from ${senderPublicKey} to ${receiverPublicKey} with amount ${amount}`, result.id);
        res.json({ message: `Payment of ${amount} DIAM made from ${senderPublicKey} successfully. Transaction ID ${result.id}`, result });
    } catch (error) {
        console.error('Error in make-payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});


// app.post('/make-payment', async (req, res) => {
//     try {
//         const { senderSecret, receiverPublicKey, amount } = req.body;
//         console.log(`Received request to make payment from ${senderSecret} to ${receiverPublicKey} with amount ${amount}`);

//         const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
//         const senderKeypair = Keypair.fromSecret(senderSecret);
//         const senderPublicKey = senderKeypair.publicKey();
//         // console.log("first")
//         const account = await server.loadAccount(senderPublicKey);
//         // console.log("first")
        
//         const transaction = new TransactionBuilder(account, {
//             fee: await server.fetchBaseFee(),
//             networkPassphrase: Networks.TESTNET,
//         })
//             .addOperation(Operation.payment({
//                 destination: receiverPublicKey,
//                 asset: Asset.native(),
//                 amount: amount,
//             }))
//             .setTimeout(30)
//             .build();
//         // console.log("second")
//         transaction.sign(senderKeypair);
//         const result = await server.submitTransaction(transaction);
//         console.log(`Payment made from ${senderPublicKey} to ${receiverPublicKey} with amount ${amount}`, result);
//         res.json({ message: `Payment of ${amount} DIAM made from ${senderPublicKey} successfully` });
//     } catch (error) {
//         console.error('Error in make-payment:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

app.post('/give-reward', async (req, res) => {
    try {
        const { senderSecret, receiverSecretKey, amount } = req.body;
        // console.log(`Received request to make payment from ${senderSecret} to ${receiverPublicKey} with amount ${amount}`);

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();
        const receiverKeypair = Keypair.fromSecret(receiverSecretKey);
        const receiverPublicKey = receiverKeypair.publicKey();
        // console.log("first")
        const account = await server.loadAccount(senderPublicKey);
        // console.log("first")
        const transaction = new DiamSdk.TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: DiamSdk.Networks.TESTNET,
        })
            .addOperation(
                DiamSdk.Operation.payment({
                    destination: receiverPublicKey,
                    asset: DiamSdk.Asset.native(),
                    amount: (parseFloat(amount)).toFixed(7).toString() // Ensure amount is formatted correctly
                })
            )
            .setTimeout(100) // Adjust timeout as needed
            .build();

        // Sign the transaction
        transaction.sign(senderKeypair);

        // Submit the transaction
        const result = await server.submitTransaction(transaction);
        console.log(`Payment made from ${senderPublicKey} to ${receiverPublicKey} with amount ${amount}`, result);
        res.json({ message: `Reward of ${amount} DIAM made to ${receiverPublicKey} successfully. Transaction ID ${result.id}` });
    } catch (error) {
        console.error('Error in make-payment:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/manage-data', async (req, res) => {
    try {
        const { senderSecret, key, value } = req.body;
        console.log(`Received request to manage data for key ${key} with value ${value}`);

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.manageData({
                name: key,
                value: value || null,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        console.log(`Data managed for key ${key} with value ${value}`, result);
        res.json({ message: `Data for key ${key} managed successfully` });
    } catch (error) {
        console.error('Error in manage-data:', error);
        res.status(500).json({ error: error.message });
    }
});



app.post('/set-options', async (req, res) => {
    try {
        const { senderSecret, inflationDest, homeDomain, lowThreshold, medThreshold, highThreshold } = req.body;
        console.log(`Received request to set options with inflationDest: ${inflationDest}, homeDomain: ${homeDomain}, thresholds: ${lowThreshold}, ${medThreshold}, ${highThreshold}`);

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.setOptions({
                inflationDest: inflationDest || undefined,
                homeDomain: homeDomain || undefined,
                lowThreshold: lowThreshold ? parseInt(lowThreshold) : undefined,
                medThreshold: medThreshold ? parseInt(medThreshold) : undefined,
                highThreshold: highThreshold ? parseInt(highThreshold) : undefined,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        console.log('Options set successfully:', result);
        res.json({ message: 'Options set successfully' });
    } catch (error) {
        console.error('Error in set-options:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Diamante backend listening at http://localhost:${port}`);
});