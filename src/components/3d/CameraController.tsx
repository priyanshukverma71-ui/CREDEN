import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortal, MODULE_COORDINATES } from '../../context/PortalContext';

export const CameraController: React.FC = () => {
  const { camera, gl } = useThree();
  const {
    cameraTargetX,
    setCameraTargetX,
    setScrollProgress,
    setActiveModule,
  } = usePortal();

  const currentX = useRef(cameraTargetX || 0);
  const targetX = useRef(cameraTargetX || 0);
  const isDragging = useRef(false);
  const startMouseX = useRef(0);
  const startTargetX = useRef(0);

  useEffect(() => {
    targetX.current = cameraTargetX;
  }, [cameraTargetX]);

  // Map mouse wheel scroll to horizontal camera flight along X
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = (e.deltaY || e.deltaX) * 0.015;
      const newTarget = Math.max(-20, Math.min(20, targetX.current + delta));
      targetX.current = newTarget;
      setCameraTargetX(newTarget);

      // Normalize progress (range -20 to +20 mapped to 0..1)
      const progress = (newTarget + 20) / 40;
      setScrollProgress(progress);
    };

    // Keyboard Arrow navigation
    const handleKeyDown = (e: KeyboardEvent) => {
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

    // Drag to pan horizontally on canvas
    const dom = gl.domElement;
    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      startMouseX.current = e.clientX;
      startTargetX.current = targetX.current;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const delta = (e.clientX - startMouseX.current) * 0.018;
      const newTarget = Math.max(-20, Math.min(20, startTargetX.current - delta));
      targetX.current = newTarget;
      setCameraTargetX(newTarget);
      setScrollProgress((newTarget + 20) / 40);
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, setCameraTargetX, setScrollProgress]);

  // Smooth camera frame updates
  useFrame(() => {
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, 0.08);

    camera.position.x = currentX.current;
    camera.position.y = 0.55;
    camera.position.z = 8.6;

    // Slight lookahead tilt centered on floating pods
    camera.lookAt(currentX.current, 0.2, 0);
  });

  return null;
};
