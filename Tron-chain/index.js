const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {TronWeb} = require('tronweb');
const bip39 = require('bip39');
const hdkey = require('hdkey');
const app = express();
const port = 3001;
require('dotenv').config();

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
        const senderSeedPhrase = process.env.SENDER_SEED_PHRASE;

        if (!senderSeedPhrase) {
            throw new Error('Sender seed phrase not found in environment variables');
        }
        // Generate private key from seed phrase
        const seed = await bip39.mnemonicToSeed(senderSeedPhrase);
        const root = hdkey.fromMasterSeed(seed);
        const addrNode = root.derive("m/44'/195'/0'/0/0");
        const privateKey = addrNode.privateKey.toString('hex');

        // Initialize TronWeb with the derived private key
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            privateKey: privateKey
        });

        const senderAddress = tronWeb.address.fromPrivateKey(privateKey);
        const amountInSun = tronWeb.toSun(amount);

        // Build the transaction
        const tradeObj = await tronWeb.transactionBuilder.sendTrx(
            receiverSecretKey,
            amountInSun,
            senderAddress
        );
        
        // Sign the transaction
        const signedTxn = await tronWeb.trx.sign(tradeObj);

        // Broadcast the transaction
        const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);

        console.log(`Payment made from ${senderAddress} to ${receiverSecretKey} with amount ${amount}`, receipt);
        res.json({ message: `Reward of ${amount} TRX made to ${receiverSecretKey} successfully. Transaction ID ${receipt.txid}` });
    } catch (error) {
        console.error('Error in give-reward:', error);
        res.status(500).json({ error: error.message });
    }
});



//####################

app.listen(port, () => {
    console.log(`Diamante backend listening at http://localhost:${port}`);
});