import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  Settings, 
  Maximize2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { DashboardWidget as WidgetType, cloudDashboard } from '../../services/cloudDashboard';

interface DashboardWidgetProps {
  widget: WidgetType;
  onEdit?: (widget: WidgetType) => void;
  onDelete?: (widgetId: string) => void;
  isEditing?: boolean;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  onEdit,
  onDelete,
  isEditing = false
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadWidgetData();
    
    // Auto-refresh based on widget config
    const interval = setInterval(() => {
      loadWidgetData();
    }, widget.config.refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [widget]);

  const generateMockData = (widget: WidgetType) => {
    switch (widget.type) {
      case 'chart':
        return Array.from({ length: 10 }, (_, i) => ({
          timestamp: new Date(Date.now() - (9 - i) * 60000),
          value: Math.random() * 100 + 50,
          machineId: `Machine-${Math.floor(Math.random() * 3) + 1}`
        }));
      
      case 'gauge':
      case 'metric':
        return [{
          id: widget.id,
          name: widget.title,
          value: Math.random() * 100,
          unit: widget.id.includes('production') ? 'adet/saat' : widget.id.includes('efficiency') ? '%' : 'kW',
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
          change: (Math.random() - 0.5) * 20,
          timestamp: new Date(),
          category: 'production' as const
        }];
      
      case 'heatmap':
        return Array.from({ length: 12 }, (_, i) => ({
          machineId: `Machine-${i + 1}`,
          status: ['online', 'offline', 'maintenance'][Math.floor(Math.random() * 3)],
          efficiency: Math.random() * 100,
          temperature: Math.random() * 50 + 20
        }));
      
      case 'table':
        return Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          machine: `Makine ${i + 1}`,
          status: ['Aktif', 'Durduruldu', 'Bakım'][Math.floor(Math.random() * 3)],
          efficiency: Math.floor(Math.random() * 100),
          production: Math.floor(Math.random() * 1000)
        }));
      
      default:
        return [];
    }
  };

  const renderWidgetWithData = (mockData: any[]) => {
    const originalData = data;
    const tempData = mockData;
    
    // Temporarily use mock data for rendering
    switch (widget.type) {
      case 'chart':
        return renderChartWidgetWithData(tempData);
      case 'gauge':
        return renderGaugeWidgetWithData(tempData);
      case 'metric':
        return renderMetricWidgetWithData(tempData);
      case 'heatmap':
        return renderHeatmapWidgetWithData(tempData);
      case 'table':
        return renderTableWidgetWithData(tempData);
      default:
        return <div>Desteklenmeyen widget tipi</div>;
    }
  };

  const renderChartWidgetWithData = (chartData: any[]) => {
    const formattedData = chartData.map(point => ({
      timestamp: new Date(point.timestamp).toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: point.value,
      name: point.machineId || point.name
    }));

    const { chartType = 'line' } = widget.config;

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderGaugeWidgetWithData = (gaugeData: any[]) => {
    const metric = gaugeData[0];
    if (!metric) return <div>Veri bulunamadı</div>;

    const value = metric.value || 0;
    const { thresholds } = widget.config;
    
    let status: 'success' | 'warning' | 'error' = 'success';
    if (thresholds) {
      if (value < thresholds.critical) status = 'error';
      else if (value < thresholds.warning) status = 'warning';
    }

    const percentage = Math.min(100, Math.max(0, value));
    
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={status === 'error' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentage * 2.51} 251`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{value.toFixed(1)}</div>
              <div className="text-xs text-gray-500">{metric.unit}</div>
            </div>
          </div>
        </div>
        
        <Badge variant={status === 'error' ? 'destructive' : status === 'warning' ? 'secondary' : 'default'}>
          {status === 'error' ? 'Kritik' : status === 'warning' ? 'Uyarı' : 'Normal'}
        </Badge>
      </div>
    );
  };

  const renderMetricWidgetWithData = (metricData: any[]) => {
    const metric = metricData[0];
    if (!metric) return <div>Veri bulunamadı</div>;

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'up':
          return <TrendingUp className="w-4 h-4 text-green-500" />;
        case 'down':
          return <TrendingDown className="w-4 h-4 text-red-500" />;
        default:
          return <Minus className="w-4 h-4 text-gray-500" />;
      }
    };

    return (
      <div className="h-full flex flex-col justify-center p-4">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {metric.value.toFixed(1)}
            <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">{metric.unit}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            {getTrendIcon(metric.trend)}
            <span className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600 dark:text-green-400' :
              metric.trend === 'down' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
            </span>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Son güncelleme: {new Date(metric.timestamp).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      </div>
    );
  };

  const renderHeatmapWidgetWithData = (heatmapData: any[]) => {
    return (
      <div className="h-full p-4">
        <div className="grid grid-cols-4 gap-2 h-full">
          {heatmapData.map((machine, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-center text-xs ${
                machine.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                machine.status === 'offline' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}
            >
              <div className="font-medium">{machine.machineId}</div>
              <div>{machine.efficiency.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTableWidgetWithData = (tableData: any[]) => {
    return (
      <div className="h-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-2 text-gray-600 dark:text-gray-400">Makine</th>
              <th className="text-left p-2 text-gray-600 dark:text-gray-400">Durum</th>
              <th className="text-left p-2 text-gray-600 dark:text-gray-400">Verimlilik</th>
              <th className="text-left p-2 text-gray-600 dark:text-gray-400">Üretim</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                <td className="p-2 text-gray-900 dark:text-white">{row.machine}</td>
                <td className="p-2">
                  <Badge variant={row.status === 'Aktif' ? 'default' : row.status === 'Bakım' ? 'secondary' : 'destructive'}>
                    {row.status}
                  </Badge>
                </td>
                <td className="p-2 text-gray-900 dark:text-white">{row.efficiency}%</td>
                <td className="p-2 text-gray-900 dark:text-white">{row.production}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const loadWidgetData = async () => {
    try {
      setLoading(true);
      setError(null);
      const widgetData = await cloudDashboard.getWidgetData(widget);
      setData(widgetData);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Veri yüklenirken hata oluştu');
      console.error('Widget data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Yükleniyor...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-red-500 dark:text-red-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadWidgetData}
              className="mt-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Tekrar Dene
            </Button>
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      // Widget tipine göre mock veri oluştur
      const mockData = generateMockData(widget);
      return renderWidgetWithData(mockData);
    }

    switch (widget.type) {
      case 'chart':
        return renderChartWidget();
      case 'gauge':
        return renderGaugeWidget();
      case 'metric':
        return renderMetricWidget();
      case 'heatmap':
        return renderHeatmapWidget();
      case 'table':
        return renderTableWidget();
      default:
        return <div>Desteklenmeyen widget tipi</div>;
    }
  };

  const renderChartWidget = () => {
    const chartData = data.map(point => ({
      timestamp: new Date(point.timestamp).toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: point.value,
      name: point.machineId || point.name
    }));

    const { chartType = 'line' } = widget.config;

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default: // line
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderGaugeWidget = () => {
    const metric = data[0];
    if (!metric) return <div>Veri bulunamadı</div>;

    const value = metric.value || 0;
    const { thresholds } = widget.config;
    
    let status: 'success' | 'warning' | 'error' = 'success';
    if (thresholds) {
      if (value < thresholds.critical) status = 'error';
      else if (value < thresholds.warning) status = 'warning';
    }

    const percentage = Math.min(100, Math.max(0, value));
    
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={status === 'error' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentage * 2.51} 251`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{value.toFixed(1)}</div>
              <div className="text-xs text-gray-500">{metric.unit}</div>
            </div>
          </div>
        </div>
        
        <Badge variant={status === 'error' ? 'destructive' : status === 'warning' ? 'secondary' : 'default'}>
          {status === 'error' ? 'Kritik' : status === 'warning' ? 'Uyarı' : 'Normal'}
        </Badge>
      </div>
    );
  };

  const renderMetricWidget = () => {
    const metric = data[0];
    if (!metric) return <div>Veri bulunamadı</div>;

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'up':
          return <TrendingUp className="w-4 h-4 text-green-500" />;
        case 'down':
          return <TrendingDown className="w-4 h-4 text-red-500" />;
        default:
          return <Minus className="w-4 h-4 text-gray-500" />;
      }
    };

    return (
      <div className="h-full flex flex-col justify-center p-4">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {metric.value.toFixed(1)}
            <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">{metric.unit}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            {getTrendIcon(metric.trend)}
            <span className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600 dark:text-green-400' :
              metric.trend === 'down' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
            </span>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Son güncelleme: {new Date(metric.timestamp).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      </div>
    );
  };

  const renderHeatmapWidget = () => {
    return (
      <div className="h-full p-4">
        <div className="grid grid-cols-2 gap-2 h-full">
          {data.map((machine, index) => (
            <motion.div
              key={machine.machineId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border-2 ${
                machine.status === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                machine.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">{machine.machineId}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Verimlilik: {machine.efficiency.toFixed(1)}%
              </div>
              <div className={`w-full h-2 rounded-full ${
                machine.status === 'error' ? 'bg-red-200' :
                machine.status === 'warning' ? 'bg-yellow-200' :
                'bg-green-200'
              }`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    machine.status === 'error' ? 'bg-red-500' :
                    machine.status === 'warning' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${machine.efficiency}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderTableWidget = () => {
    return (
      <div className="h-full overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {Object.keys(data[0] || {}).map(key => (
                <th key={key} className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                {Object.values(row).map((value: any, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 text-gray-900 dark:text-gray-100">
                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/20 hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">{widget.title}</CardTitle>
              {(widget.config as any)?.showStatus && (
                <Badge 
                  variant={error ? "destructive" : "default"} 
                  className={`text-xs px-2 py-1 ${
                    error 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" 
                      : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  }`}
                >
                  {error ? "Hata" : "Aktif"}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" />
                {lastUpdate.toLocaleTimeString('tr-TR')}
              </div>
              
              {isEditing && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(widget)}
                    className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                  >
                    <Settings className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(widget.id)}
                    className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                  >
                    <Maximize2 className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </Button>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={loadWidgetData}
                disabled={loading}
                className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
              >
                <RefreshCw className={`w-3 h-3 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 h-[calc(100%-5rem)]">
          {renderChart()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardWidget; 