import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '../../context/AuthContext';
import {
  Share2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Building2,
  FileSpreadsheet,
  GraduationCap,
  Scale,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  Activity,
  Award,
  Hash,
  X,
  Check,
  FileCheck,
} from 'lucide-react';
import {
  TrustGraphNode,
  TrustGraphEdge,
  IdentityConflictRadar as IdentityConflictRadarType,
  DataQualityScoreBreakdown,
  ProvenanceTimelineEvent,
} from '../../types';

// Node category color map
const NODE_COLORS: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  INSTITUTION: { bg: '#2563EB', border: '#60A5FA', glow: '#93C5FD', text: '#FFFFFF' },
  SUBMISSION: { bg: '#059669', border: '#34D399', glow: '#6EE7B7', text: '#FFFFFF' },
  STUDENT: { bg: '#7C3AED', border: '#A78BFA', glow: '#C4B5FD', text: '#FFFFFF' },
  CONFLICT: { bg: '#DC2626', border: '#F87171', glow: '#FCA5A5', text: '#FFFFFF' },
  VALIDATION: { bg: '#0D9488', border: '#2DD4BF', glow: '#5EEAD4', text: '#FFFFFF' },
  AUDIT: { bg: '#0284C7', border: '#38BDF8', glow: '#7DD3FC', text: '#FFFFFF' },
};

// -------------------------------------------------------------
// 3D Graph Node Mesh
// -------------------------------------------------------------
interface NodeMeshProps {
  node: TrustGraphNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (node: TrustGraphNode) => void;
  onHover: (node: TrustGraphNode | null) => void;
}

const NodeMesh: React.FC<NodeMeshProps> = ({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorMeta = NODE_COLORS[node.type] || NODE_COLORS.STUDENT;

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Subtle gentle levitation
    if (node.type === 'CONFLICT') {
      meshRef.current.position.y = node.y + Math.sin(time * 3 + node.x) * 0.08;
      meshRef.current.rotation.y = time * 0.8;
    } else {
      meshRef.current.position.y = node.y + Math.sin(time * 1.5 + node.x) * 0.03;
    }
  });

  const getGeometry = () => {
    switch (node.type) {
      case 'INSTITUTION':
        return <sphereGeometry args={[0.38, 24, 24]} />;
      case 'SUBMISSION':
        return <boxGeometry args={[0.42, 0.42, 0.42]} />;
      case 'CONFLICT':
        return <octahedronGeometry args={[0.38, 0]} />;
      case 'VALIDATION':
        return <dodecahedronGeometry args={[0.32, 0]} />;
      case 'AUDIT':
        return <boxGeometry args={[0.34, 0.34, 0.34]} />;
      default:
        return <sphereGeometry args={[0.26, 20, 20]} />;
    }
  };

  const scale = isSelected ? 1.4 : (isHovered ? 1.25 : 1.0);

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* 3D Node Mesh */}
      <mesh
        ref={meshRef}
        scale={[scale, scale, scale]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'default';
        }}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={colorMeta.bg}
          roughness={0.2}
          metalness={node.type === 'AUDIT' ? 0.7 : 0.15}
          emissive={isSelected || node.type === 'CONFLICT' ? colorMeta.border : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : (node.type === 'CONFLICT' ? 0.4 : 0)}
        />
      </mesh>

      {/* Selected Halo Ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.68, 32]} />
          <meshBasicMaterial color={colorMeta.border} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* HTML Floating Label on Hover or Selection */}
      {(isSelected || isHovered) && (
        <Html distanceFactor={12} position={[0, 0.55, 0]} center>
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[11px] font-semibold whitespace-nowrap shadow-md pointer-events-none flex items-center gap-1.5 backdrop-blur-xs border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorMeta.border }} />
            <span>{node.label}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// 3D Relationship Edge Line
