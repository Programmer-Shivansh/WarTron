// src/App.jsx

import { Loader, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense, useState } from "react";
import { Experience } from "./components/Experience";
import { Leaderboard } from "./components/Leaderboard";
import Marketplace from "./components/Marketplace";
import Modal from "react-modal";
// import PublicKeyDisplay from './components/PublicKeyDisplay';

// Set the app element for the modal
Modal.setAppElement('#root');

function Game() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isJoyStickClicked , setJoyStickClicked] = useState(true);


  const onMouseUp = ()=>{
    setJoyStickClicked(false);
  }

  const onMouseDown = ()=>{
    setJoyStickClicked(true);
  }

  const openMarketplace = () => {
    setIsMarketplaceOpen(true);
  };

  const closeMarketplace = () => {
    setIsMarketplaceOpen(false);
  };


  return (
    <>
      <Loader />
      <Leaderboard />
      {/* <PublicKeyDisplay publicKey={publicKey} /> */}
      {
        isJoyStickClicked && 
        <button
        style={{

          position: 'fixed',
          bottom: '20px', // Position at the bottom with 20px offset
          left: '50%', // Center horizontally
          transform: 'translateX(-50%)', // Centering trick
          padding: '10px 20px',
          zIndex: 1000,
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={openMarketplace}

      >
        Open Marketplace
      </button>

      }
      

      <Modal
      
        isOpen={isMarketplaceOpen}
        onRequestClose={closeMarketplace}
        contentLabel="Marketplace Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
          },

          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',

            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',

          },
        }}
      >
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '10px',

            zIndex: 1000,
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={closeMarketplace}

        >
          Close Marketplace
        </button>
        <Marketplace />
      </Modal>

      <Canvas
        shadows
        camera={{ position: [0, 30, 0], fov: 30, near: 2 }}
        dpr={[1, 1.5]} // optimization to increase performance on retina/4k devices
      >
        <color attach="background" args={["#242424"]} />
        <SoftShadows size={42} />

        <PerformanceMonitor
          // Detect low performance devices
          onDecline={(fps) => {
            setDowngradedPerformance(true);
          }}
        />
        <Suspense>
          <Physics>
            <Experience downgradedPerformance={downgradedPerformance} onMouseUp = {onMouseUp} onMouseDown = {onMouseDown} />
          </Physics>
        </Suspense>
        {!downgradedPerformance && (
          // disable the postprocessing on low-end devices
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
          </EffectComposer>
        )}

      </Canvas>
    </>
  );
}

export default Game;
