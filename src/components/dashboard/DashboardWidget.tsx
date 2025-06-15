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
          <div className="flex items-center gap-2 text-gray-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Yükleniyor...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-red-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadWidgetData}
              className="mt-2"
            >
              Tekrar Dene
            </Button>
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>Veri bulunamadı</p>
        </div>
      );
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
          <div className="text-3xl font-bold mb-2">
            {metric.value.toFixed(1)}
            <span className="text-lg text-gray-500 ml-1">{metric.unit}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            {getTrendIcon(metric.trend)}
            <span className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600' :
              metric.trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
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
                machine.status === 'error' ? 'bg-red-50 border-red-200' :
                machine.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}
            >
              <div className="text-sm font-medium">{machine.machineId}</div>
              <div className="text-xs text-gray-600 mb-2">
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
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0] || {}).map(key => (
                <th key={key} className="px-3 py-2 text-left font-medium text-gray-700">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t">
                {Object.values(row).map((value: any, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2">
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
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{widget.title}</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {lastUpdate.toLocaleTimeString('tr-TR')}
              </div>
              
              {isEditing && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(widget)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(widget.id)}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={loadWidgetData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 h-[calc(100%-4rem)]">
          {renderChart()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardWidget; 