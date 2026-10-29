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

  // Pointer Parallax coordinates (-1 to 1)
  const pointerX = useRef(0);
  const pointerY = useRef(0);
  const targetPointerX = useRef(0);
  const targetPointerY = useRef(0);

  // Sync external cameraTargetX updates (e.g. from sidebar clicks or search)
  useEffect(() => {
    targetX.current = cameraTargetX;
  }, [cameraTargetX]);

  // Handle Wheel, Keyboard, Pointer Parallax, and Touch/Pointer Panning
  useEffect(() => {
    // 1. Mouse Wheel & Trackpad Horizontal Navigation
    const handleWheel = (e: WheelEvent) => {
      if (activeModule !== 'overview') return;
      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const step = rawDelta * 0.012;
      const newTarget = Math.max(-19, Math.min(19, targetX.current + step));
      targetX.current = newTarget;
      setCameraTargetX(newTarget);
      setScrollProgress((newTarget + 18) / 36);
    };

    // 2. Keyboard Navigation: Arrow Keys to Pan, Enter/Space to Open
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModule !== 'overview') return;

      if (e.key === 'ArrowRight') {
        const nextTarget = Math.min(18, targetX.current + 4);
        targetX.current = nextTarget;
        setCameraTargetX(nextTarget);
        setScrollProgress((nextTarget + 18) / 36);
      } else if (e.key === 'ArrowLeft') {
        const prevTarget = Math.max(-18, targetX.current - 4);
        targetX.current = prevTarget;
        setCameraTargetX(prevTarget);
        setScrollProgress((prevTarget + 18) / 36);
      } else if (e.key === 'Enter' || e.key === ' ') {
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
        targetX.current = -18;
        setCameraTargetX(-18);
        setScrollProgress(0);
      } else if (e.key === 'End') {
        targetX.current = 18;
        setCameraTargetX(18);
        setScrollProgress(1);
      }
    };

    // 3. Pointer Move for Subtle Spatial Parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (isReducedMotion) return;
      targetPointerX.current = (e.clientX / window.innerWidth) * 2 - 1;
      targetPointerY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // 4. Pointer Drag Panning across the 3D Canvas
    const dom = gl.domElement;
    const handlePointerDown = (e: PointerEvent) => {
      if (activeModule !== 'overview') return;
      isDragging.current = true;
      startPointerX.current = e.clientX;
      startTargetX.current = targetX.current;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current || activeModule !== 'overview') return;
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
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, activeModule, setCameraTargetX, setScrollProgress, openWorkspace, isReducedMotion]);

  // Smooth, damped camera frame updates with subtle pointer parallax
  useFrame(() => {
    const lerpFactor = isReducedMotion ? 1 : 0.075;
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, lerpFactor);

    // Damped parallax interpolation
    if (!isReducedMotion) {
      pointerX.current = THREE.MathUtils.lerp(pointerX.current, targetPointerX.current, 0.05);
      pointerY.current = THREE.MathUtils.lerp(pointerY.current, targetPointerY.current, 0.05);
    }

    const parallaxOffsetX = isReducedMotion ? 0 : pointerX.current * 0.35;
    const parallaxOffsetY = isReducedMotion ? 0 : pointerY.current * 0.18;

    camera.position.x = currentX.current + parallaxOffsetX;
    camera.position.y = 0.35 + parallaxOffsetY;
    camera.position.z = 8.2;

    // Direct lookahead target aligned with architectural slabs
    camera.lookAt(currentX.current, 0.1, 0);
  });

  return null;
};
