import React, { useEffect, useState, useRef } from 'react';
import { useDigitalTwinStore } from '../lib/store';
import { FactoryDiagramGenerator } from '../lib/factoryDiagram';
import { RefreshCw, Download, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

const DigitalTwin3D: React.FC = () => {
  const { machines } = useDigitalTwinStore();
  const [svgContent, setSvgContent] = useState<string>('');
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(0.8); // Başlangıç zoom'u daha küçük
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const generateDiagram = async () => {
    setIsLoading(true);
    try {
      const svg = await FactoryDiagramGenerator.generateSVG(machines);
      setSvgContent(svg);
      
      if (svgUrl) {
        URL.revokeObjectURL(svgUrl);
      }
      
      const newUrl = FactoryDiagramGenerator.createBlobURL(svg);
      setSvgUrl(newUrl);
    } catch (error) {
      console.error('Diagram generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateDiagram();
    const interval = setInterval(generateDiagram, 8000); // 8 saniyede bir güncelle
    
    return () => {
      clearInterval(interval);
      if (svgUrl) {
        URL.revokeObjectURL(svgUrl);
      }
    };
  }, [machines]);

  const handleDownload = () => {
    if (!svgContent) return;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fabrika-semasi-${new Date().toISOString().slice(0, 10)}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.15, 2.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.15, 0.3));
  };

  const handleZoomReset = () => {
    setZoom(0.8);
    setPanX(0);
    setPanY(0);
  };

  const handleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else if (isFullscreen) {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Mouse drag için event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.3, Math.min(2.5, prev + delta)));
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const runningMachines = machines.filter(m => m.status === 'running').length;
  const totalMachines = machines.length;
  const averageEfficiency = machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length;
  const totalProduction = machines.reduce((sum, m) => sum + m.totalProduction, 0);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-lg border border-slate-200 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white rounded-none' : ''
      }`}
    >
      {/* Modern Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-bold text-slate-800">Fabrika Şeması</h3>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">{runningMachines}/{totalMachines}</span>
              </div>
              <div className="text-slate-400">•</div>
              <span className="font-medium">%{averageEfficiency.toFixed(1)} Verim</span>
              <div className="text-slate-400">•</div>
              <span className="font-medium">{totalProduction.toLocaleString('tr-TR')} Adet</span>
            </div>
          </div>
          
          {/* Modern Control Panel */}
          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-md transition-all duration-200 shadow-sm"
              title="Uzaklaştır"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <div className="px-3 py-2 text-sm font-medium text-slate-700 bg-white rounded-md shadow-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            
            <button
              onClick={handleZoomIn}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-md transition-all duration-200 shadow-sm"
              title="Yakınlaştır"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-slate-300 mx-1"></div>
            
            <button
              onClick={handleZoomReset}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-md transition-all duration-200 shadow-sm"
              title="Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={generateDiagram}
              disabled={isLoading}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-md transition-all duration-200 shadow-sm disabled:opacity-50"
              title="Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={handleFullscreen}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-md transition-all duration-200 shadow-sm"
              title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleDownload}
              disabled={!svgContent}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-md transition-all duration-200 shadow-sm disabled:opacity-50"
              title="İndir"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 relative overflow-hidden bg-slate-50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-20">
            <div className="flex flex-col items-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-slate-700 font-medium">Şema güncelleniyor...</span>
            </div>
          </div>
        )}

        {svgUrl ? (
          <div 
            ref={viewerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div
              className="transform-gpu transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              <iframe
                ref={iframeRef}
                src={svgUrl}
                className="border-0 pointer-events-none"
                style={{
                  width: '1200px',
                  height: '700px',
                  display: 'block',
                  margin: '50px auto'
                }}
                title="Fabrika Şeması"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
              </div>
              <p className="font-medium">Fabrika şeması hazırlanıyor...</p>
            </div>
          </div>
        )}
      </div>

      {/* Modern Status Bar */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-slate-200 px-6 py-3 rounded-b-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 font-medium">Canlı Veri</span>
            </div>
            <span className="text-slate-500">
              {new Date().toLocaleTimeString('tr-TR')}
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-slate-600">
            <span className="font-medium">
              ⚡ {machines.reduce((sum, m) => sum + m.energyConsumption, 0).toFixed(1)} kW
            </span>
            <span className="font-medium">
              📊 OEE: %{((averageEfficiency / 100) * 0.85 * 0.95 * 100).toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">
              Yakınlaştır: Mouse wheel • Sürükle: Sol tık
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin3D; 