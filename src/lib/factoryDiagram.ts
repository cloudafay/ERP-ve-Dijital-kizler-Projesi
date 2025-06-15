import { MachineStatus } from './store';

export interface DiagramNode {
  id: string;
  label: string;
  type: 'machine' | 'flow' | 'storage' | 'control';
  status: 'running' | 'stopped' | 'maintenance' | 'error';
  position: { x: number; y: number };
}

export class FactoryDiagramGenerator {
  
  static generateDOT(machines: MachineStatus[]): string {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'running': return '#22c55e'; // green
        case 'maintenance': return '#f59e0b'; // amber
        case 'error': return '#ef4444'; // red
        case 'stopped': return '#6b7280'; // gray
        default: return '#6b7280';
      }
    };

    const getStatusStyle = (status: string) => {
      switch (status) {
        case 'running': return 'filled,bold';
        case 'maintenance': return 'filled,dashed';
        case 'error': return 'filled,bold';
        case 'stopped': return 'filled';
        default: return 'filled';
      }
    };

    const dot = `
digraph FactoryLayout {
  // Graph settings
  rankdir=LR;
  bgcolor="transparent";
  node [fontname="Arial", fontsize=10, style=filled];
  edge [fontname="Arial", fontsize=8, color="#64748b"];
  
  // Subgraph for better layout
  subgraph cluster_factory {
    label="Su Şişesi Üretim Hattı";
    style=rounded;
    bgcolor="#f8fafc";
    fontsize=14;
    fontname="Arial Bold";
    
    // Raw materials
    raw_material [
      label="Ham Madde\\nPET Granül",
      shape=box,
      style=filled,
      fillcolor="#e2e8f0",
      fontcolor="black"
    ];
    
    // Machines
    ${machines.map(machine => `
    ${machine.id.replace('-', '_')} [
      label="${machine.name}\\n${machine.efficiency.toFixed(1)}% verimlilik\\n${machine.temperature.toFixed(1)}°C",
      shape=${machine.type === 'injection' ? 'hexagon' : 
             machine.type === 'blowing' ? 'ellipse' : 
             machine.type === 'labeling' ? 'box' : 'trapezium'},
      style="${getStatusStyle(machine.status)}",
      fillcolor="${getStatusColor(machine.status)}",
      fontcolor="white",
      penwidth=2
    ];`).join('')}
    
    // Storage and control points
    preform_storage [
      label="Preform\\nDepolama",
      shape=cylinder,
      style=filled,
      fillcolor="#cbd5e1",
      fontcolor="black"
    ];
    
    bottle_storage [
      label="Şişe\\nDepolama",
      shape=cylinder,
      style=filled,
      fillcolor="#cbd5e1",
      fontcolor="black"
    ];
    
    quality_control [
      label="Kalite\\nKontrol",
      shape=diamond,
      style=filled,
      fillcolor="#7c3aed",
      fontcolor="white"
    ];
    
    final_product [
      label="Paketlenmiş\\nÜrün",
      shape=folder,
      style=filled,
      fillcolor="#059669",
      fontcolor="white"
    ];
    
    // Control room
    control_room [
      label="Kontrol Merkezi\\nDijital İkiz",
      shape=house,
      style=filled,
      fillcolor="#1e40af",
      fontcolor="white"
    ];
  }
  
  // Flow connections
  raw_material -> ${machines.find(m => m.type === 'injection')?.id.replace('-', '_') || 'machine_001'} [
    label="PET Granül",
    color="#64748b"
  ];
  
  ${machines.find(m => m.type === 'injection')?.id.replace('-', '_') || 'machine_001'} -> preform_storage [
    label="Preformlar",
    color="#22c55e"
  ];
  
  preform_storage -> ${machines.find(m => m.type === 'blowing')?.id.replace('-', '_') || 'machine_002'} [
    label="Preform Besleme",
    color="#3b82f6"
  ];
  
  ${machines.find(m => m.type === 'blowing')?.id.replace('-', '_') || 'machine_002'} -> bottle_storage [
    label="Şişeler",
    color="#22c55e"
  ];
  
  bottle_storage -> ${machines.find(m => m.type === 'labeling')?.id.replace('-', '_') || 'machine_003'} [
    label="Etiketleme",
    color="#8b5cf6"
  ];
  
  ${machines.find(m => m.type === 'labeling')?.id.replace('-', '_') || 'machine_003'} -> quality_control [
    label="Kalite Kontrol",
    color="#f59e0b"
  ];
  
  quality_control -> ${machines.find(m => m.type === 'packaging')?.id.replace('-', '_') || 'machine_004'} [
    label="Onaylandı",
    color="#22c55e"
  ];
  
  ${machines.find(m => m.type === 'packaging')?.id.replace('-', '_') || 'machine_004'} -> final_product [
    label="Paketlenmiş",
    color="#059669"
  ];
  
  // Control connections (dashed lines)
  ${machines.map(machine => `
  control_room -> ${machine.id.replace('-', '_')} [
    style=dashed,
    color="#1e40af",
    label="IoT",
    fontsize=6
  ];`).join('')}
  
  // Legend
  subgraph cluster_legend {
    label="Durum Göstergeleri";
    style=rounded;
    bgcolor="#ffffff";
    fontsize=12;
    
    legend_running [label="Çalışıyor", style=filled, fillcolor="#22c55e", fontcolor="white", shape=box];
    legend_maintenance [label="Bakımda", style="filled,dashed", fillcolor="#f59e0b", fontcolor="white", shape=box];
    legend_error [label="Hata", style=filled, fillcolor="#ef4444", fontcolor="white", shape=box];
    legend_stopped [label="Durduruldu", style=filled, fillcolor="#6b7280", fontcolor="white", shape=box];
    
    {rank=same; legend_running; legend_maintenance; legend_error; legend_stopped;}
  }
}`;

    return dot;
  }

  static async generateSVG(machines: MachineStatus[]): Promise<string> {
    const dot = this.generateDOT(machines);
    
    // Graphviz-viz kullanarak DOT'u SVG'ye çevir
    try {
      // Burada normalde bir Graphviz API'si kullanılır
      // Şimdilik statik bir SVG template döndürüyoruz
      return this.generateStaticSVG(machines);
    } catch (error) {
      console.error('Graphviz generation failed:', error);
      return this.generateStaticSVG(machines);
    }
  }

  private static generateStaticSVG(machines: MachineStatus[]): string {
    const width = 1200;
    const height = 700;
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'running': return '#22c55e';
        case 'maintenance': return '#f59e0b';
        case 'error': return '#ef4444';
        case 'stopped': return '#6b7280';
        default: return '#6b7280';
      }
    };

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
    </marker>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" rx="10"/>
  
  <!-- Title -->
  <text x="${width/2}" y="35" text-anchor="middle" font-family="Arial" font-size="28" font-weight="bold" fill="#1e293b">
    Su Şişesi Üretim Hattı - Dijital İkiz Sistemi
  </text>
  
  <!-- Raw Material -->
  <rect x="60" y="90" width="130" height="70" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3" rx="8" filter="url(#shadow)"/>
  <text x="125" y="115" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#475569">Ham Madde</text>
  <text x="125" y="135" text-anchor="middle" font-family="Arial" font-size="12" fill="#64748b">PET Granül Deposu</text>
  
  <!-- Machines -->
  ${machines.map((machine, index) => {
    const x = 250 + (index * 180);
    const y = 90;
    const color = getStatusColor(machine.status);
    
    let shape = '';
    if (machine.type === 'injection') {
      shape = `<polygon points="${x+20},${y} ${x+100},${y} ${x+120},${y+30} ${x+100},${y+60} ${x+20},${y+60} ${x},${y+30}" fill="${color}" stroke="#fff" stroke-width="3" filter="url(#shadow)"/>`;
    } else if (machine.type === 'blowing') {
      shape = `<ellipse cx="${x+60}" cy="${y+30}" rx="60" ry="30" fill="${color}" stroke="#fff" stroke-width="3" filter="url(#shadow)"/>`;
    } else {
      shape = `<rect x="${x}" y="${y}" width="120" height="60" fill="${color}" stroke="#fff" stroke-width="3" rx="8" filter="url(#shadow)"/>`;
    }
    
    return `
    ${shape}
    <text x="${x+60}" y="${y+20}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">${machine.name}</text>
    <text x="${x+60}" y="${y+35}" text-anchor="middle" font-family="Arial" font-size="10" fill="white">%${machine.efficiency.toFixed(1)} verimli</text>
    <text x="${x+60}" y="${y+48}" text-anchor="middle" font-family="Arial" font-size="10" fill="white">${machine.temperature.toFixed(1)}°C</text>
    `;
  }).join('')}
  
  <!-- Storage -->
  <ellipse cx="130" cy="250" rx="60" ry="35" fill="#cbd5e1" stroke="#94a3b8" stroke-width="3" filter="url(#shadow)"/>
  <text x="130" y="245" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#475569">Preform</text>
  <text x="130" y="260" text-anchor="middle" font-family="Arial" font-size="10" fill="#475569">Depolama</text>
  
  <ellipse cx="530" cy="250" rx="60" ry="35" fill="#cbd5e1" stroke="#94a3b8" stroke-width="3" filter="url(#shadow)"/>
  <text x="530" y="245" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#475569">Şişe</text>
  <text x="530" y="260" text-anchor="middle" font-family="Arial" font-size="10" fill="#475569">Depolama</text>
  
  <!-- Quality Control -->
  <polygon points="830,210 880,225 830,240 780,225" fill="#7c3aed" stroke="#fff" stroke-width="3" filter="url(#shadow)"/>
  <text x="830" y="223" text-anchor="middle" font-family="Arial" font-size="11" font-weight="bold" fill="white">Kalite</text>
  <text x="830" y="235" text-anchor="middle" font-family="Arial" font-size="9" fill="white">Kontrol</text>
  
  <!-- Final Product -->
  <rect x="950" y="200" width="100" height="50" fill="#059669" stroke="#fff" stroke-width="3" rx="8" filter="url(#shadow)"/>
  <text x="1000" y="220" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">Paketlenmiş</text>
  <text x="1000" y="235" text-anchor="middle" font-family="Arial" font-size="10" fill="white">Ürün</text>
  
  <!-- Control Room -->
  <polygon points="500,350 600,350 625,390 475,390" fill="#1e40af" stroke="#fff" stroke-width="3" filter="url(#shadow)"/>
  <text x="550" y="365" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">Kontrol Merkezi</text>
  <text x="550" y="380" text-anchor="middle" font-family="Arial" font-size="10" fill="white">Dijital İkiz AI</text>
  
  <!-- Flow arrows -->
  <line x1="190" y1="125" x2="240" y2="125" stroke="#64748b" stroke-width="3" marker-end="url(#arrowhead)"/>
  <text x="215" y="115" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="#64748b">Ham Madde</text>
  
  ${machines.map((machine, index) => {
    if (index < machines.length - 1) {
      const x1 = 370 + (index * 180);
      const x2 = 250 + ((index + 1) * 180);
      return `<line x1="${x1}" y1="120" x2="${x2}" y2="120" stroke="#22c55e" stroke-width="3" marker-end="url(#arrowhead)"/>`;
    }
    return '';
  }).join('')}
  
  <!-- Final machine to quality control -->
  <line x1="${370 + ((machines.length - 1) * 180)}" y1="120" x2="780" y2="225" stroke="#22c55e" stroke-width="3" marker-end="url(#arrowhead)"/>
  
  <!-- Quality control to final product -->
  <line x1="880" y1="225" x2="940" y2="225" stroke="#059669" stroke-width="3" marker-end="url(#arrowhead)"/>
  <text x="910" y="215" text-anchor="middle" font-family="Arial" font-size="10" fill="#059669">Onaylandı</text>
  
  <!-- Storage connections -->
  <line x1="310" y1="150" x2="160" y2="215" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowhead)" stroke-dasharray="6,4"/>
  <text x="235" y="180" text-anchor="middle" font-family="Arial" font-size="9" fill="#3b82f6">Preform</text>
  
  <line x1="160" y1="285" x2="430" y2="150" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowhead)" stroke-dasharray="6,4"/>
  <text x="295" y="220" text-anchor="middle" font-family="Arial" font-size="9" fill="#3b82f6">Şişirme İçin</text>
  
  <line x1="610" y1="150" x2="470" y2="215" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowhead)" stroke-dasharray="6,4"/>
  <text x="540" y="180" text-anchor="middle" font-family="Arial" font-size="9" fill="#8b5cf6">Şişe Stok</text>
  
  <line x1="470" y1="285" x2="790" y2="150" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowhead)" stroke-dasharray="6,4"/>
  <text x="630" y="220" text-anchor="middle" font-family="Arial" font-size="9" fill="#8b5cf6">Paketleme İçin</text>
  
  <!-- Control connections -->
  ${machines.map((machine, index) => {
    const x = 310 + (index * 180);
    return `<line x1="550" y1="350" x2="${x}" y2="150" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="4,3"/>`;
  }).join('')}
  
  <!-- Legend -->
  <rect x="50" y="450" width="600" height="120" fill="white" stroke="#e2e8f0" stroke-width="2" rx="10"/>
  <text x="70" y="475" font-family="Arial" font-size="14" font-weight="bold" fill="#1e293b">📊 Sistem Durumu</text>
  
  <!-- Status indicators -->
  <rect x="70" y="490" width="15" height="15" fill="#22c55e" rx="2"/>
  <text x="90" y="502" font-family="Arial" font-size="11" fill="#1e293b">Çalışıyor</text>
  
  <rect x="70" y="510" width="15" height="15" fill="#f59e0b" rx="2"/>
  <text x="90" y="522" font-family="Arial" font-size="11" fill="#1e293b">Bakımda</text>
  
  <rect x="70" y="530" width="15" height="15" fill="#ef4444" rx="2"/>
  <text x="90" y="542" font-family="Arial" font-size="11" fill="#1e293b">Hata</text>
  
  <rect x="170" y="490" width="15" height="15" fill="#6b7280" rx="2"/>
  <text x="190" y="502" font-family="Arial" font-size="11" fill="#1e293b">Durduruldu</text>
  
  <!-- Real-time data -->
  <text x="300" y="490" font-family="Arial" font-size="11" font-weight="bold" fill="#1e293b">📈 Üretim: ${machines.reduce((sum, m) => sum + m.totalProduction, 0).toLocaleString('tr-TR')} adet</text>
  <text x="300" y="505" font-family="Arial" font-size="11" fill="#1e293b">🏭 Aktif: ${machines.filter(m => m.status === 'running').length}/${machines.length} makine</text>
  <text x="300" y="520" font-family="Arial" font-size="11" fill="#1e293b">⚡ Güç: ${machines.reduce((sum, m) => sum + m.energyConsumption, 0).toFixed(1)} kW</text>
  <text x="300" y="535" font-family="Arial" font-size="11" fill="#1e293b">📊 OEE: %${((machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length) * 0.85 * 0.95).toFixed(1)}</text>
  <text x="300" y="550" font-family="Arial" font-size="11" fill="#1e293b">🕒 ${new Date().toLocaleTimeString('tr-TR')}</text>
</svg>`;

    return svg;
  }

  static createBlobURL(svg: string): string {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  }
} 