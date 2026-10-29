import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { InfiniteSpace } from './InfiniteSpace';
import { ObsidianFloor } from './ObsidianFloor';
import { CircularModuleCarousel } from './CircularModuleCarousel';
import { CameraController } from './CameraController';
import { MODULE_PALETTE } from './FloatingModulePod';
import { usePortal, CAROUSEL_MODULES_LIST } from '../../context/PortalContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const SpatialCanvas: React.FC = () => {
  const {
    openWorkspace,
    carouselIndex,
    setCarouselIndex,
  } = usePortal();

  const activeModuleData =
    CAROUSEL_MODULES_LIST[carouselIndex] || CAROUSEL_MODULES_LIST[0];
  const activeMeta =
    MODULE_PALETTE[activeModuleData.id] || MODULE_PALETTE.institutions;

  // Navigation handlers for on-screen chevron buttons
  const handleNavLeft = () => {
    setCarouselIndex(carouselIndex - 1);
  };

  const handleNavRight = () => {
    setCarouselIndex(carouselIndex + 1);
  };

  return (
    <div
      className="absolute inset-0 pointer-events-auto select-none touch-none overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 135% 95% at 50% 16%, #FFFFFF 0%, #F5F9FD 38%, #E2EEFA 78%, #D5E7F8 100%)',
      }}
    >
      {/* 3D Circular Spatial Scene */}
      <Canvas
        camera={{ position: [0, 0.42, 7.6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Soft Spatial Atmosphere Fog */}
        <fog attach="fog" args={['#DFEDF9', 18, 48]} />

        {/* Subtle Ambient Light for Gentle Overall Illumination */}
        <ambientLight intensity={1.05} color="#F8FAFC" />

        {/* Soft Key Light for Crisp, Clean Architectural Form */}
        <directionalLight
          position={[5, 12, 8]}
          intensity={1.25}
          color="#FFFFFF"
        />

        {/* Soft Ice-Blue Ambient Rim Fill */}
        <directionalLight
          position={[-6, 6, -4]}
          intensity={0.55}
          color="#BAE6FD"
        />

        {/* Gentle Daylight Bounce */}
        <directionalLight
          position={[0, -3, 3]}
          intensity={0.25}
          color="#F1F5F9"
        />

        <Suspense fallback={null}>
          <CameraController />
          <InfiniteSpace />
          <ObsidianFloor />
          <CircularModuleCarousel />
        </Suspense>
      </Canvas>

      {/* Minimal Spatial HUD: Anchored Comfortably Below the Floating Front 3D Active Icon */}
      <div className="absolute top-[74%] sm:top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center pointer-events-none z-20 w-full max-w-xl px-4">
        {/* Soft Pastel Category Badge */}
        <div
          className="px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-2 shadow-xs transition-colors duration-300"
          style={{
            backgroundColor: activeMeta.light,
            color: activeMeta.badgeText,
          }}
        >
          {activeModuleData.category}
        </div>

        {/* Minimal High-Contrast Bold Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5 transition-all duration-300">
          {activeModuleData.title}
        </h1>

        {/* Concise Readable Subtitle (No perspective tilt, no blur) */}
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-md mb-4 transition-all duration-300">
          {activeModuleData.subtitle}
        </p>

        {/* Compact Pill-Shaped "Open Workspace" Button */}
        <button
          onClick={() => openWorkspace(activeModuleData.id)}
          className="pointer-events-auto group px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
          title={`Open ${activeModuleData.title} Workspace`}
          aria-label={`Open ${activeModuleData.title} Workspace`}
        >
          <span
            className="w-2 h-2 rounded-full transition-transform group-hover:scale-125 shadow-xs"
            style={{ backgroundColor: activeMeta.primary }}
          />
          <span>Open Workspace</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Minimal 10-Module Indicator Dots */}
        <div className="flex items-center gap-1.5 mt-4">
          {CAROUSEL_MODULES_LIST.map((m, idx) => {
            const isCurrent = idx === carouselIndex;
            return (
              <button
                key={m.id}
                onClick={() => setCarouselIndex(idx)}
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'w-6 bg-slate-900'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={m.title}
                aria-label={`Switch to ${m.title}`}
              />
            );
          })}
        </div>
      </div>

      {/* On-Screen Horizontal Navigation Controls in Pure White Floating Pills */}
      <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center pointer-events-none z-20">
        <button
          onClick={handleNavLeft}
          className="pointer-events-auto p-3.5 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-black border border-slate-200/90 hover:scale-105 active:scale-95 transition-all shadow-md group"
          title="Previous Module (Left Arrow)"
          aria-label="Previous Module"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 sm:right-6 flex items-center pointer-events-none z-20">
        <button
          onClick={handleNavRight}
          className="pointer-events-auto p-3.5 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-black border border-slate-200/90 hover:scale-105 active:scale-95 transition-all shadow-md group"
          title="Next Module (Right Arrow)"
          aria-label="Next Module"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Floating Minimal Navigation Hint Pill above Bottom Dock */}
      <div className="absolute bottom-18 left-1/2 -translate-x-1/2 pointer-events-none z-20 hidden md:block">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-slate-200/80 text-[11px] text-slate-600 shadow-xs">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeMeta.primary }}
          />
          <span>Drag or scroll trackpad / wheel to spin carousel</span>
          <span className="text-slate-300">•</span>
          <span>Click icon or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200">Enter</kbd> to launch</span>
        </div>
      </div>
    </div>
  );
};
