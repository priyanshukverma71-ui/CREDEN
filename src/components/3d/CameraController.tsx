import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortal } from '../../context/PortalContext';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { activeModule, isReducedMotion } = usePortal();

  // Subtle pointer parallax coordinates (-1 to 1)
  const pointerX = useRef(0);
  const pointerY = useRef(0);
  const targetPointerX = useRef(0);
  const targetPointerY = useRef(0);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (activeModule !== 'overview') return;
      // Convert to normalized coordinates [-1, 1]
      targetPointerX.current = (e.clientX / window.innerWidth) * 2 - 1;
      targetPointerY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [activeModule]);

  // Smooth camera frame updates centered on the circular 3D carousel
  useFrame(() => {
    const lerpFactor = isReducedMotion ? 1 : 0.05;

    // Smooth damp pointer parallax
    pointerX.current = THREE.MathUtils.lerp(
      pointerX.current,
      targetPointerX.current,
      lerpFactor
    );
    pointerY.current = THREE.MathUtils.lerp(
      pointerY.current,
      targetPointerY.current,
      lerpFactor
    );

    // Camera sits comfortably in front of circular launcher
    const parallaxX = isReducedMotion ? 0 : pointerX.current * 0.35;
    const parallaxY = isReducedMotion ? 0 : pointerY.current * 0.18;

    camera.position.x = parallaxX;
    camera.position.y = 0.42 + parallaxY;
    camera.position.z = 7.6;

    // Camera gently looks at the front active floating icon
    camera.lookAt(parallaxX * 0.25, 0.38, 0);
  });

  return null;
};
