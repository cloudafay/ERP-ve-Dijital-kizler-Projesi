import React from 'react';

interface PerformanceData {
  machine: string;
  machineId: string;
  uptime: number;
  efficiency: number;
  output: number;
  quality: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

const PerformanceTable: React.FC = () => {
  const performanceData: PerformanceData[] = [
    {
      machine: 'Kalıplama M1',
      machineId: 'MOLDING_01',
      uptime: 98.5,
      efficiency: 96.5,
      output: 3420,
      quality: 99.2,
      lastMaintenance: '2024-06-05',
      nextMaintenance: '2024-06-20'
    },
    {
      machine: 'Kalıplama M2',
      machineId: 'MOLDING_02',
      uptime: 97.2,
      efficiency: 94.2,
      output: 3315,
      quality: 98.8,
      lastMaintenance: '2024-06-03',
      nextMaintenance: '2024-06-18'
    },
    {
      machine: 'Dolum H1',
      machineId: 'FILLING_01',
      uptime: 96.8,
      efficiency: 92.8,
      output: 2890,
      quality: 99.5,
      lastMaintenance: '2024-06-08',
      nextMaintenance: '2024-06-23'
    },
    {
      machine: 'Dolum H2',
      machineId: 'FILLING_02',
      uptime: 0.0,
      efficiency: 0.0,
      output: 0,
      quality: 0.0,
      lastMaintenance: '2024-06-11',
      nextMaintenance: '2024-06-26'
    },
    {
      machine: 'Kapak T1',
      machineId: 'CAPPING_01',
      uptime: 94.5,
      efficiency: 89.5,
      output: 2954,
      quality: 97.8,
      lastMaintenance: '2024-06-07',
      nextMaintenance: '2024-06-22'
    },
    {
      machine: 'Etiketleme',
      machineId: 'LABELING_01',
      uptime: 45.2,
      efficiency: 45.2,
      output: 1456,
      quality: 85.2,
      lastMaintenance: '2024-06-02',
      nextMaintenance: '2024-06-17'
    }
  ];

  const getStatusBadge = (value: number, type: string) => {
    let colorClass = '';
    if (type === 'uptime' || type === 'efficiency') {
      if (value >= 95) colorClass = 'bg-green-100 text-green-800';
      else if (value >= 80) colorClass = 'bg-yellow-100 text-yellow-800';
      else colorClass = 'bg-red-100 text-red-800';
    } else if (type === 'quality') {
      if (value >= 98) colorClass = 'bg-green-100 text-green-800';
      else if (value >= 95) colorClass = 'bg-yellow-100 text-yellow-800';
      else colorClass = 'bg-red-100 text-red-800';
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {value.toFixed(1)}%
      </span>
    );
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    const today = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const diffTime = maintenanceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const exportToPDF = () => {
    // PDF export için PDFExportService kullan
    import('../utils/pdfExport').then(({ PDFExportService }) => {
      // Performans verilerini makine formatına çevir
      const machines = performanceData.map(row => ({
        id: row.machineId,
        name: row.machine,
        status: row.uptime > 80 ? 'running' : row.uptime > 50 ? 'idle' : 'maintenance',
        efficiency: row.efficiency,
        productionRate: row.output,
        qualityScore: row.quality,
        oee: (row.uptime * row.efficiency * row.quality) / 10000 // OEE hesaplama
      }));
      
      PDFExportService.exportPerformanceTable(machines);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Makine Performans Tablosu</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={exportToPDF}>
          PDF İndir
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Makine
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Çalışma Süresi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verimlilik
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Üretim
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kalite
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sonraki Bakım
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {performanceData.map((row) => (
              <tr key={row.machineId} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {row.machine}
                    </div>
                    <div className="text-sm text-gray-500">
                      {row.machineId}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(row.uptime, 'uptime')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(row.efficiency, 'efficiency')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.output.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(row.quality, 'quality')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {row.nextMaintenance}
                  </div>
                  {isMaintenanceDue(row.nextMaintenance) && (
                    <div className="text-xs text-red-600 font-medium">
                      Yakında!
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Özet İstatistikler */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {(performanceData.reduce((sum, d) => sum + d.uptime, 0) / performanceData.length).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Ortalama Çalışma</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {(performanceData.reduce((sum, d) => sum + d.efficiency, 0) / performanceData.length).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Ortalama Verimlilik</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {performanceData.reduce((sum, d) => sum + d.output, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Toplam Üretim</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {(performanceData.reduce((sum, d) => sum + d.quality, 0) / performanceData.length).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Ortalama Kalite</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTable;
