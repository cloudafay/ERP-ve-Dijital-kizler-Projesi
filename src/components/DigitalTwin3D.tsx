import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import predictiveMaintenanceAI, { type FailurePrediction, type MachineHealthData } from '../lib/predictiveMaintenanceAI';
import oeeAnalyticsService, { type ProductionLineOEE, type OEEPrediction } from '../lib/oeeAnalytics';
import maintenanceRecommendationSystem, { type MaintenancePlan, type MaintenanceTask } from '../lib/maintenanceRecommendationSystem';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Gauge, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Wrench,
  BarChart3,
  Lightbulb,
  GraduationCap,
  PlayCircle,
  PauseCircle,
  SkipForward,
  RotateCcw as Reset,
  Eye,
  Hand,
  Target,
  Award,
  BookOpen,
  Video,
  Cpu,
  Zap as Lightning,
  TrendingUp as Trend,
  AlertCircle,
  Shield,
  Wrench as WrenchIcon,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  BarChart4,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown,
  Minus as TrendStable,
  Target as TargetIcon,
  Zap as PerformanceIcon,
  ShieldCheck,
  Timer,
  Package,
  AlertOctagon,
  ThumbsUp,
  ThumbsDown,
  Award as Excellence,
  Wrench as MaintenanceIcon,
  Calendar as CalendarIcon,
  ClipboardList,
  AlertTriangle as WarningIcon,
  CheckCircle2 as SuccessIcon,
  Clock as TimeIcon,
  Users as TeamIcon,
  Package2,
  TrendingUp as ImprovementIcon,
  Zap as UrgentIcon,
  Shield as SafetyIcon
} from 'lucide-react';

// Machine status interface
interface MachineStatus {
  id: string;
  name: string;
  type: 'injection' | 'blowing' | 'labeling' | 'packaging' | 'conveyor';
  status: 'running' | 'idle' | 'maintenance' | 'error';
  temperature: number;
  pressure: number;
  speed: number;
  efficiency: number;
  position: [number, number, number];
  color: string;
}

// Machine data
const MACHINE_DATA: MachineStatus[] = [
  {
    id: 'INJ001',
    name: 'Enjeksiyon Makinesi #1',
    type: 'injection',
    status: 'running',
    temperature: 245,
    pressure: 85,
    speed: 1200,
    efficiency: 94,
    position: [-6, 0, -2],
    color: '#ffffff'
  },
  {
    id: 'BLW002',
    name: 'Şişirme Makinesi #2',  
    type: 'blowing',
    status: 'running',
    temperature: 120,
    pressure: 40,
    speed: 800,
    efficiency: 87,
    position: [-2, 0, -2],
    color: '#ffffff'
  },
  {
    id: 'LBL003',
    name: 'Etiketleme Hattı #3',
    type: 'labeling',
    status: 'idle',
    temperature: 25,
    pressure: 15,
    speed: 0,
    efficiency: 0,
    position: [2, 0, -2],
    color: '#ffffff'
  },
  {
    id: 'PKG004',
    name: 'Paketleme Makinesi #4',
    type: 'packaging',
    status: 'maintenance',
    temperature: 30,
    pressure: 20,
    speed: 0,
    efficiency: 0,
    position: [6, 0, -2],
    color: '#ffffff'
  },
  {
    id: 'CNV005',
    name: 'Konveyör Sistemi',
    type: 'conveyor',
    status: 'running',
    temperature: 22,
    pressure: 5,
    speed: 300,
    efficiency: 98,
    position: [0, -0.5, 2],
    color: '#ffffff'
  }
];

// Realistic Box component with industrial materials
const IndustrialBox: React.FC<{ 
  args: [number, number, number]; 
  color: string;
  meshRef?: React.RefObject<THREE.Mesh>;
  metallic?: number;
  roughness?: number;
}> = ({ args, color, meshRef, metallic = 0.7, roughness = 0.3 }) => {
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial 
        color={color} 
        metalness={metallic}
        roughness={roughness}
      />
    </mesh>
  );
};

// Industrial Cylinder component
const IndustrialCylinder: React.FC<{ 
  args: [number, number, number, number]; 
  color: string;
  meshRef?: React.RefObject<THREE.Mesh>;
  metallic?: number;
  roughness?: number;
}> = ({ args, color, meshRef, metallic = 0.8, roughness = 0.2 }) => {
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial 
        color={color}
        metalness={metallic}
        roughness={roughness}
      />
    </mesh>
  );
};

// Simple Sphere component
const SimpleSphere: React.FC<{ 
  args: [number]; 
  color: string;
  position?: [number, number, number];
  emissive?: string;
  emissiveIntensity?: number;
}> = ({ args, color, position, emissive, emissiveIntensity }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={args} />
      <meshStandardMaterial 
        color={color} 
        emissive={emissive || color}
        emissiveIntensity={emissiveIntensity || 0}
      />
    </mesh>
  );
};

