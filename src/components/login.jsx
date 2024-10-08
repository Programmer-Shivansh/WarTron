import React, { useState, useEffect } from 'react';
import Vortex from './vortex';
import { Button, useDisclosure, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userDataAtom } from '../atoms/public';

export function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [secretKey, setSecretKey] = useState('');
  const [address, setAddress] = useState('');
  const [publics, setPublics] = useRecoilState(userDataAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTronLink = async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        console.log('TronLink is installed and ready');
        
        // Automatically connect and retrieve the address if TronLink is already connected
        const tronweb = window.tronWeb;
        const publicKey = tronweb.defaultAddress.base58;
  
        if (publicKey) {
          handleLogin(publicKey, publicKey); // Call handleLogin with the public key
        }
        
      } else {
        console.log('TronLink is not installed or not ready');
        toast({
          title: 'TronLink Not Detected',
          description: 'Please install TronLink extension and refresh the page.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    checkTronLink();
  }, [toast]);
  

  const handleLogin = (key, addr) => {
    if (key) {
      localStorage.setItem('SecretKey', key);
      console.log(key)
      setPublics(key);
      setSecretKey(key);
      setAddress(addr);
      setIsLoggedIn(true);
      toast({
        title: 'Logged In',
        description: `You are now logged in with the address: ${addr}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate('/');
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a Secret key or connect your wallet.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (window.tronWeb && window.tronWeb.ready) {
        const tronweb = window.tronWeb;
        const accounts = await tronweb.request({ method: 'tron_requestAccounts' });
        if (accounts.length > 0) {
          const connectedAddress = accounts[0];
          setAddress(connectedAddress);
          toast({
            title: 'Wallet Connected',
            description: `Connected to address: ${connectedAddress}`,
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          
          // Here you would typically call your backend to verify the address and get a session token
          // For now, we'll just use the address as the key
          handleLogin(connectedAddress, connectedAddress);
          navigate("/");
        }
      } else {
        throw new Error('TronLink is not installed or not ready');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect wallet. Make sure TronLink is installed and unlocked.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const openLoginModal = () => {
    setModalType('login');
    onOpen();
  };

  const openCreateModal = () => {
    setModalType('create');
    onOpen();
  };
  return (
    <div className="mx-auto h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          WarTron
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Play, Earn, Repeat: Earn rewards in Real Time!
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
            onClick={connectWallet}
            isLoading={isConnecting}
          >
            Connect Wallet
          </Button>
          
        </div>
        <div className="fixed top-4 right-4 bg-black text-green-500 p-2 rounded-md">
          {isLoggedIn ? `Address: ${address.slice(0, 4)}...${address.slice(-4)}` : 'Not Logged In'}
        </div>
      </Vortex>
 
    </div>
  );
}