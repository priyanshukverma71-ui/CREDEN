import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortal, CAROUSEL_MODULES_LIST } from '../../context/PortalContext';
import { Distinct3DSymbol, MODULE_PALETTE } from './FloatingModulePod';
import { ModuleId } from '../../types';

const RADIUS = 5.2;
const TOTAL_MODULES = CAROUSEL_MODULES_LIST.length;
const ANGLE_STEP = (2 * Math.PI) / TOTAL_MODULES;

interface CarouselSlotProps {
  id: ModuleId;
  index: number;
  currentAngle: number;
  onSelect: (id: ModuleId, index: number) => void;
  isReducedMotion: boolean;
}

const CarouselSlot: React.FC<CarouselSlotProps> = ({
  id,
  index,
  currentAngle,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const meta = MODULE_PALETTE[id] || MODULE_PALETTE.institutions;

  // Slot base angle
  const baseAngle = index * ANGLE_STEP;

  // Calculate relative angle normalized to [-PI, PI]
  const rawAngle = baseAngle + currentAngle;
  let diff = ((rawAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;

  const isFrontActive = Math.abs(diff) < 0.28;
  const isFacingFront = Math.abs(diff) < (Math.PI / 2) + 0.35;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Cylindrical arc coordinates
    const x = RADIUS * Math.sin(diff);
    let z = RADIUS * (Math.cos(diff) - 1);

    // Active front icon gracefully steps forward
    if (Math.abs(diff) < 0.35) {
      const forwardBonus = (1 - Math.abs(diff) / 0.35) * 0.72;
      z += forwardBonus;
    }

    // Organic levitation breathing wave
    const wave = Math.sin(time * 2.0 + index * 0.65) * 0.045;
    const y = 0.50 + wave + (hovered ? 0.08 : 0);

    // Dynamic scale based on proximity to center
    const proximity = Math.max(0, 1 - Math.abs(diff) / (Math.PI / 2));
    const baseScale = 0.82 + proximity * 0.62;
    const hoverScale = hovered ? 1.08 : 1.0;
    const s = baseScale * hoverScale;

    groupRef.current.position.set(x, y, z);
    groupRef.current.scale.set(s, s, s);

    // Soft inward facing rotation toward viewer with organic breathing
    const rotY = -diff * 0.32 + Math.sin(time * 1.2 + index) * 0.035;
    const rotX = Math.sin(time * 1.6 + index) * 0.02;
    groupRef.current.rotation.set(rotX, rotY, 0);
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
      {/* 1. Subtle Radiant Glow Effects for Active Front Icon (No cards, no boxes) */}
      {isFrontActive && (
        <>
          {/* Vibrant Point Light casting colored radiance onto the floating 3D symbol */}
          <pointLight
            position={[0, 0.1, 0.9]}
            intensity={2.8}
            distance={4.5}
            decay={2}
            color={meta.primary}
          />

          {/* Soft pulsing aura halo behind the active model */}
          <mesh position={[0, 0, -0.15]}>
            <ringGeometry args={[0.55, 0.85, 36]} />
            <meshBasicMaterial
              color={meta.primary}
              transparent
              opacity={hovered ? 0.38 : 0.24}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Soft radial inner glow disc */}
          <mesh position={[0, 0, -0.16]}>
            <circleGeometry args={[0.62, 36]} />
            <meshBasicMaterial
              color={meta.light}
              transparent
              opacity={hovered ? 0.45 : 0.30}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* 2. Soft Floor Contact Glow Tint (No metallic/grey shadows) */}
      {isFacingFront && (
        <mesh position={[0, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[isFrontActive ? 1.4 : 0.9, 24]} />
          <meshBasicMaterial
            color={meta.primary}
            transparent
            opacity={isFrontActive ? 0.14 : 0.06}
          />
        </mesh>
      )}

      {/* 3. Freely Floating Heroic 3D Colourful Symbol */}
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

  // Carousel continuous angle and target angle
  const angleRef = useRef(-carouselIndex * ANGLE_STEP);
  const targetAngleRef = useRef(-carouselIndex * ANGLE_STEP);
  const [renderAngle, setRenderAngle] = useState(angleRef.current);

  // Sync carouselIndex state to targetAngle
  useEffect(() => {
    targetAngleRef.current = -carouselIndex * ANGLE_STEP;
  }, [carouselIndex]);

  // Smooth angle lerping frame-by-frame
  useFrame(() => {
    const lerpFactor = isReducedMotion ? 1 : 0.082;
    angleRef.current = THREE.MathUtils.lerp(
      angleRef.current,
      targetAngleRef.current,
      lerpFactor
    );
    setRenderAngle(angleRef.current);
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
          currentAngle={renderAngle}
          onSelect={handleSlotSelect}
          isReducedMotion={isReducedMotion}
        />
      ))}
    </group>
  );
};