// Detailed Industrial Machine Component
const IndustrialMachine: React.FC<{ 
  machine: MachineStatus; 
  selected: boolean; 
  onSelect: () => void; 
  isPlaying: boolean;
}> = ({ machine, selected, onSelect, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Realistic rotation for running machines - only when playing
  useFrame(() => {
    if (meshRef.current && machine.status === 'running' && isPlaying) {
      // Konveyör hariç diğer makineler döner
      if (machine.type !== 'conveyor') {
        meshRef.current.rotation.y += 0.005;
      }
    }
  });

  const scale = selected ? 1.1 : hovered ? 1.05 : 1;

  const renderMachineGeometry = () => {
    switch (machine.type) {
      case 'injection':
        return (
          <group>
            {/* Main injection molding machine body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2, 1.5, 1.2]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            
            {/* Injection cylinder */}
            <mesh position={[1.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
              <meshStandardMaterial 
                color="#4a5568" 
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            
            {/* Control panel */}
            <mesh position={[-0.8, 0.5, 0.7]} castShadow>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshStandardMaterial 
                color="#1a202c"
                emissive="#00ff00"
                emissiveIntensity={machine.status === 'running' ? 0.2 : 0}
              />
            </mesh>
          </group>
        );
        
      case 'blowing':
        return (
          <group>
            {/* Main blow molding chamber */}
            <mesh ref={meshRef} castShadow receiveShadow>
              <cylinderGeometry args={[1, 1, 2, 12]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            
            {/* Heating elements */}
            {[0, 120, 240].map((angle, i) => (
              <mesh 
                key={i} 
                position={[
                  Math.cos((angle * Math.PI) / 180) * 1.2,
                  0,
                  Math.sin((angle * Math.PI) / 180) * 1.2
                ]}
                castShadow
              >
                <boxGeometry args={[0.1, 1.8, 0.1]} />
                <meshStandardMaterial 
                  color="#ff4500"
                  emissive="#ff4500"
                  emissiveIntensity={machine.status === 'running' ? 0.3 : 0}
                />
              </mesh>
            ))}
            
            {/* Air compressor unit */}
            <mesh position={[0, -1.5, 0]} castShadow>
              <boxGeometry args={[0.8, 0.6, 0.8]} />
              <meshStandardMaterial 
                color="#4a5568" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
        
              case 'conveyor':
          return (
            <group>
              {/* Conveyor belt surface - stationary */}
              <mesh receiveShadow>
                <boxGeometry args={[8, 0.1, 1]} />
                <meshStandardMaterial 
                  color="#1a1a1a" 
                  roughness={0.8}
                  metalness={0.1}
                />
              </mesh>
              
              {/* Conveyor rollers - white industrial color */}
              {[-3, -1, 1, 3].map((x, i) => (
                <mesh key={i} position={[x, -0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
                  <meshStandardMaterial 
                    color="#ffffff" 
                    metalness={0.3}
                    roughness={0.4}
                  />
                </mesh>
              ))}
              
              {/* Support structure - white */}
              {[-3.5, 0, 3.5].map((x, i) => (
                <mesh key={i} position={[x, -0.5, 0]} castShadow>
                  <boxGeometry args={[0.2, 0.8, 0.2]} />
                  <meshStandardMaterial 
                    color="#ffffff" 
                    metalness={0.3}
                    roughness={0.4}
                  />
                </mesh>
              ))}
            </group>
          );
        
      case 'labeling':
        return (
          <group>
            {/* Main labeling station */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.8, 1.4, 1]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            
            {/* Label applicator arm */}
            <mesh position={[0, 0.8, 0]} ref={meshRef} castShadow>
              <boxGeometry args={[0.2, 0.6, 0.8]} />
              <meshStandardMaterial 
                color="#4a5568" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Label roll */}
            <mesh position={[-0.8, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.8, 12]} />
              <meshStandardMaterial 
                color="#ffffff" 
                roughness={0.9}
                metalness={0}
              />
            </mesh>
          </group>
        );
        
      case 'packaging':
        return (
          <group>
            {/* Main packaging machine */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.2, 1.6, 1.4]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            
            {/* Packaging arms */}
            <mesh position={[0.8, 0.5, 0]} ref={meshRef} castShadow>
              <boxGeometry args={[0.6, 0.3, 1]} />
              <meshStandardMaterial 
                color="#4a5568" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Film roll */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 1.2, 12]} />
              <meshStandardMaterial 
                color="#e2e8f0" 
                transparent
                opacity={0.8}
                roughness={0.1}
                metalness={0}
              />
            </mesh>
          </group>
        );
        
      default:
        return (
          <IndustrialBox args={[1.5, 1.2, 1]} color={machine.color} meshRef={meshRef} />
        );
    }
  };

  return (
    <group
      position={machine.position}
      scale={[scale, scale, scale]}
      onClick={onSelect}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderMachineGeometry()}
      
      {/* Status indicator light */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial 
          color={machine.status === 'running' ? '#00ff00' : 
                machine.status === 'idle' ? '#ffff00' :
                machine.status === 'maintenance' ? '#0080ff' : '#ff0000'} 
          emissive={machine.status === 'running' ? '#00ff00' : 
                   machine.status === 'idle' ? '#ffff00' :
                   machine.status === 'maintenance' ? '#0080ff' : '#ff0000'}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Machine nameplate */}
      <Html position={[0, 2.5, 0]} center>
        <div className="bg-gray-900/90 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none border border-gray-600 shadow-lg">
          <div className="font-bold">{machine.name}</div>
          <div className="text-gray-300 text-[10px]">{machine.id}</div>
        </div>
      </Html>
      
      {/* Digital Performance Avatar */}
      <group position={[0, 2.8, 0]}>
        {/* Performance ring - changes color based on efficiency */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.4, 16]} />
          <meshStandardMaterial 
            color={
              machine.efficiency >= 90 ? '#00ff00' :
              machine.efficiency >= 70 ? '#ffff00' :
              machine.efficiency >= 50 ? '#ff8800' : '#ff0000'
            }
            emissive={
              machine.efficiency >= 90 ? '#00ff00' :
              machine.efficiency >= 70 ? '#ffff00' :
              machine.efficiency >= 50 ? '#ff8800' : '#ff0000'
            }
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Performance bars - 3D representation */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2;
          const isActive = (machine.efficiency / 100) * 4 > i;
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle) * 0.5,
                0,
                Math.sin(angle) * 0.5
              ]}
              castShadow
            >
              <boxGeometry args={[0.05, isActive ? 0.3 + (i * 0.1) : 0.1, 0.05]} />
              <meshStandardMaterial 
                color={isActive ? (
                  machine.efficiency >= 90 ? '#00ff00' :
                  machine.efficiency >= 70 ? '#ffff00' :
                  machine.efficiency >= 50 ? '#ff8800' : '#ff0000'
                ) : '#333333'}
                emissive={isActive ? (
                  machine.efficiency >= 90 ? '#00ff00' :
                  machine.efficiency >= 70 ? '#ffff00' :
                  machine.efficiency >= 50 ? '#ff8800' : '#ff0000'
                ) : '#000000'}
                emissiveIntensity={isActive ? 0.2 : 0}
              />
            </mesh>
          );
        })}
        
        {/* Central performance sphere */}
        <mesh>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial 
            color={
              machine.efficiency >= 90 ? '#00ff00' :
              machine.efficiency >= 70 ? '#ffff00' :
              machine.efficiency >= 50 ? '#ff8800' : '#ff0000'
            }
            emissive={
              machine.efficiency >= 90 ? '#00ff00' :
              machine.efficiency >= 70 ? '#ffff00' :
              machine.efficiency >= 50 ? '#ff8800' : '#ff0000'
            }
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      {/* Efficiency display for running machines */}
      {machine.status === 'running' && (
        <Html position={[1.5, 1, 0]}>
          <div className="bg-green-900/90 text-green-100 px-2 py-1 rounded text-xs pointer-events-none border border-green-600">
            <div className="font-bold">{machine.efficiency}%</div>
            <div className="text-[10px]">Verimlilik</div>
          </div>
        </Html>
      )}

      {/* Temperature and Pressure Avatars for selected machine */}
      {selected && (
        <group>
          {/* Temperature Avatar */}
          <group position={[-1.8, 1.5, 0]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, machine.temperature / 100, 8]} />
              <meshStandardMaterial 
                color={machine.temperature > 200 ? '#ff4500' : machine.temperature > 100 ? '#ffaa00' : '#00aaff'}
                emissive={machine.temperature > 200 ? '#ff4500' : machine.temperature > 100 ? '#ffaa00' : '#00aaff'}
                emissiveIntensity={0.3}
              />
            </mesh>
            <Html position={[0, -0.5, 0]} center>
              <div className="bg-black/80 text-white px-1 py-0.5 rounded text-[10px] pointer-events-none">
                {machine.temperature}°C
              </div>
            </Html>
          </group>

          {/* Pressure Avatar */}
          <group position={[1.8, 1.5, 0]}>
            <mesh>
              <boxGeometry args={[0.2, machine.pressure / 50, 0.2]} />
              <meshStandardMaterial 
                color={machine.pressure > 60 ? '#ff0000' : machine.pressure > 30 ? '#ffaa00' : '#00ff00'}
                emissive={machine.pressure > 60 ? '#ff0000' : machine.pressure > 30 ? '#ffaa00' : '#00ff00'}
                emissiveIntensity={0.2}
              />
            </mesh>
            <Html position={[0, -0.5, 0]} center>
              <div className="bg-black/80 text-white px-1 py-0.5 rounded text-[10px] pointer-events-none">
                {machine.pressure} bar
              </div>
            </Html>
          </group>

          {/* Speed Avatar */}
          <group position={[0, 1.5, 1.8]}>
            {/* Rotating speed indicator */}
            <mesh rotation={[0, isPlaying ? Date.now() * 0.01 * (machine.speed / 1000) : 0, 0]}>
              <torusGeometry args={[0.2, 0.05, 8, 16]} />
              <meshStandardMaterial 
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={machine.status === 'running' ? 0.4 : 0}
              />
            </mesh>
            <Html position={[0, -0.5, 0]} center>
              <div className="bg-black/80 text-white px-1 py-0.5 rounded text-[10px] pointer-events-none">
                {machine.speed} rpm
              </div>
            </Html>
          </group>
        </group>
      )}
    </group>
  );
};

