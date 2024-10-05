import React, { useState } from 'react';
import Vortex from './vortex';
import { Button, useDisclosure, useToast } from '@chakra-ui/react';
import CreateKeyModal from './CreateKeyModal';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userDataAtom } from '../atoms/public';

export function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [SecretKey, setSecretKey] = useState('');
  const [publics,setpublics]= useRecoilState(userDataAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalType, setModalType] = useState(''); // State to differentiate modal types
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = (key) => {
    if (key) {
      // console.log(key)
      localStorage.setItem('SecretKey', key);
      setpublics(key); // Update the public key in the user data state
      setSecretKey(key);
      setIsLoggedIn(true);
      toast({
        title: 'Logged In',
        description: `You are now logged in with the Secret key: ${key}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate('/'); // Redirect to the specific route
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a Secret key.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
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
          Daichain Warfare
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Play, Earn, Repeat: Earn rewards in Real Time!
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
            onClick={openLoginModal}
          >
            Login
          </Button>
          <Button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
            onClick={openCreateModal}
          >
            Create
          </Button>
        </div>
        <div className="fixed top-4 right-4 bg-black text-green-500 p-2 rounded-md">
          {isLoggedIn ? `Secret Key: ${SecretKey.slice(0, 4)}...` : 'Not Logged In'}
        </div>
      </Vortex>
      <CreateKeyModal 
        isOpen={isOpen} 
        onClose={onClose} 
        handleLogin={handleLogin}
        modalType={modalType} // Pass the modalType to the CreateKeyModal
      />
    </div>
  );
}

// import React, { useState } from 'react';
// import Vortex from './vortex';
// import { Button, useDisclosure, useToast } from '@chakra-ui/react';
// import CreateKeyModal from './CreateKeyModal';
// import { useNavigate } from 'react-router-dom';

// export function Login() {
//   const [SecretKey, setSecretKey] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [modalType, setModalType] = useState(''); // Add state to handle modal type
//   const toast = useToast();
//   const navigate = useNavigate();

//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const handleLogin = (key) => {
//     if (key) {
//       localStorage.setItem('SecretKey', key);
//       setSecretKey(key);
//       setIsLoggedIn(true);
//       toast({
//         title: 'Logged In',
//         description: `You are now logged in with the public key: ${key}`,
//         status: 'success',
//         duration: 2000,
//         isClosable: true,
//       });
//       navigate('/'); // Redirect to the specific route
//     } else {
//       toast({
//         title: 'Error',
//         description: 'Please enter a public key.',
//         status: 'error',
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//   };

//   const openLoginModal = () => {
//     setModalType('login');
//     onOpen();
//   };

//   const openCreateModal = () => {
//     setModalType('create');
//     onOpen();
//   };

//   return (
//     <div className="mx-auto h-screen overflow-hidden">
//       <Vortex
//         backgroundColor="black"
//         rangeY={800}
//         particleCount={500}
//         baseHue={120}
//         className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
//       >
//         <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
//           Daichain Warfare
//         </h2>
//         <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
//           Play, Earn, Repeat: Earn rewards in Real Time!
//         </p>
//         <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
//           <Button 
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
//             onClick={openLoginModal}
//           >
//             Login
//           </Button>
//           <Button
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
//             onClick={openCreateModal}
//           >
//             Create
//           </Button>
//         </div>
//         <div className="fixed top-4 right-4 bg-black text-green-500 p-2 rounded-md">
//           {isLoggedIn ? `Public Key: ${SecretKey.slice(0, 4)}...` : 'Not Logged In'}
//         </div>
//       </Vortex>
//       <CreateKeyModal 
//         isOpen={isOpen} 
//         onClose={onClose} 
//         handleLogin={handleLogin}
//         modalType={modalType} // Pass the modalType to the CreateKeyModal
//       />
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import Vortex from './vortex';
// import { Button, Input, useDisclosure, useToast } from '@chakra-ui/react';
// import CreateKeyModal from './CreateKeyModal';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// export function Login() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [SecretKey, setSecretKey] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const toast = useToast();
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (SecretKey) {
//       localStorage.setItem('SecretKey', SecretKey);
//       setIsLoggedIn(true);
//       toast({
//         title: 'Logged In',
//         description: `You are now logged in with the public key: ${SecretKey}`,
//         status: 'success',
//         duration: 2000,
//         isClosable: true,
//       });
//       navigate('/'); // Redirect to the specific route
//     } else {
//       toast({
//         title: 'Error',
//         description: 'Please enter a public key.',
//         status: 'error',
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <div className="mx-auto h-screen overflow-hidden">
//       <Vortex
//         backgroundColor="black"
//         rangeY={800}
//         particleCount={500}
//         baseHue={120}
//         className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
//       >
//         <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
//           Daichain Warfare
//         </h2>
//         <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
//           Play, Earn, Repeat: Earn rewards in Real Time!
//         </p>
//         <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
//         <Button
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
//             onClick={onOpen}
//           >
//             Login
//           </Button>
//           <Button
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
//             onClick={onOpen}
//           >
//             Create
//           </Button>
//         </div>
//         <div className="fixed top-4 right-4 bg-black text-green-500 p-2 rounded-md">
//           {isLoggedIn ? `Public Key: ${SecretKey.slice(0, 4)}...` : 'Not Logged In'}
//         </div>
//       </Vortex>
//       <CreateKeyModal isOpen={isOpen} onClose={onClose} />
//       {/* <div className="fixed top-1/2 right-4 transform -translate-y-1/2">
//         <Input
//           placeholder="Enter Public Key"
//           value={SecretKey}
//           onChange={(e) => setSecretKey(e.target.value)}
//           className="mb-4"
//         />
//         <Button colorScheme="blue" >
//           Login
//         </Button>
//       </div> */}
//     </div>
//   );
// }
