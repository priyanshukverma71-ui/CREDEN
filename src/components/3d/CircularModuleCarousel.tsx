import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortal, CAROUSEL_MODULES_LIST } from '../../context/PortalContext';
import { Distinct3DSymbol, MODULE_PALETTE } from './FloatingModulePod';
import { ModuleId } from '../../types';

const TOTAL_MODULES = CAROUSEL_MODULES_LIST.length;
const ANGLE_STEP = (2 * Math.PI) / TOTAL_MODULES;

interface CarouselSlotProps {
  id: ModuleId;
  index: number;
  carouselAngleRef: React.MutableRefObject<number>;
  onSelect: (id: ModuleId, index: number) => void;
  isReducedMotion: boolean;
}

const CarouselSlot: React.FC<CarouselSlotProps> = ({
  id,
  index,
  carouselAngleRef,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const meta = MODULE_PALETTE[id] || MODULE_PALETTE.institutions;

  // Slot base angle
  const baseAngle = index * ANGLE_STEP;

  useFrame((state) => {
    if (!groupRef.current) return;
    const currentAngle = carouselAngleRef.current;

    // Calculate relative angle normalized to [-PI, PI]
    const rawAngle = baseAngle + currentAngle;
    let diff = ((rawAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;

    const absDiff = Math.abs(diff);
    const isFrontActive = absDiff < 0.22;
    const isFacingFront = absDiff < (Math.PI / 2) + 0.35;

    const time = state.clock.getElapsedTime();
    const sign = Math.sign(diff);

    // Keep the centre clear for the active module:
    // When u = 0 (active module): x = 0, z = 0.95, scale = 1.34
    // When u = 1 (immediate neighbor): x = ± 4.8, z = -1.2, scale = 0.72
    // For u > 1 (distant modules): spread further into wings and receding back
    const u = absDiff / ANGLE_STEP;

    let x = 0;
    let z = 0;
    let scale = 1.0;

    if (u <= 1) {
      const ease = Math.sin((u * Math.PI) / 2);
      x = sign * ease * 4.8;
      z = 0.95 - ease * 2.15;
      scale = 1.34 - ease * 0.62;
    } else {
      const extra = u - 1;
      x = sign * (4.8 + extra * 1.5);
      z = -1.2 - extra * 0.85;
      scale = Math.max(0.48, 0.72 - extra * 0.06);
    }

    const wave = Math.sin(time * 2.0 + index * 0.65) * 0.04;
    const y = (isFrontActive ? 0.68 : 0.58) + wave + (hovered ? 0.08 : 0);

    const hoverScale = hovered ? 1.08 : 1.0;
    const s = scale * hoverScale;

    groupRef.current.position.set(x, y, z);
    groupRef.current.scale.set(s, s, s);

    // Gentle inward facing rotation toward viewer
    const rotY = -diff * 0.24 + Math.sin(time * 1.2 + index) * 0.025;
    const rotX = Math.sin(time * 1.5 + index) * 0.02;
    groupRef.current.rotation.set(rotX, rotY, 0);

    if (shadowRef.current) {
      shadowRef.current.visible = isFacingFront;
      shadowRef.current.position.y = -2.84 - y;
    }

    if (haloRef.current) {
      haloRef.current.visible = isFrontActive;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id, index);
      }}
    >
      {/* 1. Faint Lavender and Mint Halos around Active Module (Airy & Translucent) */}
      <group ref={haloRef} position={[0, 0, -0.18]}>
        {/* Subtle Radiant Soft Point Light */}
        <pointLight
          position={[0, 0, 0.5]}
          intensity={0.9}
          distance={3.5}
          decay={2}
          color="#E0E7FF"
        />

        {/* Faint Lavender Halo Ring */}
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.9, 1.5, 64]} />
          <meshBasicMaterial
            color="#DDD6FE"
            transparent
            opacity={hovered ? 0.16 : 0.11}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Faint Inner Lavender Halo Ring */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.62, 1.08, 64]} />
          <meshBasicMaterial
            color="#E0E7FF"
            transparent
            opacity={hovered ? 0.14 : 0.09}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Faint Mint Inner Halo Aura */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.78, 64]} />
          <meshBasicMaterial
            color="#D1FAE5"
            transparent
            opacity={hovered ? 0.13 : 0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 2. Soft Ambient Contact Shadows Beneath Floating Icons */}
      <group ref={shadowRef} position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Diffuse Outer Ambient Drop Shadow */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0, 1.45, 36]} />
          <meshBasicMaterial
            color="#334155"
            transparent
            opacity={0.075}
          />
        </mesh>

        {/* Soft Core Occlusion Shadow */}
        <mesh position={[0, 0, 0.005]}>
          <circleGeometry args={[0.68, 32]} />
          <meshBasicMaterial
            color="#1E293B"
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>

      {/* 3. Freely Floating Colourful 3D Symbol */}
      <Distinct3DSymbol id={id} hovered={hovered} isolated={true} />
    </group>
  );
};

