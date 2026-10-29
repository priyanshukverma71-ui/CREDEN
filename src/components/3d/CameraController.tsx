import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortal, MODULE_COORDINATES } from '../../context/PortalContext';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const {
    cameraTargetX,
    setCameraTargetX,
    isWorkspaceOpen,
    setScrollProgress,
    setActiveModule,
  } = usePortal();

  const currentX = useRef(0);
  const targetX = useRef(cameraTargetX);

  useEffect(() => {
    targetX.current = cameraTargetX;
  }, [cameraTargetX]);

  // Map vertical wheel scroll to horizontal camera flight along X
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If modal workspace is open, let user scroll inside workspace
      if (isWorkspaceOpen) return;

      e.preventDefault();
      const delta = (e.deltaY || e.deltaX) * 0.015;
      const newTarget = Math.max(-20, Math.min(20, targetX.current + delta));
      targetX.current = newTarget;
      setCameraTargetX(newTarget);

      // Normalize progress (range -20 to +20 mapped to 0..1)
      const progress = (newTarget + 20) / 40;
      setScrollProgress(progress);

      // Find nearest module
      let closestModule: string = 'overview';
      let minDistance = 999;
      for (const [mod, coord] of Object.entries(MODULE_COORDINATES)) {
        const dist = Math.abs(coord - newTarget);
        if (dist < minDistance) {
          minDistance = dist;
          closestModule = mod;
        }
      }
      if (minDistance < 2.0) {
        setActiveModule(closestModule as any);
      }
    };

    // Keyboard Arrow navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isWorkspaceOpen) return;
      if (e.key === 'ArrowRight') {
        const newTarget = Math.min(20, targetX.current + 4);
        targetX.current = newTarget;
        setCameraTargetX(newTarget);
      } else if (e.key === 'ArrowLeft') {
        const newTarget = Math.max(-20, targetX.current - 4);
        targetX.current = newTarget;
        setCameraTargetX(newTarget);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWorkspaceOpen, setCameraTargetX, setScrollProgress, setActiveModule]);

  // Smooth camera frame updates
  useFrame(() => {
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, 0.08);

    camera.position.x = currentX.current;
    camera.position.y = isWorkspaceOpen ? 1.5 : 0.8;
    camera.position.z = isWorkspaceOpen ? 7.5 : 8.5;

    // Slight lookahead tilt based on horizontal motion
    const lookAtX = currentX.current;
    camera.lookAt(lookAtX, 0, 0);
  });

  return null;
};
