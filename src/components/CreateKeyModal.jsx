import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useToast, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import url from '../../url';

const CreateKeyModal = ({ isOpen, onClose, handleLogin, modalType }) => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  const toast = useToast();

  const generateKeys = async () => {
    try {
      const response = await axios.post(`${url}/create-keypair`);
      const data = response.data;
      setPublicKey(data.publicKey);
      setPrivateKey(data.secret);
    } catch (error) {
      console.error('Error generating keys:', error);
      toast({
        title: 'Error',
        description: 'Error generating keys.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const fundAccount = async () => {
    setIsFunding(true);
    try {
      const response = await axios.post(`${url}/fund-account`, { publicKey });
      const data = response.data;
      toast({
        title: 'Account Funded',
        description: `Account funded successfully: ${data.message}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setIsFunding(false);
    } catch (error) {
      console.error('Error funding account:', error);
      toast({
        title: 'Error',
        description: 'Error funding account.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      setIsFunding(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to Clipboard',
        description: label,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }).catch((error) => {
      console.error('Failed to copy text:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy text.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalType === 'create' ? 'Create Key Pair' : 'Login'}</ModalHeader>
        <ModalBody>
          {modalType === 'create' ? (
            <>
              <Button colorScheme="blue" onClick={generateKeys} className="w-full mb-4">
                Generate Keys
              </Button>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Input
                    placeholder="Public Key"
                    value={publicKey}
                    className="bg-black text-black"
                    isReadOnly
                  />
                  <Button
                    onClick={() => copyToClipboard(publicKey, 'Public Key copied!')}
                    className="ml-2"
                    colorScheme="teal"
                  >
                    Copy
                  </Button>
                </div>
                <div className="flex items-center">
                  <Input
                    placeholder="Private Key"
                    value={privateKey}
                    className="bg-black text-black"
                    isReadOnly
                  />
                  <Button
                    onClick={() => copyToClipboard(privateKey, 'Private Key copied!')}
                    className="ml-2"
                    colorScheme="teal"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <Button
                colorScheme="teal"
                onClick={fundAccount}
                className="w-full"
                isDisabled={isFunding}
              >
                {isFunding ? <Spinner /> : 'Fund Account'}
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Enter Secret Key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="mb-4 bg-black text-black"
              />
              <Button
                colorScheme="blue"
                onClick={() => handleLogin(privateKey)}
                className="w-full"
              >
                Login with Secret Key
              </Button>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateKeyModal;


// import React, { useState } from 'react';
// import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useToast } from '@chakra-ui/react';
// import axios from 'axios';

// const CreateKeyModal = ({ isOpen, onClose, handleLogin, modalType }) => {
//   const [publicKey, setPublicKey] = useState('');
//   const [privateKey, setPrivateKey] = useState('');
//   const [isFunding, setIsFunding] = useState(false);
//   const toast = useToast();

//   const generateKeys = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/create-keypair');
//       const data = response.data;
//       setPublicKey(data.publicKey);
//       setPrivateKey(data.secret);
//     } catch (error) {
//       console.error('Error generating keys:', error);
//       toast({
//         title: 'Error',
//         description: 'Error generating keys.',
//         status: 'error',
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//   };

//   const fundAccount = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/fund-account', { publicKey });
//       const data = response.data;
//       toast({
//         title: 'Account Funded',
//         description: `Account funded successfully: ${data.message}`,
//         status: 'success',
//         duration: 2000,
//         isClosable: true,
//       });
//       setIsFunding(true);
//     } catch (error) {
//       console.error('Error funding account:', error);
//       toast({
//         title: 'Error',
//         description: 'Error funding account.',
//         status: 'error',
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>{modalType === 'create' ? 'Create Key Pair' : 'Login'}</ModalHeader>
//         <ModalBody>
//           {modalType === 'create' ? (
//             <>
//               <Button colorScheme="blue" onClick={generateKeys} className="w-full mb-4">
//                 Generate Keys
//               </Button>
//               <div className="mb-4">
//                 <Input
//                   placeholder="Public Key"
//                   value={publicKey}
//                   className="mb-2 bg-black text-white"
//                   isReadOnly
//                 />
//                 <Input
//                   placeholder="Private Key"
//                   value={privateKey}
//                   className="bg-black text-white"
//                   isReadOnly
//                 />
//               </div>
//               <Button
//                 colorScheme="teal"
//                 onClick={fundAccount}
//                 className="w-full"
//                 isDisabled={isFunding}
//               >
//                 Fund Account
//               </Button>
//             </>
//           ) : (
//             <>
//               <Input
//                 placeholder="Enter Public Key"
//                 value={publicKey}
//                 onChange={(e) => setPublicKey(e.target.value)}
//                 className="mb-4 bg-black text-white"
//               />
//               <Button
//                 colorScheme="blue"
//                 onClick={() => handleLogin(publicKey)}
//                 className="w-full"
//               >
//                 Login with Public Key
//               </Button>
//             </>
//           )}
//         </ModalBody>
//         <ModalFooter>
//           <Button colorScheme="gray" onClick={onClose}>
//             Close
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CreateKeyModal;
// import React, { useState } from 'react';

// import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useToast } from '@chakra-ui/react';
// import axios from 'axios';

// const CreateKeyModal = ({ isOpen, onClose, handleLogin, modalType }) => {
//   const [publicKey, setPublicKey] = useState('');
//   const [privateKey, setPrivateKey] = useState('');
//   const [isFunding, setIsFunding] = useState(false);
//   const toast = useToast();

//   const generateKeys = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/create-keypair');
//       const data = response.data;
//       setPublicKey(data.publicKey);
//       setPrivateKey(data.secret);
//     } catch (error) {
//       console.error('Error generating keys:', error);
//       toast({
//         title: 'Error',
//         description: 'Error generating keys.',
//         status: 'error',
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//   };

//   const fundAccount = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/fund-account', { publicKey });
//       const data = response.data;
//       toast({
//         title: 'Account Funded',
//         description: `Account funded successfully: ${data.message}`,
//         status: 'success',
//         duration: 2000,
//         isClosable: true,
//       });
//       setIsFunding(true);
//     } catch (error) {
//       console.error('Error funding account:', error);
//       toast({
//         title: 'Error',
//         description: 'Error funding account.',
//         status: 'error',
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>{modalType === 'create' ? 'Create Key Pair' : 'Login'}</ModalHeader>
//         <ModalBody>
//           {modalType === 'create' ? (
//             <>
//               <Button colorScheme="blue" onClick={generateKeys} className="w-full mb-4">
//                 Generate Keys
//               </Button>
//               <div className="mb-4">
//                 <Input
//                   placeholder="Public Key"
//                   value={publicKey}
//                   className="mb-2 bg-black text-white"
//                   isReadOnly
//                 />
//                 <Input
//                   placeholder="Private Key"
//                   value={privateKey}
//                   className="bg-black text-white"
//                   isReadOnly
//                 />
//               </div>
//               <Button
//                 colorScheme="teal"
//                 onClick={fundAccount}
//                 className="w-full"
//                 isDisabled={isFunding}
//               >
//                 Fund Account
//               </Button>
//             </>
//           ) : (
//             <>
//               <Input
//                 placeholder="Enter Public Key"
//                 value={publicKey}
//                 onChange={(e) => setPublicKey(e.target.value)}
//                 className="mb-4 bg-black text-white"
//               />
//               <Button
//                 colorScheme="blue"
//                 onClick={() => handleLogin(publicKey)}
//                 className="w-full"
//               >
//                 Login with Public Key
//               </Button>
//             </>
//           )}
//         </ModalBody>
//         <ModalFooter>
//           <Button colorScheme="gray" onClick={onClose}>
//             Close
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CreateKeyModal;

// // import React from 'react';
// // import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, useToast } from '@chakra-ui/react';
// // import axios from 'axios';
// // const CreateKeyModal = ({ isOpen, onClose }) => {
// //   const [publicKey, setPublicKey] = React.useState('');
// //   const [privateKey, setPrivateKey] = React.useState('');
// //   const [isFunded, setIsFunded] = React.useState(false); // Track if the account is funded
// //   const toast = useToast();

// //   const generateKeys = async () => {
// //     try {
// //       const response = await axios.post('http://localhost:3001/create-keypair');
// //       const { publicKey, secret } = response.data;
// //       setPublicKey(publicKey);
// //       setPrivateKey(secret);

// //       // Save keys to local storage
// //       localStorage.setItem('publicKey', publicKey);
// //       localStorage.setItem('privateKey', secret);
// //     } catch (error) {
// //       console.error('Error generating keys:', error);
// //       toast({
// //         title: 'Error',
// //         description: 'Failed to generate keys.',
// //         status: 'error',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     }
// //   };

// //   const copyToClipboard = (text, keyType) => {
// //     navigator.clipboard.writeText(text).then(() => {
// //       toast({
// //         title: `${keyType} Key Copied`,
// //         description: `The ${keyType.toLowerCase()} key has been copied to your clipboard.`,
// //         status: 'success',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     }).catch((error) => {
// //       console.error('Error copying to clipboard:', error);
// //       toast({
// //         title: 'Copy Error',
// //         description: `Failed to copy the ${keyType.toLowerCase()} key.`,
// //         status: 'error',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     });
// //   };

// //   const handleFundClick = () => {
// //     toast({
// //       title: 'Account Funded',
// //       description: 'The account has been successfully funded.',
// //       status: 'success',
// //       duration: 2000,
// //       isClosable: true,
// //     });
// //     setIsFunded(true); // Hide the Fund button after clicking
// //   };

// //   return (
// //     <Modal isOpen={isOpen} onClose={onClose}>
// //       <ModalOverlay />
// //       <ModalContent>
// //         <ModalHeader>Create Key Pair</ModalHeader>
// //         <ModalCloseButton />
// //         <ModalBody>
// //           <Button colorScheme="blue" onClick={generateKeys} mb={4}>
// //             Generate Keys
// //           </Button>

// //           {publicKey && privateKey && (
// //             <div>
// //               <div
// //                 style={{
// //                   backgroundColor: '#000000', // Neon black background
// //                   color: '#00FF00', // Neon green text
// //                   padding: '10px',
// //                   borderRadius: '5px',
// //                   marginBottom: '10px',
// //                   cursor: 'pointer',
// //                   border: '1px solid #00FF00',
// //                   boxShadow: '0 0 10px #00FF00',
// //                 }}
// //                 onClick={() => copyToClipboard(publicKey, 'Public')}
// //               >
// //                 <strong>Public Key:</strong> {publicKey}
// //               </div>

// //               <div
// //                 style={{
// //                   backgroundColor: '#000000', // Neon black background
// //                   color: '#00FF00', // Neon green text
// //                   padding: '10px',
// //                   borderRadius: '5px',
// //                   marginBottom: '10px',
// //                   cursor: 'pointer',
// //                   border: '1px solid #00FF00',
// //                   boxShadow: '0 0 10px #00FF00',
// //                 }}
// //                 onClick={() => copyToClipboard(privateKey, 'Private')}
// //               >
// //                 <strong>Private Key:</strong> {privateKey}
// //               </div>

// //               {!isFunded && (
// //                 <Button colorScheme="green" onClick={handleFundClick} mt={4}>
// //                   Fund Account
// //                 </Button>
// //               )}
// //             </div>
// //           )}
// //         </ModalBody>
// //       </ModalContent>
// //     </Modal>
// //   );
// // };

// // export default CreateKeyModal;


// // import React from 'react';
// // import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, useToast } from '@chakra-ui/react';
// // import axios from 'axios';

// // const CreateKeyModal = ({ isOpen, onClose }) => {
// //   const [publicKey, setPublicKey] = React.useState('');
// //   const [privateKey, setPrivateKey] = React.useState('');
// //   const toast = useToast();

// //   const generateKeys = async () => {
// //     try {
// //       const response = await axios.post('http://localhost:3001/create-keypair');
// //       const { publicKey, secret } = response.data;
// //       setPublicKey(publicKey);
// //       setPrivateKey(secret);

// //       // Save keys to local storage
// //       localStorage.setItem('publicKey', publicKey);
// //       localStorage.setItem('privateKey', secret);
// //     } catch (error) {
// //       console.error('Error generating keys:', error);
// //       toast({
// //         title: 'Error',
// //         description: 'Failed to generate keys.',
// //         status: 'error',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     }
// //   };

// //   const copyToClipboard = (text, keyType) => {
// //     navigator.clipboard.writeText(text).then(() => {
// //       toast({
// //         title: `${keyType} Key Copied`,
// //         description: `The ${keyType.toLowerCase()} key has been copied to your clipboard.`,
// //         status: 'success',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     }).catch((error) => {
// //       console.error('Error copying to clipboard:', error);
// //       toast({
// //         title: 'Copy Error',
// //         description: `Failed to copy the ${keyType.toLowerCase()} key.`,
// //         status: 'error',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     });
// //   };

// //   const handleFundClick = async () => {
// //     try {
// //       // Assume you have a route to fund the account
// //       const response = await axios.post('http://localhost:3001/fund-account');
// //       toast({
// //         title: 'Account Funded',
// //         description: `Successfully funded the account.`,
// //         status: 'success',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     } catch (error) {
// //       console.error('Error funding account:', error);
// //       toast({
// //         title: 'Funding Error',
// //         description: 'Failed to fund the account.',
// //         status: 'error',
// //         duration: 2000,
// //         isClosable: true,
// //       });
// //     }
// //   };

// //   return (
// //     <Modal isOpen={isOpen} onClose={onClose}>
// //       <ModalOverlay />
// //       <ModalContent>
// //         <ModalHeader>Create Key Pair</ModalHeader>
// //         <ModalCloseButton />
// //         <ModalBody>
// //           <Button colorScheme="blue" onClick={generateKeys} mb={4}>
// //             Generate Keys
// //           </Button>

// //           {publicKey && privateKey && (
// //             <div>
// //               <div
// //                 style={{
// //                   backgroundColor: '#000000', // Neon black background
// //                   color: '#00FF00', // Neon green text
// //                   padding: '10px',
// //                   borderRadius: '5px',
// //                   marginBottom: '10px',
// //                   cursor: 'pointer',
// //                   border: '1px solid #00FF00',
// //                   boxShadow: '0 0 10px #00FF00',
// //                 }}
// //                 onClick={() => copyToClipboard(publicKey, 'Public')}
// //               >
// //                 <strong>Public Key:</strong> {`${publicKey.slice(0, 4)}...`}
// //               </div>

// //               <div
// //                 style={{
// //                   backgroundColor: '#000000', // Neon black background
// //                   color: '#00FF00', // Neon green text
// //                   padding: '10px',
// //                   borderRadius: '5px',
// //                   marginBottom: '10px',
// //                   cursor: 'pointer',
// //                   border: '1px solid #00FF00',
// //                   boxShadow: '0 0 10px #00FF00',
// //                 }}
// //                 onClick={() => copyToClipboard(privateKey, 'Private')}
// //               >
// //                 <strong>Private Key:</strong> {`${privateKey.slice(0, 4)}...`}
// //               </div>

// //               <Button colorScheme="green" onClick={handleFundClick} mt={4}>
// //                 Fund Account
// //               </Button>
// //             </div>
// //           )}
// //         </ModalBody>
// //       </ModalContent>
// //     </Modal>
// //   );
// // };

// // export default CreateKeyModal;
