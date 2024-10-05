// App.js
import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Game from "./game";
import { Login } from "./components/login";
import { useRecoilValue } from 'recoil';
import { userDataAtom } from './atoms/public';


function App() {
  const SecretKey = useRecoilValue(userDataAtom);
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/login" element={SecretKey?<Navigate to={'/'}/>:<Login/>} />
        <Route path="/" element={!SecretKey?<Navigate to={'/login'}/>:<Game/>} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;

// import Modal from "react-modal";
// import * as React from 'react';
// import { Routes, Route} from 'react-router-dom';
// import Game from "./game";
// import {Login} from "./components/login";

// // Set the app element for the modal
// Modal.setAppElement('#root');


// function App() {
//   return (
//       <Routes>
//         <Route path="/" element={<Game />} />
//         <Route path="/login" element={<Login />} />
//       </Routes>
//   )
 
// }

// export default App;
