import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortal, MODULE_COORDINATES } from '../../context/PortalContext';
import { ModuleId } from '../../types';

interface CameraControllerProps {
  onSelectClosest?: () => void;
}

export const CameraController: React.FC<CameraControllerProps> = () => {
  const { camera, gl } = useThree();
  const {
    activeModule,
    openWorkspace,
    cameraTargetX,
    setCameraTargetX,
    setScrollProgress,
    isReducedMotion,
  } = usePortal();

  const currentX = useRef(cameraTargetX || 0);
  const targetX = useRef(cameraTargetX || 0);
  const isDragging = useRef(false);
  const startPointerX = useRef(0);
  const startTargetX = useRef(0);

  // Sync external cameraTargetX updates (e.g. from sidebar clicks or search)
  useEffect(() => {
    targetX.current = cameraTargetX;
  }, [cameraTargetX]);

  // Handle Wheel, Keyboard, and Touch/Pointer Panning
  useEffect(() => {
    // Only capture 3D navigation when user is in the 3D overview scene
    if (activeModule !== 'overview') return;

    // 1. Mouse Wheel & Trackpad Horizontal Navigation
    const handleWheel = (e: WheelEvent) => {
      // Use whichever delta has greater magnitude (supports both horizontal trackpads & vertical mouse wheels)
      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const step = rawDelta * 0.012;
      const newTarget = Math.max(-21, Math.min(21, targetX.current + step));
      targetX.current = newTarget;
      setCameraTargetX(newTarget);
      setScrollProgress((newTarget + 21) / 42);
    };

    // 2. Keyboard Navigation: Arrow Keys to Pan, Enter/Space to Open
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModule !== 'overview') return;

      if (e.key === 'ArrowRight') {
        const nextTarget = Math.min(20, targetX.current + 4);
        targetX.current = nextTarget;
        setCameraTargetX(nextTarget);
        setScrollProgress((nextTarget + 21) / 42);
      } else if (e.key === 'ArrowLeft') {
        const prevTarget = Math.max(-20, targetX.current - 4);
        targetX.current = prevTarget;
        setCameraTargetX(prevTarget);
        setScrollProgress((prevTarget + 21) / 42);
      } else if (e.key === 'Enter' || e.key === ' ') {
        // Open the module closest to the camera center
        const entries = Object.entries(MODULE_COORDINATES) as [ModuleId, number][];
        let closestMod: ModuleId = 'institutions';
        let minDistance = Infinity;

        entries.forEach(([modId, coordX]) => {
          if (modId === 'overview' || modId === 'settings') return;
          const dist = Math.abs(coordX - targetX.current);
          if (dist < minDistance) {
            minDistance = dist;
            closestMod = modId;
          }
        });

        if (minDistance < 3.0) {
          e.preventDefault();
          openWorkspace(closestMod);
        }
      } else if (e.key === 'Home') {
        targetX.current = -20;
        setCameraTargetX(-20);
        setScrollProgress(0.02);
      } else if (e.key === 'End') {
        targetX.current = 20;
        setCameraTargetX(20);
        setScrollProgress(0.98);
      }
    };

    // 3. Pointer Drag Panning across the 3D Canvas
    const dom = gl.domElement;
    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      startPointerX.current = e.clientX;
      startTargetX.current = targetX.current;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const delta = (e.clientX - startPointerX.current) * 0.016;
      const newTarget = Math.max(-21, Math.min(21, startTargetX.current - delta));
      targetX.current = newTarget;
      setCameraTargetX(newTarget);
      setScrollProgress((newTarget + 21) / 42);
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
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
  }, [gl, activeModule, setCameraTargetX, setScrollProgress, openWorkspace]);

  // Smooth, damped camera frame updates
  useFrame(() => {
    // In reduced motion, snap immediately without interpolation
    const lerpFactor = isReducedMotion ? 1 : 0.075;
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, lerpFactor);

    camera.position.x = currentX.current;
    camera.position.y = 0.35;
    camera.position.z = 8.2;

    // Direct lookahead target aligned with architectural slabs
    camera.lookAt(currentX.current, 0.1, 0);
  });

  return null;
};
