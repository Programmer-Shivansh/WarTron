const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {TronWeb} = require('tronweb');

const app = express();
const port = 3001;

// Use body-parser middleware
app.use(bodyParser.json());

// Use CORS middleware with specific origin
app.use(cors());

app.get("/",(req, res) => {
    res.send("Hello, World!");
})

const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer
);


app.post('/create-keypair', async (req, res) => {
    try {
        const account = await tronWeb.createAccount();
        res.json({
            address: account.address.base58,
            privateKey: account.privateKey
        });
    } catch (error) {
        console.error('Error in create-keypair:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/fund-account', async (req, res) => {
    try {
        const { address } = req.body;
        console.log(`Received request to fund account ${address}`);
        
        // For Shasta testnet, you can use the Shasta Faucet
        // This is just a placeholder message. In a real application, you'd implement the funding logic here.
        res.json({ message: `To fund account ${address} on Shasta testnet, please use the Shasta Faucet: https://www.trongrid.io/shasta` });
    } catch (error) {
        console.error('Error in fund-account:', error);
        res.status(500).json({ error: error.message });
    }
});
app.post('/make-payment', async (req, res) => {
    try {
      const { senderAddress, receiverAddress, amount } = req.body;
      console.log(`Received request to make payment from ${senderAddress} to ${receiverAddress} with amount ${amount}`);
  
      if (typeof senderAddress !== 'string' || typeof receiverAddress !== 'string' || typeof amount !== 'string') {
        throw new Error('senderAddress, receiverAddress, and amount must be strings');
      }
  
      // Convert TRX to SUN (1 TRX = 1,000,000 SUN)
      const amountInSun = tronWeb.toSun(amount);
  
      // Check if the sender has sufficient balance
      const balance = await tronWeb.trx.getBalance(senderAddress);
      if (balance < amountInSun) {
        throw new Error('Insufficient balance');
      }
  
      // Build the transaction
      const tradeObj = await tronWeb.transactionBuilder.sendTrx(
        receiverAddress,
        amountInSun,
        senderAddress
      );
  
      // Sign the transaction using the admin's private key
      const signedTxn = await tronWeb.trx.sign(tradeObj);
  
      // Broadcast the transaction
      const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);
  
      console.log(`Payment made from ${senderAddress} to ${receiverAddress} with amount ${amount} TRX`, receipt.txid);
      res.json({ 
        message: `Payment of ${amount} TRX made from ${senderAddress} successfully. Transaction ID: ${receipt.txid}`, 
        result: receipt 
      });
    } catch (error) {
      console.error('Error in make-payment:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

app.post('/give-reward', async (req, res) => {
    try {
        const { senderSecret, receiverSecretKey, amount } = req.body;

        // tronWeb.setPrivateKey(senderSecret);
        // const senderPublicKey = tronWeb.address.fromPrivateKey(senderSecret);
        const senderAddress = tronWeb.address.fromPrivateKey(senderSecret);


        const receiverPublicKey = tronWeb.address.fromPrivateKey(receiverSecretKey);

        const amountInSun = tronWeb.toSun(amount);

        // Get the admin's address (sender)

        // Build the transaction
        const tradeObj = await tronWeb.transactionBuilder.sendTrx(
            receiverPublicKey,
            amountInSun,
            senderAddress
        );
        
        // Sign the transaction
        const signedTxn = await tronWeb.trx.sign(tradeObj);

        // Broadcast the transaction
        const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);

        console.log(`Payment made from ${senderPublicKey} to ${receiverPublicKey} with amount ${amount}`, receipt);
        res.json({ message: `Reward of ${amount} TRX made to ${receiverPublicKey} successfully. Transaction ID ${receipt.txid}` });
    } catch (error) {
        console.error('Error in make-payment:', error);
        res.status(500).json({ error: error.message });
    }
});








//####################

app.listen(port, () => {
    console.log(`Diamante backend listening at http://localhost:${port}`);
});