// -------------------------------------------------------------
const EdgeLine: React.FC<{
  edge: TrustGraphEdge;
  nodes: TrustGraphNode[];
  selectedNodeId: string | null;
}> = ({ edge, nodes, selectedNodeId }) => {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  if (!sourceNode || !targetNode) return null;

  const lineGeometry = useMemo(() => {
    const pts = [
      new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z),
      new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [sourceNode.x, sourceNode.y, sourceNode.z, targetNode.x, targetNode.y, targetNode.z]);

  const isConnectedToSelected = selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId);
  const isCritical = edge.severity === 'CRITICAL';

  const edgeColor = isCritical
    ? '#EF4444'
    : (isConnectedToSelected ? '#3B82F6' : '#94A3B8');

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={edgeColor}
        transparent
        opacity={isConnectedToSelected ? 0.95 : (isCritical ? 0.75 : 0.28)}
        linewidth={isCritical || isConnectedToSelected ? 2 : 1}
      />
    </line>
  );
};

// -------------------------------------------------------------
// Radar Chart Component (5 Vectors)
// -------------------------------------------------------------
const RadarPolygon: React.FC<{ radar: IdentityConflictRadarType }> = ({ radar }) => {
  const size = 160;
  const center = size / 2;
  const radius = 60;

  const vectors = [
    { label: 'Concurrent Enrolment', val: radar.concurrentEnrolmentRisk },
    { label: 'APAAR / Integrity', val: radar.identifierIntegrity },
    { label: 'Cross-State Conflict', val: radar.crossStateConflict },
    { label: 'Timeline Collision', val: radar.timelineCollision },
    { label: 'Quota Anomaly', val: radar.quotaAnomaly },
  ];

  const points = vectors.map((v, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const r = (v.val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Pentagons */}
        {gridLevels.map((lvl, idx) => {
          const gridPoints = [0, 1, 2, 3, 4].map((i) => {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const r = lvl * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          return (
            <polygon
              key={idx}
              points={gridPoints}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="0.8"
              strokeDasharray={lvl === 1 ? 'none' : '2 2'}
            />
          );
        })}

        {/* Spokes */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={points}
          fill="rgba(239, 68, 68, 0.35)"
          stroke="#EF4444"
          strokeWidth="2"
        />

        {/* Data Vertex Dots */}
        {vectors.map((v, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const r = (v.val / 100) * radius;
          return (
            <circle
              key={i}
              cx={center + r * Math.cos(angle)}
              cy={center + r * Math.sin(angle)}
              r="3.5"
              fill="#EF4444"
            />
          );
        })}
      </svg>

      {/* Vector Value Legend */}
      <div className="w-full grid grid-cols-2 gap-1.5 mt-2 text-[10px]">
        {vectors.map((v, i) => (
          <div key={i} className="flex items-center justify-between px-2 py-1 rounded bg-slate-50 border border-slate-100">
            <span className="text-slate-500 truncate mr-1">{v.label}</span>
            <span className="font-mono font-bold text-slate-800">{v.val}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MAIN COMPONENT: TrustGraphWorkspace
// -------------------------------------------------------------
export const TrustGraphWorkspace: React.FC = () => {
  const { user, token } = useAuth();

  const [nodes, setNodes] = useState<TrustGraphNode[]>([]);
  const [edges, setEdges] = useState<TrustGraphEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<TrustGraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TrustGraphNode | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Deep Intelligence State for Selected Node
  const [intelligenceLoading, setIntelligenceLoading] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState<{
    student?: any;
    duplicateCase?: any;
    radar?: IdentityConflictRadarType;
    dataQualityScore?: DataQualityScoreBreakdown;
    provenanceTimeline?: ProvenanceTimelineEvent[];
  } | null>(null);

  // Inspector Tabs: 'DUPLICATE' | 'RADAR' | 'QUALITY' | 'PROVENANCE' | 'ADJUDICATE'
  const [activeTab, setActiveTab] = useState<'DUPLICATE' | 'RADAR' | 'QUALITY' | 'PROVENANCE' | 'ADJUDICATE'>('DUPLICATE');

  // Adjudication Form State
  const [adjudicateAction, setAdjudicateAction] = useState<'REVOKE_SECONDARY' | 'CONFIRM_EXCEPTION' | 'MARK_FALSE_POSITIVE'>('REVOKE_SECONDARY');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [adjudicating, setAdjudicating] = useState(false);
  const [adjudicateSuccess, setAdjudicateSuccess] = useState<string | null>(null);

  // Privacy: Unmasked APAAR State
  const [unmaskedId, setUnmaskedId] = useState<string | null>(null);
  const [unmasking, setUnmasking] = useState(false);

  // Fetch TrustGraph data
  const fetchGraphData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/trustgraph/data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.nodes) {
        setNodes(data.nodes);
        setEdges(data.edges);

        // Pre-select first conflict node or high priority student
        const conflict = data.nodes.find((n: TrustGraphNode) => n.type === 'CONFLICT');
        if (conflict) {
          setSelectedNode(conflict);
          fetchNodeIntelligence(conflict.id);
        } else if (data.nodes[0]) {
          setSelectedNode(data.nodes[0]);
          fetchNodeIntelligence(data.nodes[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load TrustGraph data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, [token]);

  // Fetch deep node intelligence
  const fetchNodeIntelligence = async (nodeId: string) => {
    if (!token) return;
    setIntelligenceLoading(true);
    setUnmaskedId(null);
    setAdjudicateSuccess(null);
    try {
      const res = await fetch(`/api/trustgraph/node/${nodeId}/intelligence`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setIntelligenceData(data);
        if (data.duplicateCase) {
          setActiveTab('DUPLICATE');
        } else {
          setActiveTab('QUALITY');
        }
      }
    } catch (err) {
      console.error('Failed to load node intelligence', err);
    } finally {
      setIntelligenceLoading(false);
    }
  };

  const handleSelectNode = (node: TrustGraphNode) => {
    setSelectedNode(node);
    fetchNodeIntelligence(node.id);
  };

  // Submit Adjudication
  const handleAdjudicateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intelligenceData?.duplicateCase || !decisionNotes.trim() || !token) return;

    setAdjudicating(true);
    setAdjudicateSuccess(null);

    try {
      const caseId = selectedNode?.type === 'CONFLICT'
        ? selectedNode.dbId
        : intelligenceData.duplicateCase.caseReference;

      const res = await fetch('/api/trustgraph/adjudicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId,
          action: adjudicateAction,
          decisionNotes: decisionNotes.trim(),
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        setAdjudicateSuccess(resData.message);
        setDecisionNotes('');
        fetchGraphData();
        if (selectedNode) {
          fetchNodeIntelligence(selectedNode.id);
        }
      } else {
        alert(resData.error || 'Adjudication failed');
      }
    } catch (err: any) {
      alert(`Adjudication error: ${err.message}`);
    } finally {
      setAdjudicating(false);
    }
  };

  // Unmask APAAR ID with audit justification
  const handleUnmaskIdentifier = async () => {
    if (!intelligenceData?.student?.id || !token) return;
    setUnmasking(true);
    try {
      const res = await fetch('/api/trustgraph/unmask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: intelligenceData.student.id,
          justification: 'Authorised statutory conflict investigation in CREDEN TrustGraph',
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.unmaskedApaarId) {
        setUnmaskedId(resData.unmaskedApaarId);
      }
    } catch (err) {
      console.error('Unmasking failed', err);
    } finally {
      setUnmasking(false);
    }
  };

  // Filter nodes
  const filteredNodes = nodes.filter((n) => {
    const matchesType = typeFilter === 'ALL' || n.type === typeFilter;
    const matchesSearch =
      !searchQuery ||
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.subLabel && n.subLabel.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col h-[740px] w-full text-slate-900 select-none font-sans">
      {/* Top Controls Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 mb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-950 tracking-tight">
                CREDEN TrustGraph
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              Interactive 3D relationship map, duplicate conflict radar & provenance engine
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['ALL', 'CONFLICT', 'STUDENT', 'INSTITUTION', 'SUBMISSION', 'VALIDATION', 'AUDIT'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                typeFilter === t
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Entities' : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
          <button
            onClick={fetchGraphData}
            className="p-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
            title="Refresh Graph"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Split: 3D Visualization (60%) + Intelligence Inspector (40%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* LEFT: 3D Relationship Visualisation */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950/95 border border-slate-800 relative overflow-hidden flex flex-col shadow-inner">
          {/* Canvas Overlays: Search and Legend */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search nodes (e.g. Priya, IIT, DUP)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 h-8 pl-8 pr-3 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Red: Active Collision</span>
            <span className="text-slate-600">•</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Purple: Student</span>
            <span className="text-slate-600">•</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Blue: Institution</span>
          </div>

          {/* 3D WebGL Canvas */}
          <div className="flex-1 w-full h-full">
            <Canvas
              camera={{ position: [0, 0, 9.5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.2} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFFFFF" />
              <pointLight position={[-10, -10, -5]} intensity={0.8} color="#06B6D4" />
              <directionalLight position={[0, 8, 6]} intensity={1.0} color="#FFFFFF" />

              <Suspense fallback={null}>
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={18}
                  minDistance={3}
                />

                {/* Graph Edges */}
                {edges.map((edge) => (
                  <EdgeLine
                    key={edge.id}
                    edge={edge}
                    nodes={nodes}
                    selectedNodeId={selectedNode ? selectedNode.id : null}
                  />
                ))}

                {/* Graph Nodes */}
                {filteredNodes.map((n) => (
                  <NodeMesh
                    key={n.id}
                    node={n}
                    isSelected={selectedNode?.id === n.id}
                    isHovered={hoveredNode?.id === n.id}
                    onSelect={handleSelectNode}
                    onHover={setHoveredNode}
                  />
                ))}
              </Suspense>
            </Canvas>
          </div>

          {/* Canvas Bottom Quick Stats */}
          <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span>Nodes: <strong className="text-white font-mono">{nodes.length}</strong></span>
              <span>Edges: <strong className="text-white font-mono">{edges.length}</strong></span>
              <span className="text-rose-400">Collisions: <strong className="font-mono">4 Flagged</strong></span>
            </div>
            <div className="text-[11px] text-slate-400">
              Click node to inspect • Drag to rotate 3D view • Scroll to zoom
            </div>
          </div>
        </div>

        {/* RIGHT: Deep Node Intelligence Inspector (40%) */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col overflow-hidden shadow-xs">
          {/* Inspector Header */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: selectedNode ? NODE_COLORS[selectedNode.type]?.bg : '#3B82F6',
                }}
              />
              <div className="truncate">
                <h3 className="text-xs font-bold text-slate-950 truncate">
                  {selectedNode ? selectedNode.label : 'Select an entity to inspect'}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedNode?.type} • {selectedNode?.subLabel}
                </span>
              </div>
            </div>

            {/* Severity Pill */}
            {selectedNode && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase font-mono ${
                  selectedNode.type === 'CONFLICT'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {selectedNode.status || 'Active'}
              </span>
            )}
          </div>

          {/* Inspector Navigation Tabs */}
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-slate-200 bg-white text-xs overflow-x-auto flex-shrink-0">
            {intelligenceData?.duplicateCase && (
              <button
                onClick={() => setActiveTab('DUPLICATE')}
                className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'DUPLICATE'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                <span>Explainable Duplicate</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('RADAR')}
              className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'RADAR'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3 h-3 text-blue-500" />
              <span>Conflict Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('QUALITY')}
              className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'QUALITY'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3 h-3 text-emerald-500" />
              <span>Quality Score</span>
            </button>

            <button
              onClick={() => setActiveTab('PROVENANCE')}
              className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'PROVENANCE'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Hash className="w-3 h-3 text-purple-500" />
              <span>Provenance Timeline</span>
            </button>

            {intelligenceData?.duplicateCase && ['AICTE_ADMIN', 'VERIFICATION_OFFICER'].includes(user?.role || '') && (
              <button
                onClick={() => setActiveTab('ADJUDICATE')}
                className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors whitespace-nowrap flex items-center gap-1 ml-auto ${
                  activeTab === 'ADJUDICATE'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Scale className="w-3 h-3" />
                <span>Adjudicate</span>
              </button>
            )}
          </div>

          {/* Inspector Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {intelligenceLoading ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-xs">Analyzing TrustGraph neural topology...</span>
              </div>
            ) : !intelligenceData ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a node in the 3D graph to view deep intelligence and audit trail.
              </div>
            ) : (
              <>
                {/* 1. EXPLAINABLE DUPLICATE DETECTION TAB */}
                {activeTab === 'DUPLICATE' && intelligenceData.duplicateCase && (
                  <div className="space-y-4">
                    {/* Header Banner */}
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>{intelligenceData.duplicateCase.caseReference}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 font-semibold">
                          Confidence: {Math.round(intelligenceData.duplicateCase.confidenceScore * 100)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-700 leading-relaxed">
                        {intelligenceData.duplicateCase.evidenceNotes}
                      </p>
                    </div>

                    {/* Side-by-Side Comparison Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Record A */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-blue-600 font-bold">
                          Institution A (Primary)
                        </span>
                        <h4 className="font-bold text-slate-900 leading-tight">
                          {intelligenceData.duplicateCase.sideBySideComparison.studentA.name}
                        </h4>
                        <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                          <p className="truncate">🏛️ {intelligenceData.duplicateCase.sideBySideComparison.studentA.institutionName}</p>
                          <p>🎓 {intelligenceData.duplicateCase.sideBySideComparison.studentA.courseName}</p>
                          <p>📅 Session: {intelligenceData.duplicateCase.sideBySideComparison.studentA.academicSession}</p>
                          <p>🎂 DOB: {intelligenceData.duplicateCase.sideBySideComparison.studentA.dateOfBirth}</p>
                        </div>
                      </div>

                      {/* Record B */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-rose-600 font-bold">
                          Institution B (Concurrent)
                        </span>
                        <h4 className="font-bold text-slate-900 leading-tight">
                          {intelligenceData.duplicateCase.sideBySideComparison.studentB.name}
                        </h4>
                        <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                          <p className="truncate">🏛️ {intelligenceData.duplicateCase.sideBySideComparison.studentB.institutionName}</p>
                          <p>🎓 {intelligenceData.duplicateCase.sideBySideComparison.studentB.courseName}</p>
                          <p>📅 Session: {intelligenceData.duplicateCase.sideBySideComparison.studentB.academicSession}</p>
                          <p>🎂 DOB: {intelligenceData.duplicateCase.sideBySideComparison.studentB.dateOfBirth}</p>
                        </div>
                      </div>
                    </div>

                    {/* Matching Rule & Statutory Rationale */}
                    <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                        Statutory Regulatory Basis
                      </span>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-mono">
                        {intelligenceData.duplicateCase.statutoryClause}
                      </p>
                    </div>

                    {/* Privacy Control: Masked APAAR */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">APAAR Identifier</span>
                        <span className="font-mono font-bold text-slate-800">
                          {unmaskedId || intelligenceData.student?.maskedApaar || '9874-****-**50'}
                        </span>
                      </div>
                      {['AICTE_ADMIN', 'VERIFICATION_OFFICER', 'AUDITOR'].includes(user?.role || '') && !unmaskedId && (
                        <button
                          type="button"
                          onClick={handleUnmaskIdentifier}
                          disabled={unmasking}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>{unmasking ? 'Authorising...' : 'Reveal (Audited)'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. IDENTITY CONFLICT RADAR TAB */}
                {activeTab === 'RADAR' && intelligenceData.radar && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Multi-Vector Threat Assessment
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          5-dimensional diagnostic scan across biometric, jurisdiction and quota vectors
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono ${
                          intelligenceData.radar.threatLevel === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {intelligenceData.radar.threatLevel} THREAT
                      </span>
                    </div>

                    {/* Radar SVG Visualization */}
                    <div className="py-2 flex justify-center">
                      <RadarPolygon radar={intelligenceData.radar} />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                        Diagnostic Evaluation
                      </span>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        {intelligenceData.radar.concurrentEnrolmentRisk > 50
                          ? 'High risk of duplicate subsidised degree seat allocation across state boundaries. Immediate reviewer adjudication required.'
                          : 'No critical identity or quota conflicts detected for this entity.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. TRANSPARENT RULE-BASED DATA QUALITY SCORE TAB */}
                {activeTab === 'QUALITY' && intelligenceData.dataQualityScore && (
                  <div className="space-y-4">
                    {/* Gauge and Grade */}
                    <div className="p-4 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                          Rule-Based Quality Index
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-3xl font-extrabold tracking-tight font-mono">
                            {intelligenceData.dataQualityScore.totalScore}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">/ 100 PTS</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-cyan-300">
                          {intelligenceData.dataQualityScore.grade}
                        </span>
                        <span className="text-[8px] font-mono text-slate-400">RATING</span>
                      </div>
                    </div>

                    {/* Breakdown Rubric */}
                    <div className="space-y-2">
                      {Object.entries(intelligenceData.dataQualityScore.metrics).map(([key, m]) => (
                        <div key={key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-slate-900">
                              {m.score} / {m.max} pts
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            {m.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PROVENANCE TIMELINE TAB */}
                {activeTab === 'PROVENANCE' && intelligenceData.provenanceTimeline && (
                  <div className="space-y-3">
                    <div className="pb-1 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Record Provenance Trajectory
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Cryptographically Chained
                      </span>
                    </div>

                    <div className="relative pl-5 border-l-2 border-slate-200 space-y-4">
                      {intelligenceData.provenanceTimeline.map((ev, idx) => (
                        <div key={idx} className="relative">
                          {/* Step Marker Dot */}
                          <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-[8px] font-bold text-blue-600">
                            {ev.step}
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{ev.stage}</span>
                              <span
                                className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-full ${
                                  ev.verificationType === 'OFFICIAL_REGISTRY_GATEWAY'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : (ev.verificationType === 'LOCAL_DETERMINISTIC' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-cyan-50 text-cyan-800 border border-cyan-200')
                                }`}
                              >
                                {ev.verificationType.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              {ev.description}
                            </p>
                            <div className="text-[10px] font-mono text-slate-400">
                              By {ev.actor} ({ev.actorRole}) • {new Date(ev.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. REVIEWER ADJUDICATION TAB */}
                {activeTab === 'ADJUDICATE' && intelligenceData.duplicateCase && (
                  <form onSubmit={handleAdjudicateSubmit} className="space-y-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Scale className="w-4 h-4 text-cyan-400" />
                        <span>Authorised Statutory Adjudication</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Every decision is immutably recorded and chained into the SHA-256 tamper-evident security ledger.
                      </p>
                    </div>

                    {adjudicateSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{adjudicateSuccess}</span>
                      </div>
                    )}

                    {/* Action Selector */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                        Adjudication Determination Action
                      </label>
                      <select
                        value={adjudicateAction}
                        onChange={(e: any) => setAdjudicateAction(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      >
                        <option value="REVOKE_SECONDARY">
                          Retain Primary Institution & Revoke Secondary
                        </option>
                        <option value="CONFIRM_EXCEPTION">
                          Authorize Dual Degree Exception (NEP 2020)
                        </option>
                        <option value="MARK_FALSE_POSITIVE">
                          Mark False Positive / Distinct Identifiers
                        </option>
                      </select>
                    </div>

                    {/* Justification Textarea */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                        Mandatory Statutory Findings & Evidence Notes
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="State regulatory findings, candidate interview result, and verification reference..."
                        value={decisionNotes}
                        onChange={(e) => setDecisionNotes(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={adjudicating || !decisionNotes.trim()}
                      className="w-full h-10 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
                    >
                      {adjudicating ? (
                        <span>Sealing in Cryptographic Ledger...</span>
                      ) : (
                        <>
                          <span>Commit Adjudication to Ledger</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