// Realistic Industrial Factory Floor
const IndustrialFactory: React.FC = () => {
  return (
    <group>
      {/* Concrete factory floor with texture */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[20, 0.2, 12]} />
        <meshStandardMaterial 
          color="#4a5568" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      

      
      {/* Industrial metal walls */}
      <group position={[0, 2, -6]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[20, 6, 0.3]} />
          <meshStandardMaterial 
            color="#2d3748" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>
      
      <group position={[-10, 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 6, 12]} />
          <meshStandardMaterial 
            color="#2d3748" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>
      
      <group position={[10, 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 6, 12]} />
          <meshStandardMaterial 
            color="#2d3748" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>
      
      {/* Industrial ceiling structure */}
      <group position={[0, 5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[20, 0.2, 12]} />
          <meshStandardMaterial 
            color="#1a202c" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>
      
      {/* Support beams */}
      {[-6, -2, 2, 6].map((x, i) => (
        <group key={i} position={[x, 2.5, -3]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 5, 0.3]} />
            <meshStandardMaterial 
              color="#4a5568" 
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      
      {/* Industrial lighting fixtures */}
      {[-4, 0, 4].map((x, i) => (
        <group key={i} position={[x, 4.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.2, 8]} />
            <meshStandardMaterial 
              color="#e2e8f0" 
              emissive="#ffffff"
              emissiveIntensity={0.3}
            />
          </mesh>
          <pointLight 
            position={[0, -0.5, 0]} 
            intensity={2} 
            distance={8} 
            color="#ffffff"
            castShadow
          />
        </group>
      ))}
      
      {/* Safety signs and equipment */}
      <group position={[-9.5, 3, 0]}>
        <mesh>
          <planeGeometry args={[1, 0.6]} />
          <meshStandardMaterial 
            color="#ff6b6b" 
            emissive="#ff0000"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    </group>
  );
};

// Main 3D Scene
const Scene: React.FC<{ 
  selectedMachine: string | null; 
  onMachineSelect: (id: string) => void; 
  isPlaying: boolean;
  analysisResults?: any;
  trainingHighlight?: string | null;
  activeTrainingScenario?: any;
  currentPrediction?: FailurePrediction | null;
  currentOEE?: ProductionLineOEE | null;
  currentMaintenancePlan?: MaintenancePlan | null;
}> = ({ selectedMachine, onMachineSelect, isPlaying, analysisResults, trainingHighlight, activeTrainingScenario, currentPrediction, currentOEE, currentMaintenancePlan }) => {
  return (
    <>
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
      />
      
      {/* Realistic Industrial Lighting */}
      <ambientLight intensity={0.3} color="#f0f8ff" />
      
      {/* Main overhead lighting */}
      <directionalLight 
        position={[8, 12, 6]} 
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      
      {/* Secondary directional light for fill */}
      <directionalLight 
        position={[-5, 8, -8]} 
        intensity={0.8}
        color="#e6f3ff"
        castShadow
      />
      
      {/* Factory work area lighting */}
      <pointLight 
        position={[-6, 4, -2]} 
        intensity={1.2} 
        distance={12}
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[6, 4, -2]} 
        intensity={1.2} 
        distance={12}
        color="#ffffff"
        castShadow
      />
      
      {/* Warm accent lighting */}
      <pointLight 
        position={[0, 3, 4]} 
        intensity={0.8} 
        distance={10}
        color="#fff8dc"
      />
      
      {/* Factory components */}
      <IndustrialFactory />
      
              {/* Machines */}
        {MACHINE_DATA.map((machine) => (
          <group key={machine.id}>
            <IndustrialMachine
              machine={machine}
              selected={selectedMachine === machine.id}
              onSelect={() => onMachineSelect(machine.id)}
              isPlaying={isPlaying}
            />
            
            {/* Training Highlight Ring */}
            {trainingHighlight === machine.id && activeTrainingScenario && (
              <group position={machine.position}>
                <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[2, 2.5, 32]} />
                  <meshStandardMaterial 
                    color="#00ff00"
                    emissive="#00ff00"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
                
                {/* Training Instruction Floating Text */}
                <Html position={[0, 3.5, 0]} center>
                  <div className="bg-green-500/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none border border-green-400 shadow-lg animate-pulse">
                    <div className="font-bold flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Eğitim Aktif: {activeTrainingScenario.name}
                    </div>
                    <div className="text-green-100 text-xs mt-1">
                      Bu makinede eğitim senaryosu çalışıyor
                    </div>
                  </div>
                </Html>
              </group>
            )}
            
            {/* AI Prediction Indicators */}
            {currentPrediction && currentPrediction.machineId === machine.id && (
              <group position={machine.position}>
                <mesh position={[0, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.5, 2, 32]} />
                  <meshStandardMaterial 
                    color={
                      currentPrediction.riskLevel === 'critical' ? '#ff0000' :
                      currentPrediction.riskLevel === 'high' ? '#ff8800' :
                      currentPrediction.riskLevel === 'medium' ? '#ffff00' : '#00ff00'
                    }
                    emissive={
                      currentPrediction.riskLevel === 'critical' ? '#ff0000' :
                      currentPrediction.riskLevel === 'high' ? '#ff8800' :
                      currentPrediction.riskLevel === 'medium' ? '#ffff00' : '#00ff00'
                    }
                    emissiveIntensity={0.4}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
                
                {/* AI Prediction Floating Text */}
                <Html position={[0, 4, 0]} center>
                  <div className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none border shadow-lg ${
                    currentPrediction.riskLevel === 'critical' ? 'bg-red-500/90 text-white border-red-400' :
                    currentPrediction.riskLevel === 'high' ? 'bg-orange-500/90 text-white border-orange-400' :
                    currentPrediction.riskLevel === 'medium' ? 'bg-yellow-500/90 text-black border-yellow-400' :
                    'bg-green-500/90 text-white border-green-400'
                  }`}>
                    <div className="font-bold flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      AI Tahmin: {currentPrediction.riskLevel.toUpperCase()} Risk
                    </div>
                    <div className="text-xs mt-1 opacity-90">
                      {currentPrediction.failureType} • {Math.ceil((currentPrediction.predictedFailureTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} gün
                    </div>
                  </div>
                </Html>
                
                {/* Risk Score Floating Indicator */}
                <Html position={[2, 2, 0]} center>
                  <div className="bg-purple-500/90 text-white px-2 py-1 rounded text-xs font-bold border border-purple-400 shadow-lg">
                    Risk: {currentPrediction.riskScore.toFixed(0)}%
                  </div>
                </Html>
              </group>
            )}
          </group>
        ))}

        {/* OEE Line Analysis Indicators */}
        {currentOEE && (
          <group>
            {/* OEE Line Information Display */}
            <Html position={[0, 6, 0]} center>
              <div className="bg-indigo-500/90 text-white px-6 py-3 rounded-lg text-sm border border-indigo-400 shadow-lg">
                <div className="font-bold flex items-center gap-2 mb-2">
                  <BarChart4 className="w-5 h-5" />
                  {currentOEE.lineName} - OEE Analizi
                </div>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium">Genel OEE</div>
                    <div className="text-lg font-bold">{currentOEE.overallOEE.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Kullanılabilirlik</div>
                    <div className="text-lg font-bold">{currentOEE.availability.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Performans</div>
                    <div className="text-lg font-bold">{currentOEE.performance.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Kalite</div>
                    <div className="text-lg font-bold">{currentOEE.quality.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="text-center mt-2 text-indigo-100">
                  Trend: {currentOEE.trend === 'improving' ? '📈 İyileşiyor' : 
                          currentOEE.trend === 'declining' ? '📉 Düşüyor' : '➡️ Stabil'} • 
                  Darboğaz: {currentOEE.bottleneckMachine}
                </div>
              </div>
            </Html>

            {/* OEE Efficiency Floor Overlay */}
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[20, 10]} />
              <meshStandardMaterial 
                color={
                  currentOEE.efficiency === 'excellent' ? '#10b981' :
                  currentOEE.efficiency === 'good' ? '#3b82f6' :
                  currentOEE.efficiency === 'fair' ? '#f59e0b' : '#ef4444'
                }
                transparent
                opacity={0.1}
              />
            </mesh>

            {/* Bottleneck Machine Highlight */}
            {MACHINE_DATA.map((machine) => {
              if (machine.id === currentOEE.bottleneckMachine) {
                return (
                  <group key={`bottleneck-${machine.id}`} position={machine.position}>
                    <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
                      <ringGeometry args={[2.5, 3, 32]} />
                      <meshStandardMaterial 
                        color="#ff6b35"
                        emissive="#ff6b35"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.8}
                      />
                    </mesh>
                    
                    <Html position={[0, 4.5, 0]} center>
                      <div className="bg-orange-500/90 text-white px-3 py-1 rounded text-xs font-bold border border-orange-400 shadow-lg animate-pulse">
                        🔴 DARBOĞAZ MAKİNE
                      </div>
                    </Html>
                  </group>
                );
              }
              return null;
            })}
                     </group>
         )}

        {/* Maintenance Plan Indicators */}
        {currentMaintenancePlan && (
          <group>
            {/* Maintenance Plan Information Display */}
            <Html position={[0, 7, 0]} center>
              <div className="bg-orange-500/90 text-white px-6 py-3 rounded-lg text-sm border border-orange-400 shadow-lg">
                <div className="font-bold flex items-center gap-2 mb-2">
                  <MaintenanceIcon className="w-5 h-5" />
                  {currentMaintenancePlan.planName}
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium">Toplam Görev</div>
                    <div className="text-lg font-bold">{currentMaintenancePlan.tasks.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Toplam Süre</div>
                    <div className="text-lg font-bold">{currentMaintenancePlan.totalDuration}h</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Toplam Maliyet</div>
                    <div className="text-lg font-bold">₺{(currentMaintenancePlan.totalCost / 1000).toFixed(0)}K</div>
                  </div>
                </div>
                <div className="text-center mt-2 text-orange-100">
                  Risk Azalması: %{currentMaintenancePlan.riskReduction} • 
                  {currentMaintenancePlan.machines.length} Makine
                </div>
              </div>
            </Html>

            {/* Maintenance Task Indicators on Machines */}
            {MACHINE_DATA.map((machine) => {
              const machineTasks = currentMaintenancePlan.tasks.filter(task => task.machineId === machine.id);
              if (machineTasks.length === 0) return null;

              const criticalTasks = machineTasks.filter(task => task.priority === 'critical').length;
              const highTasks = machineTasks.filter(task => task.priority === 'high').length;
              
              return (
                <group key={`maintenance-${machine.id}`} position={machine.position}>
                  {/* Maintenance indicator ring */}
                  <mesh position={[0, -1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.8, 2.2, 32]} />
                    <meshStandardMaterial 
                      color={criticalTasks > 0 ? '#ff4444' : highTasks > 0 ? '#ff8800' : '#44ff44'}
                      emissive={criticalTasks > 0 ? '#ff4444' : highTasks > 0 ? '#ff8800' : '#44ff44'}
                      emissiveIntensity={0.4}
                      transparent
                      opacity={0.7}
                    />
                  </mesh>
                  
                  {/* Maintenance task count */}
                  <Html position={[0, 5, 0]} center>
                    <div className={`px-3 py-1 rounded text-xs font-bold border shadow-lg ${
                      criticalTasks > 0 ? 'bg-red-500/90 text-white border-red-400' :
                      highTasks > 0 ? 'bg-orange-500/90 text-white border-orange-400' :
                      'bg-green-500/90 text-white border-green-400'
                    }`}>
                      🔧 {machineTasks.length} Bakım Görevi
                      {criticalTasks > 0 && <div className="text-xs">⚠️ {criticalTasks} KRİTİK</div>}
                    </div>
                  </Html>

                  {/* Priority indicators */}
                  {criticalTasks > 0 && (
                    <mesh position={[0, 3, 0]}>
                      <sphereGeometry args={[0.2]} />
                      <meshStandardMaterial 
                        color="#ff0000"
                        emissive="#ff0000"
                        emissiveIntensity={0.8}
                      />
                    </mesh>
                  )}
                </group>
              );
            })}

            {/* Maintenance schedule timeline */}
            <Html position={[8, 4, 0]} center>
              <div className="bg-orange-600/90 text-white px-4 py-2 rounded-lg text-xs border border-orange-500 shadow-lg">
                <div className="font-bold mb-1">📅 Bakım Takvimi</div>
                <div className="space-y-1">
                  {currentMaintenancePlan.tasks
                    .filter(task => task.priority === 'critical' || task.priority === 'high')
                    .slice(0, 3)
                    .map((task, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'critical' ? 'bg-red-400' : 'bg-orange-400'
                        }`} />
                        <span>{task.title}</span>
                        <span className="text-orange-200">
                          {task.scheduledDate.toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </Html>
          </group>
        )}

      {/* What-If Analysis Visual Effects */}
      {analysisResults && (
        <group>
          {/* Warning overlay for negative scenarios */}
          {(analysisResults.scenario === 'machine_breakdown' || 
            analysisResults.scenario === 'maintenance_delay' ||
            analysisResults.scenario === 'efficiency_drop') && (
            <mesh position={[0, 0.1, 0]}>
              <planeGeometry args={[20, 12]} />
              <meshStandardMaterial 
                color="#ff0000"
                transparent
                opacity={0.1}
                emissive="#ff0000"
                emissiveIntensity={0.05}
              />
            </mesh>
          )}

          {/* Success overlay for positive scenarios */}
          {analysisResults.scenario === 'capacity_increase' && (
            <mesh position={[0, 0.1, 0]}>
              <planeGeometry args={[20, 12]} />
              <meshStandardMaterial 
                color="#00ff00"
                transparent
                opacity={0.1}
                emissive="#00ff00"
                emissiveIntensity={0.05}
              />
            </mesh>
          )}

          {/* Analysis impact indicators */}
          {MACHINE_DATA.slice(0, analysisResults.predictions?.affectedMachines || 1).map((machine, index) => (
            <group key={`analysis-${machine.id}`} position={[machine.position[0], machine.position[1] + 3.5, machine.position[2]]}>
              <mesh>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
                <meshStandardMaterial 
                  color={analysisResults.scenario === 'capacity_increase' ? '#00ff00' : '#ff6600'}
                  emissive={analysisResults.scenario === 'capacity_increase' ? '#00ff00' : '#ff6600'}
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              
              {/* Floating impact text */}
              <Html position={[0, 0.5, 0]} center>
                <div className="bg-black/90 text-white px-2 py-1 rounded text-xs pointer-events-none animate-pulse">
                  {analysisResults.scenario === 'capacity_increase' ? '+30% Kapasite' : 
                   analysisResults.scenario === 'machine_breakdown' ? 'Arıza Riski' :
                   analysisResults.scenario === 'maintenance_delay' ? 'Bakım Gerekli' :
                   'Verimlilik Düşük'}
                </div>
              </Html>
            </group>
          ))}
        </group>
      )}
    </>
  );
};

// Compact Control Panel for main page
const CompactControlPanel: React.FC<{ 
  selectedMachine: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}> = ({ selectedMachine, isPlaying, onPlayPause, onReset }) => {
  const selectedMachineData = MACHINE_DATA.find(m => m.id === selectedMachine);

  return (
    <div className="absolute bottom-4 right-80 z-10">
      <Card className="w-72 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            Dijital İkiz Kontrolü
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" onClick={onPlayPause} className="flex-1 text-xs">
              {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
              {isPlaying ? 'Duraklat' : 'Başlat'}
            </Button>
            <Button size="sm" variant="outline" onClick={onReset} className="text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              Sıfırla
            </Button>
          </div>
          
          {/* Factory status - compact */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Çalışan: 3
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Beklemede: 1
            </div>
          </div>

          {/* Selected machine details - compact */}
          {selectedMachineData && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">{selectedMachineData.name}</span>
                <Badge variant={
                  selectedMachineData.status === 'running' ? 'default' :
                  selectedMachineData.status === 'idle' ? 'secondary' :
                  selectedMachineData.status === 'maintenance' ? 'outline' : 'destructive'
                } className="text-xs">
                  {selectedMachineData.status === 'running' ? 'Çalışıyor' :
                   selectedMachineData.status === 'idle' ? 'Beklemede' :
                   selectedMachineData.status === 'maintenance' ? 'Bakımda' : 'Hata'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Sıcaklık:</span>
                  <div className="font-semibold">{selectedMachineData.temperature}°C</div>
                </div>
                <div>
                  <span className="text-gray-500">Verimlilik:</span>
                  <div className="font-semibold">{selectedMachineData.efficiency}%</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Operator Training Simulation Panel
const OperatorTrainingPanel: React.FC<{
  selectedMachine: string | null;
  onTrainingStart: (scenario: any) => void;
  isPlaying: boolean;
}> = ({ selectedMachine, onTrainingStart, isPlaying }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTraining, setActiveTraining] = useState<any>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [completedTrainings, setCompletedTrainings] = useState<string[]>([]);

  const trainingScenarios = [
    {
      id: 'machine_startup',
      name: 'Makine Başlatma',
      description: 'Güvenli makine başlatma prosedürü',
      icon: PlayCircle,
      color: 'text-green-600',
      duration: 5,
      steps: [
        'Güvenlik kontrolleri yapın',
        'Ana güç düğmesini açın',
        'Sistem başlatma sekansını takip edin',
        'Parametreleri kontrol edin',
        'Üretim moduna geçin'
      ]
    },
    {
      id: 'emergency_stop',
      name: 'Acil Durdurma',
      description: 'Acil durumda makine durdurma',
      icon: PauseCircle,
      color: 'text-red-600',
      duration: 3,
      steps: [
        'Acil durdurma düğmesine basın',
        'Güvenlik protokollerini uygulayın',
        'Durumu raporlayın'
      ]
    },
    {
      id: 'maintenance_check',
      name: 'Bakım Kontrolü',
      description: 'Rutin bakım kontrol listesi',
      icon: Wrench,
      color: 'text-orange-600',
      duration: 8,
      steps: [
        'Makineyi güvenli durdurma',
        'Yağ seviyelerini kontrol edin',
        'Filtre durumunu inceleyin',
        'Sensör kalibrasyonu yapın',
        'Güvenlik sistemlerini test edin',
        'Temizlik işlemlerini gerçekleştirin',
        'Bakım kaydını güncelleyin',
        'Makineyi yeniden başlatın'
      ]
    },
    {
      id: 'quality_control',
      name: 'Kalite Kontrolü',
      description: 'Ürün kalite kontrol prosedürü',
      icon: Target,
      color: 'text-blue-600',
      duration: 6,
      steps: [
        'Numune alma',
        'Boyut ölçümü',
        'Görsel inceleme',
        'Sızdırmazlık testi',
        'Kalite formunu doldurma',
        'Sonuçları kaydetme'
      ]
    }
  ];

  const startTraining = (scenario: any) => {
    setActiveTraining(scenario);
    setIsTrainingActive(true);
    setCurrentStep(0);
    setTrainingProgress(0);
    onTrainingStart(scenario);
  };

  const nextStep = () => {
    if (currentStep < activeTraining.steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setTrainingProgress(((newStep + 1) / activeTraining.steps.length) * 100);
    } else {
      completeTraining();
    }
  };

  const completeTraining = () => {
    if (activeTraining && !completedTrainings.includes(activeTraining.id)) {
      setCompletedTrainings([...completedTrainings, activeTraining.id]);
    }
    setIsTrainingActive(false);
    setActiveTraining(null);
    setTrainingProgress(0);
    setCurrentStep(0);
  };

  const resetTraining = () => {
    setCurrentStep(0);
    setTrainingProgress(0);
  };

  return (
    <div className="absolute top-80 right-4 z-10">
      <Card className="w-80 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Operatör Eğitimi
              {completedTrainings.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {completedTrainings.length} Tamamlandı
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Active Training Display */}
            {isTrainingActive && activeTraining && (
              <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">{activeTraining.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Adım {currentStep + 1}/{activeTraining.steps.length}
                  </Badge>
                </div>
                
                <Progress value={trainingProgress} className="h-2" />
                
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm font-medium mb-2">Mevcut Adım:</div>
                  <div className="text-sm text-gray-700">
                    {activeTraining.steps[currentStep]}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={nextStep}
                    size="sm" 
                    className="flex-1 text-xs"
                  >
                    {currentStep === activeTraining.steps.length - 1 ? (
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Tamamla
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <SkipForward className="w-3 h-3" />
                        Sonraki Adım
                      </div>
                    )}
                  </Button>
                  <Button 
                    onClick={resetTraining}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    <Reset className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Training Scenarios */}
            {!isTrainingActive && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Eğitim Senaryoları:</span>
                </div>
                
                {trainingScenarios.map((scenario) => {
                  const Icon = scenario.icon;
                  const isCompleted = completedTrainings.includes(scenario.id);
                  
                  return (
                    <div
                      key={scenario.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isCompleted 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => startTraining(scenario)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${scenario.color}`} />
                          <div>
                            <div className="text-sm font-medium flex items-center gap-2">
                              {scenario.name}
                              {isCompleted && <Award className="w-3 h-3 text-green-600" />}
                            </div>
                            <div className="text-xs text-gray-600">{scenario.description}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {scenario.duration} dk
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VR/AR Mode Toggle */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium">Görüntüleme Modu:</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                    3D
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                    VR
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                    AR
                  </Button>
                </div>
              </div>
            </div>

            {/* Training Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="text-green-600 font-medium">Tamamlanan</div>
                <div className="text-green-800 font-bold">{completedTrainings.length}</div>
              </div>
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="text-blue-600 font-medium">Toplam</div>
                <div className="text-blue-800 font-bold">{trainingScenarios.length}</div>
              </div>
              <div className="bg-purple-50 p-2 rounded text-center">
                <div className="text-purple-600 font-medium">Başarı</div>
                <div className="text-purple-800 font-bold">
                  {trainingScenarios.length > 0 ? Math.round((completedTrainings.length / trainingScenarios.length) * 100) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        )}
        
        {!isExpanded && (
          <CardContent className="pt-0 pb-3">
            <div className="text-xs text-gray-600">
              {isTrainingActive ? 'Eğitim devam ediyor...' : 'İnteraktif operatör eğitimi'}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// AI Failure Prediction Panel
const AIFailurePredictionPanel: React.FC<{
  selectedMachine: string | null;
  onPredictionUpdate: (prediction: FailurePrediction | null) => void;
}> = ({ selectedMachine, onPredictionUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prediction, setPrediction] = useState<FailurePrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelMetrics] = useState(() => predictiveMaintenanceAI.getModelMetrics());
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  const runPrediction = async () => {
    if (!selectedMachine) return;
    
    setIsAnalyzing(true);
    
    // Get current machine data
    const machineData = MACHINE_DATA.find(m => m.id === selectedMachine);
    if (!machineData) return;
    
    // Create health data for prediction
    const healthData: MachineHealthData = {
      machineId: selectedMachine,
      timestamp: new Date(),
      temperature: machineData.temperature,
      pressure: machineData.pressure,
      vibration: Math.random() * 10 + 2, // Simulated vibration data
      speed: machineData.speed,
      efficiency: machineData.efficiency,
      cycleCount: Math.floor(Math.random() * 10000) + 5000,
      lastMoldChange: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within 60 days
      operatingHours: Math.floor(Math.random() * 8760) + 1000,
      errorCount: Math.floor(Math.random() * 10),
      maintenanceHistory: []
    };
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = await predictiveMaintenanceAI.predictFailure(selectedMachine, healthData);
      setPrediction(result);
      setLastAnalysis(new Date());
      onPredictionUpdate(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return XCircle;
      case 'high': return AlertCircle;
      case 'medium': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="absolute top-4 left-80 z-10">
      <Card className="w-80 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              AI Arıza Tahmini
              {prediction && (
                <Badge variant="outline" className={`text-xs ${getRiskColor(prediction.riskLevel)}`}>
                  {prediction.riskLevel.toUpperCase()}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Machine Selection & Analysis Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Seçili Makine:</span>
                <Badge variant="outline" className="text-xs">
                  {selectedMachine || 'Seçim yapılmadı'}
                </Badge>
              </div>
              
              <Button 
                onClick={runPrediction}
                disabled={!selectedMachine || isAnalyzing}
                className="w-full h-8 text-xs"
                size="sm"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI Analiz Ediyor...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lightning className="w-3 h-3" />
                    Arıza Tahmini Çalıştır
                  </div>
                )}
              </Button>
            </div>

            {/* Model Performance Metrics */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">ML Model Performansı</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded">
                  <div className="text-blue-600 font-medium">Doğruluk</div>
                  <div className="text-blue-800 font-bold">{(modelMetrics.accuracy * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-blue-600 font-medium">Hassasiyet</div>
                  <div className="text-blue-800 font-bold">{(modelMetrics.precision * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-blue-600 font-medium">Veri Noktası</div>
                  <div className="text-blue-800 font-bold">{modelMetrics.dataPoints.toLocaleString()}</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-blue-600 font-medium">Model Ver.</div>
                  <div className="text-blue-800 font-bold">{modelMetrics.modelVersion}</div>
                </div>
              </div>
            </div>

            {/* Prediction Results */}
            {prediction && (
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Trend className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium">Tahmin Sonuçları</span>
                  {lastAnalysis && (
                    <span className="text-xs text-gray-500">
                      {lastAnalysis.toLocaleTimeString('tr-TR')}
                    </span>
                  )}
                </div>
                
                {/* Risk Assessment */}
                <div className={`p-3 rounded-lg border ${getRiskColor(prediction.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(getRiskIcon(prediction.riskLevel), { className: "w-4 h-4" })}
                      <span className="font-medium text-sm">Risk Seviyesi</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {prediction.riskScore.toFixed(0)}/100
                    </Badge>
                  </div>
                  <Progress value={prediction.riskScore} className="h-2 mb-2" />
                  <div className="text-xs">
                    <div><strong>Arıza Tipi:</strong> {prediction.failureType}</div>
                    <div><strong>Ana Sebep:</strong> {prediction.primaryCause}</div>
                  </div>
                </div>

                {/* Prediction Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-red-50 p-2 rounded border border-red-200">
                    <div className="text-red-600 font-medium flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      Tahmini Arıza
                    </div>
                    <div className="text-red-800 font-bold">
                      {Math.ceil((prediction.predictedFailureTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} gün
                    </div>
                  </div>
                  <div className="bg-orange-50 p-2 rounded border border-orange-200">
                    <div className="text-orange-600 font-medium flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Maliyet Tahmini
                    </div>
                    <div className="text-orange-800 font-bold">
                      ₺{prediction.estimatedCost.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-blue-600 font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Güven Seviyesi
                    </div>
                    <div className="text-blue-800 font-bold">
                      {prediction.confidenceLevel}%
                    </div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded border border-purple-200">
                    <div className="text-purple-600 font-medium flex items-center gap-1">
                      <WrenchIcon className="w-3 h-3" />
                      Etkilenen
                    </div>
                    <div className="text-purple-800 font-bold">
                      {prediction.affectedComponents.length} bileşen
                    </div>
                  </div>
                </div>

                {/* Affected Components */}
                {prediction.affectedComponents.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700">Etkilenen Bileşenler:</div>
                    <div className="flex flex-wrap gap-1">
                      {prediction.affectedComponents.map((component, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    AI Önerileri:
                  </div>
                  {prediction.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>

                {/* Preventive Actions */}
                {prediction.preventiveActions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Önleyici Aksiyonlar:
                    </div>
                    {prediction.preventiveActions.slice(0, 2).map((action, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded border text-xs">
                        <div className="font-medium flex items-center justify-between">
                          <span>{action.action}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              action.priority === 'urgent' ? 'border-red-500 text-red-600' :
                              action.priority === 'high' ? 'border-orange-500 text-orange-600' :
                              action.priority === 'medium' ? 'border-yellow-500 text-yellow-600' :
                              'border-green-500 text-green-600'
                            }`}
                          >
                            {action.priority}
                          </Badge>
                        </div>
                        <div className="text-gray-600 mt-1">
                          <div>Süre: {action.estimatedTime} saat • Maliyet: ₺{action.estimatedCost}</div>
                          <div>Beceri: {action.skillLevel} • Parça: {action.requiredParts.join(', ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
        
        {!isExpanded && (
          <CardContent className="pt-0 pb-3">
            <div className="text-xs text-gray-600">
              {prediction 
                ? `${prediction.riskLevel.toUpperCase()} risk • ${prediction.failureType}`
                : 'Makine öğrenmesi ile arıza tahmini'}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// OEE Analytics Panel
const OEEAnalyticsPanel: React.FC<{
  selectedMachine: string | null;
  onOEEUpdate: (oeeData: ProductionLineOEE | null) => void;
}> = ({ selectedMachine, onOEEUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [oeeData, setOEEData] = useState<ProductionLineOEE | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '4h' | '8h' | '24h'>('4h');
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  const runOEEAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Get all machine IDs for line analysis
      const machineIds = MACHINE_DATA.map(m => m.id);
      const result = oeeAnalyticsService.analyzeProductionLine(machineIds);
      
      setOEEData(result);
      setLastAnalysis(new Date());
      onOEEUpdate(result);
    } catch (error) {
      console.error('OEE Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getEfficiencyIcon = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent': return Excellence;
      case 'good': return ThumbsUp;
      case 'fair': return AlertTriangle;
      default: return ThumbsDown;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendUp;
      case 'declining': return TrendDown;
      default: return TrendStable;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBenchmarkText = (oee: number) => {
    if (oee >= 85) return 'Dünya Standardı';
    if (oee >= 70) return 'İyi Performans';
    if (oee >= 55) return 'Orta Performans';
    return 'Gelişim Gerekli';
  };

  return (
    <div className="absolute bottom-4 left-80 z-10">
      <Card className="w-80 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <BarChart4 className="w-4 h-4 text-indigo-600" />
              OEE Analizi
              {oeeData && (
                <Badge variant="outline" className={`text-xs ${getEfficiencyColor(oeeData.efficiency)}`}>
                  {oeeData.overallOEE.toFixed(1)}%
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Analysis Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Üretim Hattı:</span>
                <Badge variant="outline" className="text-xs">
                  Su Şişesi Hattı
                </Badge>
              </div>
              
              <Button 
                onClick={runOEEAnalysis}
                disabled={isAnalyzing}
                className="w-full h-8 text-xs"
                size="sm"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    OEE Analizi Yapılıyor...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BarChart4 className="w-3 h-3" />
                    Hat Verimliliği Analizi
                  </div>
                )}
              </Button>
            </div>

            {/* Benchmark Information */}
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <TargetIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-medium text-indigo-800">OEE Benchmark Değerleri</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded">
                  <div className="text-green-600 font-medium">Dünya Standardı</div>
                  <div className="text-green-800 font-bold">≥85%</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-blue-600 font-medium">İyi</div>
                  <div className="text-blue-800 font-bold">70-85%</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-yellow-600 font-medium">Orta</div>
                  <div className="text-yellow-800 font-bold">55-70%</div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-red-600 font-medium">Düşük</div>
                  <div className="text-red-800 font-bold">&lt;55%</div>
                </div>
              </div>
            </div>

            {/* OEE Results */}
            {oeeData && (
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <PerformanceIcon className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-medium">Analiz Sonuçları</span>
                  {lastAnalysis && (
                    <span className="text-xs text-gray-500">
                      {lastAnalysis.toLocaleTimeString('tr-TR')}
                    </span>
                  )}
                </div>
                
                {/* Overall OEE Score */}
                <div className={`p-3 rounded-lg border ${getEfficiencyColor(oeeData.efficiency)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(getEfficiencyIcon(oeeData.efficiency), { className: "w-4 h-4" })}
                      <span className="font-medium text-sm">Genel OEE Skoru</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {oeeData.overallOEE.toFixed(1)}%
                      </Badge>
                      {React.createElement(getTrendIcon(oeeData.trend), { 
                        className: `w-3 h-3 ${getTrendColor(oeeData.trend)}` 
                      })}
                    </div>
                  </div>
                  <Progress value={oeeData.overallOEE} className="h-2 mb-2" />
                  <div className="text-xs">
                    <div><strong>Seviye:</strong> {getBenchmarkText(oeeData.overallOEE)}</div>
                    <div><strong>Trend:</strong> {oeeData.trend === 'improving' ? 'İyileşiyor' : 
                                                 oeeData.trend === 'declining' ? 'Düşüyor' : 'Stabil'}</div>
                  </div>
                </div>

                {/* OEE Components */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-blue-600 font-medium flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      Kullanılabilirlik
                    </div>
                    <div className="text-blue-800 font-bold">
                      {oeeData.availability.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    <div className="text-green-600 font-medium flex items-center gap-1">
                      <PerformanceIcon className="w-3 h-3" />
                      Performans
                    </div>
                    <div className="text-green-800 font-bold">
                      {oeeData.performance.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded border border-purple-200">
                    <div className="text-purple-600 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Kalite
                    </div>
                    <div className="text-purple-800 font-bold">
                      {oeeData.quality.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Bottleneck Information */}
                <div className="p-2 bg-orange-50 rounded border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-medium text-orange-800">Darboğaz Makine</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-orange-600">
                      {oeeData.bottleneckMachine}
                    </Badge>
                  </div>
                </div>

                {/* Timeframe Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Tahmin Zaman Dilimi:</label>
                  <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Saat</SelectItem>
                      <SelectItem value="4h">4 Saat</SelectItem>
                      <SelectItem value="8h">8 Saat</SelectItem>
                      <SelectItem value="24h">24 Saat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Predictions */}
                {oeeData.predictions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <Trend className="w-3 h-3" />
                      OEE Tahminleri:
                    </div>
                    {oeeData.predictions
                      .filter(p => p.timeframe === selectedTimeframe)
                      .map((prediction, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded border text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">
                              {prediction.timeframe} - Tahmin OEE
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {prediction.predictedOEE.toFixed(1)}%
                              </Badge>
                              <span className="text-gray-500">
                                ±{prediction.confidence}%
                              </span>
                            </div>
                          </div>
                          <Progress value={prediction.predictedOEE} className="h-1 mb-2" />
                          
                          {/* Impact Factors */}
                          <div className="space-y-1">
                            <div className="text-gray-600 font-medium">Etki Faktörleri:</div>
                            {prediction.factors.slice(0, 2).map((factor, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-gray-600">{factor.factor}</span>
                                <span className={`font-bold ${factor.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {factor.impact >= 0 ? '+' : ''}{factor.impact.toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Recommendations */}
                {oeeData.predictions.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      OEE İyileştirme Önerileri:
                    </div>
                    {oeeData.predictions
                      .find(p => p.timeframe === selectedTimeframe)?.recommendations
                      .slice(0, 3).map((rec, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-start gap-1">
                          <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                          {rec}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
        
        {!isExpanded && (
          <CardContent className="pt-0 pb-3">
            <div className="text-xs text-gray-600">
              {oeeData 
                ? `OEE: ${oeeData.overallOEE.toFixed(1)}% • ${getBenchmarkText(oeeData.overallOEE)}`
                : 'Hat bazında verimlilik analizi (OEE)'}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// Maintenance Recommendation Panel
const MaintenanceRecommendationPanel: React.FC<{
  selectedMachine: string | null;
  onMaintenancePlanUpdate: (plan: MaintenancePlan | null) => void;
}> = ({ selectedMachine, onMaintenancePlanUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maintenancePlan, setMaintenancePlan] = useState<MaintenancePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [selectedTaskType, setSelectedTaskType] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  const generateMaintenancePlan = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate plan generation delay
      await new Promise(resolve => setTimeout(resolve, 2800));
      
      // Get all machine IDs for maintenance planning
      const machineIds = MACHINE_DATA.map(m => m.id);
      const result = maintenanceRecommendationSystem.createMaintenancePlan(machineIds, selectedTimeframe);
      
      setMaintenancePlan(result);
      setLastGenerated(new Date());
      onMaintenancePlanUpdate(result);
    } catch (error) {
      console.error('Maintenance plan generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return UrgentIcon;
      case 'high': return WarningIcon;
      case 'medium': return TimeIcon;
      default: return SuccessIcon;
    }
  };

  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType) {
      case 'emergency': return UrgentIcon;
      case 'predictive': return Brain;
      case 'preventive': return SafetyIcon;
      default: return MaintenanceIcon;
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'emergency': return 'text-red-600';
      case 'predictive': return 'text-purple-600';
      case 'preventive': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getFilteredTasks = () => {
    if (!maintenancePlan) return [];
    
    if (selectedTaskType === 'all') return maintenancePlan.tasks;
    return maintenancePlan.tasks.filter(task => task.priority === selectedTaskType);
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case 'week': return 'Haftalık';
      case 'month': return 'Aylık';
      case 'quarter': return 'Üç Aylık';
      default: return 'Aylık';
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <Card className="w-80 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MaintenanceIcon className="w-4 h-4 text-orange-600" />
              Bakım Önerileri
              {maintenancePlan && (
                <Badge variant="outline" className="text-xs">
                  {maintenancePlan.tasks.length} görev
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Plan Generation Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Plan Periyodu:</span>
                <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
                  <SelectTrigger className="w-24 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Hafta</SelectItem>
                    <SelectItem value="month">Ay</SelectItem>
                    <SelectItem value="quarter">Çeyrek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generateMaintenancePlan}
                disabled={isGenerating}
                className="w-full h-8 text-xs"
                size="sm"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Plan Oluşturuluyor...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-3 h-3" />
                    Bakım Planı Oluştur
                  </div>
                )}
              </Button>
            </div>

            {/* Plan Overview */}
            {maintenancePlan && (
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium">Plan Özeti</span>
                  {lastGenerated && (
                    <span className="text-xs text-gray-500">
                      {lastGenerated.toLocaleTimeString('tr-TR')}
                    </span>
                  )}
                </div>
                
                {/* Plan Summary */}
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-orange-800">
                      {getTimeframeText(maintenancePlan.period)} Bakım Planı
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {maintenancePlan.machines.length} makine
                    </Badge>
                  </div>
                  <div className="text-xs text-orange-700">
                    <div><strong>Plan ID:</strong> {maintenancePlan.planId.slice(-8)}</div>
                    <div><strong>Risk Azalması:</strong> %{maintenancePlan.riskReduction}</div>
                  </div>
                </div>

                {/* Plan Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-blue-600 font-medium flex items-center gap-1">
                      <TimeIcon className="w-3 h-3" />
                      Toplam Süre
                    </div>
                    <div className="text-blue-800 font-bold">
                      {maintenancePlan.totalDuration} saat
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    <div className="text-green-600 font-medium flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Toplam Maliyet
                    </div>
                    <div className="text-green-800 font-bold">
                      ₺{maintenancePlan.totalCost.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Task Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Görev Filtresi:</label>
                  <Select value={selectedTaskType} onValueChange={(value: any) => setSelectedTaskType(value)}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Görevler</SelectItem>
                      <SelectItem value="critical">Kritik</SelectItem>
                      <SelectItem value="high">Yüksek</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Maintenance Tasks */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <ClipboardList className="w-3 h-3" />
                    Bakım Görevleri ({getFilteredTasks().length}):
                  </div>
                  {getFilteredTasks().slice(0, 5).map((task, index) => (
                    <div key={index} className={`p-2 rounded border text-xs ${getPriorityColor(task.priority)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {React.createElement(getPriorityIcon(task.priority), { className: "w-3 h-3" })}
                          <span className="font-medium">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {React.createElement(getTaskTypeIcon(task.taskType), { 
                            className: `w-3 h-3 ${getTaskTypeColor(task.taskType)}` 
                          })}
                          <Badge variant="outline" className="text-xs">
                            {task.machineId}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-xs opacity-90 mb-2">
                        {task.description}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Süre:</span> {task.estimatedDuration}h
                        </div>
                        <div>
                          <span className="font-medium">Maliyet:</span> ₺{task.estimatedCost}
                        </div>
                        <div>
                          <span className="font-medium">Tarih:</span> {task.scheduledDate.toLocaleDateString('tr-TR')}
                        </div>
                        <div>
                          <span className="font-medium">Risk:</span> %{task.riskLevel}
                        </div>
                      </div>
                      
                      {task.requiredParts.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                          <div className="flex items-center gap-1 mb-1">
                            <Package2 className="w-3 h-3" />
                            <span className="font-medium">Gerekli Parçalar:</span>
                          </div>
                          <div className="text-xs opacity-75">
                            {task.requiredParts.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {getFilteredTasks().length > 5 && (
                    <div className="text-center text-xs text-gray-500 py-2">
                      +{getFilteredTasks().length - 5} görev daha...
                    </div>
                  )}
                </div>

                {/* KPIs */}
                {maintenancePlan.kpis.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <ImprovementIcon className="w-3 h-3" />
                      Bakım KPI'ları:
                    </div>
                    {maintenancePlan.kpis.slice(0, 2).map((kpi, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded border text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{kpi.metric}</span>
                          <span className={`font-bold ${kpi.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {kpi.improvement >= 0 ? '+' : ''}{kpi.improvement.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-gray-600 mt-1">
                          Mevcut: {kpi.current} {kpi.unit} → Hedef: {kpi.target} {kpi.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    Plan Önerileri:
                  </div>
                  {maintenancePlan.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
        
        {!isExpanded && (
          <CardContent className="pt-0 pb-3">
            <div className="text-xs text-gray-600">
              {maintenancePlan 
                ? `${maintenancePlan.tasks.length} görev • ₺${maintenancePlan.totalCost.toLocaleString()}`
                : 'Proaktif bakım planı oluşturucu'}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// What-If Analysis Panel
const WhatIfAnalysisPanel: React.FC<{
  selectedMachine: string | null;
  onAnalysisRun: (scenario: any) => void;
}> = ({ selectedMachine, onAnalysisRun }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [impactLevel, setImpactLevel] = useState([50]);

  const scenarios = [
    {
      id: 'maintenance_delay',
      name: 'Bakım Gecikmesi',
      description: 'Planlı bakım 2 saat gecikirse ne olur?',
      icon: Wrench,
      color: 'text-orange-600'
    },
    {
      id: 'machine_breakdown',
      name: 'Makine Arızası',
      description: 'Ana makine 4 saat arızalanırsa?',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: 'capacity_increase',
      name: 'Kapasite Artışı',
      description: 'Üretim kapasitesi %30 artırılırsa?',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      id: 'efficiency_drop',
      name: 'Verimlilik Düşüşü',
      description: 'Makine verimliliği %20 düşerse?',
      icon: TrendingDown,
      color: 'text-blue-600'
    }
  ];

  const runAnalysis = async () => {
    if (!selectedScenario) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock analysis results
    const mockResults = {
      scenario: selectedScenario,
      impactLevel: impactLevel[0],
      predictions: {
        productionLoss: Math.floor(Math.random() * 20 + 5),
        costImpact: Math.floor(Math.random() * 50000 + 10000),
        timeToRecover: Math.floor(Math.random() * 8 + 2),
        affectedMachines: Math.floor(Math.random() * 3 + 1)
      },
      recommendations: [
        'Yedek makine devreye alınmalı',
        'Acil bakım ekibi çağrılmalı',
        'Üretim planı yeniden düzenlenmeli'
      ]
    };
    
    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
    onAnalysisRun(mockResults);
  };

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Card className="w-96 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              What-If Analizi
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Scenario Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Senaryo Seçin:</label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Analiz senaryosu seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => {
                    const Icon = scenario.icon;
                    return (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3 h-3 ${scenario.color}`} />
                          <span className="text-xs">{scenario.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Impact Level Slider */}
            {selectedScenario && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">
                  Etki Seviyesi: {impactLevel[0]}%
                </label>
                <Slider
                  value={impactLevel}
                  onValueChange={setImpactLevel}
                  max={100}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
            )}

            {/* Run Analysis Button */}
            <Button 
              onClick={runAnalysis}
              disabled={!selectedScenario || isAnalyzing}
              className="w-full h-8 text-xs"
              size="sm"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analiz Ediliyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3" />
                  Analizi Başlat
                </div>
              )}
            </Button>

            {/* Analysis Results */}
            {analysisResults && (
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs font-medium">Analiz Sonuçları</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-red-600 font-medium">Üretim Kaybı</div>
                    <div className="text-red-800">{analysisResults.predictions.productionLoss}%</div>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <div className="text-orange-600 font-medium">Maliyet Etkisi</div>
                    <div className="text-orange-800">₺{analysisResults.predictions.costImpact.toLocaleString()}</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-blue-600 font-medium">Toparlanma</div>
                    <div className="text-blue-800">{analysisResults.predictions.timeToRecover} saat</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-purple-600 font-medium">Etkilenen</div>
                    <div className="text-purple-800">{analysisResults.predictions.affectedMachines} makine</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700">Öneriler:</div>
                  {analysisResults.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
        
        {!isExpanded && (
          <CardContent className="pt-0 pb-3">
            <div className="text-xs text-gray-600">
              Senaryo analizi • Tahmine dayalı modelleme
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// Collapsible AI Insights Panel
const CollapsibleAIInsights: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [insights] = useState([
    {
      type: 'success',
      message: 'Enjeksiyon makinesi optimal verimde çalışıyor (%94)',
      timestamp: new Date().toLocaleTimeString('tr-TR')
    },
    {
      type: 'warning', 
      message: 'Etiketleme hattı 15 dakikadır beklemede',
      timestamp: new Date().toLocaleTimeString('tr-TR')
    },
    {
      type: 'info',
      message: 'Paketleme makinesi bakım programına alındı',
      timestamp: new Date().toLocaleTimeString('tr-TR')
    }
  ]);

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <Card className="w-80 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              AI Öngörüler
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  insight.type === 'success' ? 'bg-green-500' :
                  insight.type === 'warning' ? 'bg-yellow-500' :
                  insight.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs leading-relaxed">{insight.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{insight.timestamp}</div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
        
        {!isExpanded && (
          <CardContent className="pt-0 pb-3">
            <div className="text-xs text-gray-600">
              {insights.length} aktif öngörü • Detaylar için tıklayın
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// Compact Machine List
const CompactMachineList: React.FC<{ 
  selectedMachine: string | null;
  onMachineSelect: (id: string) => void;
}> = ({ selectedMachine, onMachineSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-10">
      <Card className="w-64 bg-white/95 backdrop-blur-sm">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Makine Listesi</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {isExpanded ? (
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {MACHINE_DATA.map((machine) => (
              <div
                key={machine.id}
                className={`p-2 rounded-lg border cursor-pointer transition-all text-xs ${
                  selectedMachine === machine.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onMachineSelect(machine.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{machine.name}</div>
                    <div className="text-gray-600">{machine.id}</div>
                  </div>
                  <Badge 
                    variant={
                      machine.status === 'running' ? 'default' :
                      machine.status === 'idle' ? 'secondary' :
                      machine.status === 'maintenance' ? 'outline' : 'destructive'
                    }
                    className="text-xs ml-2 flex-shrink-0"
                  >
                    {machine.status === 'running' ? 'Çalışıyor' :
                     machine.status === 'idle' ? 'Beklemede' :
                     machine.status === 'maintenance' ? 'Bakımda' : 'Hata'}
                  </Badge>
                </div>
                {machine.status === 'running' && (
                  <div className="mt-1 text-gray-600">
                    Verimlilik: {machine.efficiency}%
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        ) : (
          <CardContent className="pt-0 pb-3">
            <div className="text-xs text-gray-600">
              {MACHINE_DATA.length} makine • {MACHINE_DATA.filter(m => m.status === 'running').length} çalışıyor
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// Main Digital Twin Component - Optimized for main page
const DigitalTwin3D: React.FC = () => {
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  // Training System State
  const [trainingHighlight, setTrainingHighlight] = useState<string | null>(null);
  const [activeTrainingScenario, setActiveTrainingScenario] = useState<any>(null);
  
  // AI Prediction State
  const [currentPrediction, setCurrentPrediction] = useState<FailurePrediction | null>(null);
  
  // OEE Analytics State
  const [currentOEE, setCurrentOEE] = useState<ProductionLineOEE | null>(null);
  
  // Maintenance Plan State
  const [currentMaintenancePlan, setCurrentMaintenancePlan] = useState<MaintenancePlan | null>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setSelectedMachine(null);
    setIsPlaying(false);
    setAnalysisResults(null);
    setTrainingHighlight(null);
    setActiveTrainingScenario(null);
    setCurrentPrediction(null);
    setCurrentOEE(null);
    setCurrentMaintenancePlan(null);
    // Simülasyonu sıfırla
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };

  const handleAnalysisRun = (results: any) => {
    setAnalysisResults(results);
  };

  const handleTrainingStart = (scenario: any) => {
    setActiveTrainingScenario(scenario);
    // Highlight relevant machines based on training scenario
    if (scenario.id === 'machine_startup' || scenario.id === 'emergency_stop') {
      setTrainingHighlight(selectedMachine || 'INJ001');
    } else if (scenario.id === 'maintenance_check') {
      setTrainingHighlight('PKG004'); // Maintenance machine
    } else if (scenario.id === 'quality_control') {
      setTrainingHighlight('LBL003'); // Quality control station
    }
  };

  const handlePredictionUpdate = (prediction: FailurePrediction | null) => {
    setCurrentPrediction(prediction);
  };

  const handleOEEUpdate = (oeeData: ProductionLineOEE | null) => {
    setCurrentOEE(oeeData);
  };

  const handleMaintenancePlanUpdate = (plan: MaintenancePlan | null) => {
    setCurrentMaintenancePlan(plan);
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [15, 10, 15], fov: 50 }}
        shadows
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a202c');
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <Scene 
            selectedMachine={selectedMachine}
            onMachineSelect={setSelectedMachine}
            isPlaying={isPlaying}
            analysisResults={analysisResults}
            trainingHighlight={trainingHighlight}
            activeTrainingScenario={activeTrainingScenario}
            currentPrediction={currentPrediction}
            currentOEE={currentOEE}
            currentMaintenancePlan={currentMaintenancePlan}
          />
        </Suspense>
      </Canvas>
      
      {/* Compact UI Panels */}
      <MaintenanceRecommendationPanel
        selectedMachine={selectedMachine}
        onMaintenancePlanUpdate={handleMaintenancePlanUpdate}
      />
      
      <AIFailurePredictionPanel
        selectedMachine={selectedMachine}
        onPredictionUpdate={handlePredictionUpdate}
      />
      
      <CompactControlPanel
        selectedMachine={selectedMachine}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
      />
      
      <CompactMachineList
        selectedMachine={selectedMachine}
        onMachineSelect={setSelectedMachine}
      />
      
      <OperatorTrainingPanel
        selectedMachine={selectedMachine}
        onTrainingStart={handleTrainingStart}
        isPlaying={isPlaying}
      />
      
      <OEEAnalyticsPanel
        selectedMachine={selectedMachine}
        onOEEUpdate={handleOEEUpdate}
      />
      
      <CollapsibleAIInsights />
      
      <WhatIfAnalysisPanel
        selectedMachine={selectedMachine}
        onAnalysisRun={handleAnalysisRun}
      />
    </div>
  );
};

export default DigitalTwin3D; 