export const CircularModuleCarousel: React.FC = () => {
  const { gl } = useThree();
  const {
    activeModule,
    openWorkspace,
    carouselIndex,
    setCarouselIndex,
    isReducedMotion,
  } = usePortal();

  // Carousel continuous angle and target angle refs (Zero React re-renders during flight)
  const angleRef = useRef(-carouselIndex * ANGLE_STEP);
  const targetAngleRef = useRef(-carouselIndex * ANGLE_STEP);

  // Sync carouselIndex state to targetAngle
  useEffect(() => {
    targetAngleRef.current = -carouselIndex * ANGLE_STEP;
  }, [carouselIndex]);

  // Smooth angle lerping frame-by-frame directly mutating ref
  useFrame(() => {
    const lerpFactor = isReducedMotion ? 1 : 0.085;
    angleRef.current = THREE.MathUtils.lerp(
      angleRef.current,
      targetAngleRef.current,
      lerpFactor
    );
  });

  // Pointer drag gesture on canvas for smooth rotation & snapping
  useEffect(() => {
    const dom = gl.domElement;
    let isDragging = false;
    let startX = 0;
    let startAngle = 0;
    let lastWheelTime = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (activeModule !== 'overview') return;
      isDragging = true;
      startX = e.clientX;
      startAngle = targetAngleRef.current;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || activeModule !== 'overview') return;
      const dx = e.clientX - startX;
      // Map horizontal pixel drag to carousel angular displacement
      const angleDelta = (dx / 320) * ANGLE_STEP;
      targetAngleRef.current = startAngle + angleDelta;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      const dx = e.clientX - startX;

      // If dragged significantly, snap to nearest slot
      if (Math.abs(dx) > 15) {
        const normalizedSlot = -targetAngleRef.current / ANGLE_STEP;
        const nearestIndex = Math.round(normalizedSlot);
        setCarouselIndex(nearestIndex);
      } else {
        // Return exactly to current target slot
        targetAngleRef.current = -carouselIndex * ANGLE_STEP;
      }
    };

    // Trackpad / Wheel debounced rotation
    const handleWheel = (e: WheelEvent) => {
      if (activeModule !== 'overview') return;
      const now = Date.now();
      if (now - lastWheelTime < 190) return;

      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(rawDelta) > 12) {
        lastWheelTime = now;
        const dir = rawDelta > 0 ? 1 : -1;
        setCarouselIndex(carouselIndex + dir);
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModule !== 'overview') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCarouselIndex(carouselIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCarouselIndex(carouselIndex - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const activeMod = CAROUSEL_MODULES_LIST[carouselIndex];
        if (activeMod) {
          openWorkspace(activeMod.id);
        }
      } else if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10) - 1;
        if (num < TOTAL_MODULES) {
          setCarouselIndex(num);
        }
      } else if (e.key === '0') {
        setCarouselIndex(9);
      }
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gl, activeModule, carouselIndex, setCarouselIndex, openWorkspace]);

  // Click on a slot: if front-active, open workspace; otherwise smoothly rotate to it
  const handleSlotSelect = (id: ModuleId, slotIndex: number) => {
    if (slotIndex === carouselIndex) {
      openWorkspace(id);
    } else {
      setCarouselIndex(slotIndex);
    }
  };

  return (
    <group position={[0, 0, 0]}>
      {CAROUSEL_MODULES_LIST.map((mod, idx) => (
        <CarouselSlot
          key={mod.id}
          id={mod.id}
          index={idx}
          carouselAngleRef={angleRef}
          onSelect={handleSlotSelect}
          isReducedMotion={isReducedMotion}
        />
      ))}
    </group>
  );
};
