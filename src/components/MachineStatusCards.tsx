
import React, { useState, useEffect } from 'react';

interface Machine {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'error';
  temperature: number;
  pressure: number;
  production_count: number;
  efficiency: number;
  last_maintenance: string;
}

const MachineStatusCards: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: 'MOLDING_01',
      name: 'Kalıplama Makinesi 1',
      status: 'active',
      temperature: 185.2,
      pressure: 24.8,
      production_count: 3420,
      efficiency: 96.5,
      last_maintenance: '2024-06-05'
    },
    {
      id: 'MOLDING_02',
      name: 'Kalıplama Makinesi 2',
      status: 'active',
      temperature: 182.1,
      pressure: 25.2,
      production_count: 3315,
      efficiency: 94.2,
      last_maintenance: '2024-06-03'
    },
    {
      id: 'FILLING_01',
      name: 'Dolum Hattı 1',
      status: 'active',
      temperature: 22.5,
      pressure: 4.2,
      production_count: 2890,
      efficiency: 92.8,
      last_maintenance: '2024-06-08'
    },
    {
      id: 'FILLING_02',
      name: 'Dolum Hattı 2',
      status: 'maintenance',
      temperature: 25.1,
      pressure: 0.0,
      production_count: 0,
      efficiency: 0,
      last_maintenance: '2024-06-11'
    },
    {
      id: 'CAPPING_01',
      name: 'Kapak Takma 1',
      status: 'active',
      temperature: 28.3,
      pressure: 2.1,
      production_count: 2954,
      efficiency: 89.5,
      last_maintenance: '2024-06-07'
    },
    {
      id: 'LABELING_01',
      name: 'Etiketleme 1',
      status: 'error',
      temperature: 24.8,
      pressure: 1.8,
      production_count: 1456,
      efficiency: 45.2,
      last_maintenance: '2024-06-02'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'idle': return 'Beklemede';
      case 'maintenance': return 'Bakımda';
      case 'error': return 'Arızalı';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Makine Durumları</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Tümünü Görüntüle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Makine Başlığı ve Durum */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 text-sm">{machine.name}</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(machine.status)}`}></div>
                <span className="text-xs font-medium text-gray-600">
                  {getStatusText(machine.status)}
                </span>
              </div>
            </div>

            {/* Makine Metrikleri */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Sıcaklık</p>
                <p className="font-semibold text-gray-900">{machine.temperature}°C</p>
              </div>
              <div>
                <p className="text-gray-500">Basınç</p>
                <p className="font-semibold text-gray-900">{machine.pressure} bar</p>
              </div>
              <div>
                <p className="text-gray-500">Üretim</p>
                <p className="font-semibold text-gray-900">{machine.production_count}</p>
              </div>
              <div>
                <p className="text-gray-500">Verimlilik</p>
                <p className="font-semibold text-gray-900">{machine.efficiency}%</p>
              </div>
            </div>

            {/* Verimlilik Çubuğu */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    machine.efficiency > 80 ? 'bg-green-500' :
                    machine.efficiency > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${machine.efficiency}%` }}
                ></div>
              </div>
            </div>

            {/* Son Bakım */}
            <div className="mt-2 text-xs text-gray-500">
              Son Bakım: {machine.last_maintenance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineStatusCards;
