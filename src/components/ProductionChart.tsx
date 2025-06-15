
import React from 'react';

const ProductionChart: React.FC = () => {
  // Örnek veri - gerçek uygulamada Chart.js veya Recharts kullanılacak
  const chartData = [
    { time: '08:00', production: 280, target: 300 },
    { time: '09:00', production: 295, target: 300 },
    { time: '10:00', production: 285, target: 300 },
    { time: '11:00', production: 305, target: 300 },
    { time: '12:00', production: 275, target: 300 },
    { time: '13:00', production: 290, target: 300 },
    { time: '14:00', production: 310, target: 300 },
    { time: '15:00', production: 285, target: 300 }
  ];

  const maxValue = Math.max(...chartData.map(d => Math.max(d.production, d.target)));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Saatlik Üretim Analizi</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-600">Gerçekleşen</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
            <span className="text-gray-600">Hedef</span>
          </div>
        </div>
      </div>

      {/* Basit Çubuk Grafik */}
      <div className="relative">
        <div className="flex items-end justify-between h-48 space-x-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center space-x-1 h-40">
                {/* Hedef Çubuğu */}
                <div
                  className="bg-gray-300 rounded-t w-3"
                  style={{
                    height: `${(data.target / maxValue) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
                {/* Gerçekleşen Çubuğu */}
                <div
                  className={`rounded-t w-3 ${
                    data.production >= data.target ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{
                    height: `${(data.production / maxValue) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">{data.time}</div>
            </div>
          ))}
        </div>

        {/* Y Ekseni Değerleri */}
        <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>

      {/* Özet İstatistikler */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {Math.round(chartData.reduce((sum, d) => sum + d.production, 0) / chartData.length)}
          </p>
          <p className="text-sm text-gray-600">Ortalama/Saat</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {Math.max(...chartData.map(d => d.production))}
          </p>
          <p className="text-sm text-gray-600">En Yüksek</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {Math.round((chartData.reduce((sum, d) => sum + d.production, 0) / chartData.reduce((sum, d) => sum + d.target, 0)) * 100)}%
          </p>
          <p className="text-sm text-gray-600">Hedef Başarısı</p>
        </div>
      </div>
    </div>
  );
};

export default ProductionChart;
