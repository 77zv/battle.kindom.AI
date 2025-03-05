"use client";

import { useEffect, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Sky, OrbitControls } from '@react-three/drei';
import { useGameStore } from '@/lib/game/state/gameStore';
import GameMap from './GameMap';
import GameUI from './GameUI';
import StartScreen from './StartScreen';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// Camera controller with orbit controls
function CameraController() {
  const { camera, gl } = useThree();
  const cameraPosition = useGameStore(state => state.cameraPosition);
  const updateCamera = useGameStore(state => state.updateCamera);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  // Set initial camera position
  useEffect(() => {
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    
    // Set initial target to be in front of the camera
    if (controlsRef.current) {
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const target = new THREE.Vector3(
        cameraPosition.x + direction.x * 10,
        cameraPosition.y + direction.y * 10,
        cameraPosition.z + direction.z * 10
      );
      controlsRef.current.target.copy(target);
    }
  }, []);
  
  // Update camera position when state changes from keyboard movement
  useEffect(() => {
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    
    if (controlsRef.current) {
      // Update the target to be in front of the camera
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const target = new THREE.Vector3(
        cameraPosition.x + direction.x * 10,
        cameraPosition.y + direction.y * 10,
        cameraPosition.z + direction.z * 10
      );
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    }
  }, [cameraPosition, camera]);
  
  // Sync the camera position from OrbitControls back to our state
  useEffect(() => {
    if (!controlsRef.current) return;
    
    const controls = controlsRef.current;
    
    // Create a callback for when orbit controls changes the camera
    const handleControlChange = () => {
      // Only update our state if the position has changed significantly
      // to avoid feedback loops
      const currentPos = {
        x: Math.round(camera.position.x * 10) / 10,
        y: Math.round(camera.position.y * 10) / 10,
        z: Math.round(camera.position.z * 10) / 10
      };
      
      const storePos = {
        x: Math.round(cameraPosition.x * 10) / 10,
        y: Math.round(cameraPosition.y * 10) / 10,
        z: Math.round(cameraPosition.z * 10) / 10
      };
      
      if (
        currentPos.x !== storePos.x ||
        currentPos.y !== storePos.y ||
        currentPos.z !== storePos.z
      ) {
        updateCamera({
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        });
      }
    };
    
    // Add the change event listener
    controls.addEventListener('change', handleControlChange);
    
    return () => {
      controls.removeEventListener('change', handleControlChange);
    };
  }, [camera, cameraPosition, updateCamera]);
  
  // Handle keyboard navigation (WASD + Space/Shift for up/down)
  useEffect(() => {
    const moveSpeed = 2; // Increased movement speed
    const keysPressed = new Set<string>();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key.toLowerCase());
      
      // Prevent default behavior for navigation keys
      if (['w', 'a', 's', 'd', ' ', 'shift', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
    };
    
    // Continuous movement update
    const updateMovement = () => {
      if (keysPressed.size === 0) {
        requestAnimationFrame(updateMovement);
        return;
      }
      
      // Calculate movement direction based on camera orientation
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      
      // Initialize movement vector
      const movement = new THREE.Vector3(0, 0, 0);
      
      // Apply movement based on keys pressed
      if (keysPressed.has('w') || keysPressed.has('arrowup')) {
        // Forward movement - remove y component for level movement
        const forwardLevel = new THREE.Vector3(forward.x, 0, forward.z).normalize();
        movement.add(forwardLevel.multiplyScalar(moveSpeed));
      }
      
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) {
        // Backward movement
        const backwardLevel = new THREE.Vector3(-forward.x, 0, -forward.z).normalize();
        movement.add(backwardLevel.multiplyScalar(moveSpeed));
      }
      
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
        // Left movement
        const leftLevel = new THREE.Vector3(-right.x, 0, -right.z).normalize();
        movement.add(leftLevel.multiplyScalar(moveSpeed));
      }
      
      if (keysPressed.has('d') || keysPressed.has('arrowright')) {
        // Right movement
        const rightLevel = new THREE.Vector3(right.x, 0, right.z).normalize();
        movement.add(rightLevel.multiplyScalar(moveSpeed));
      }
      
      // Vertical movement
      if (keysPressed.has(' ')) {
        // Space for up
        movement.y += moveSpeed;
      }
      
      if (keysPressed.has('shift')) {
        // Shift for down
        movement.y -= moveSpeed;
      }
      
      // Apply movement if any keys are pressed
      if (movement.length() > 0) {
        updateCamera({
          x: cameraPosition.x + movement.x,
          y: Math.max(2, cameraPosition.y + movement.y), // Prevent going below ground
          z: cameraPosition.z + movement.z
        });
      }
      
      requestAnimationFrame(updateMovement);
    };
    
    // Start the movement loop
    const animationId = requestAnimationFrame(updateMovement);
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [camera, cameraPosition, updateCamera]);
  
  // Handle mouse wheel zoom directly
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (controlsRef.current) {
        // The OrbitControls will handle the zoom
        e.stopPropagation();
      }
    };
    
    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel);
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [gl]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.1}
      rotateSpeed={0.5}
      zoomSpeed={1.0}
      panSpeed={0.8}
      minDistance={5}
      maxDistance={200}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below the ground
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }}
    />
  );
}

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const initializeGame = useGameStore(state => state.initializeGame);
  const updateCamera = useGameStore(state => state.updateCamera);
  
  const handleStartGame = (playerName: string, companyName: string) => {
    initializeGame(playerName, companyName);
    
    // Ensure camera is properly positioned at game start
    updateCamera({ x: 25, y: 15, z: 35 });
    
    setGameStarted(true);
  };
  
  // Prevent context menu on right-click for the entire game
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  return (
    <div className="w-full h-screen">
      {!gameStarted ? (
        <StartScreen onStartGame={handleStartGame} />
      ) : (
        <>
          <Canvas shadows>
            <CameraController />
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[50, 50, 25]} 
              intensity={1} 
              castShadow 
              shadow-mapSize-width={2048} 
              shadow-mapSize-height={2048}
            />
            <Sky sunPosition={[100, 20, 100]} />
            <GameMap />
          </Canvas>
          <GameUI />
        </>
      )}
    </div>
  );
} 