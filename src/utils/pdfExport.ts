import jsPDF from 'jspdf';

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  data: (string | number)[][];
  filename: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'a3' | 'letter';
}

export class PDFExportService {
  private static addHeader(doc: jsPDF, title: string, subtitle?: string): number {
    // Logo ve başlık alanı
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Digital Gemini - Su Şişesi Fabrikası', 20, 25);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 20, 40);
    
    let yPosition = 50;
    
    if (subtitle) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(subtitle, 20, yPosition);
      yPosition += 10;
    }
    
    // Tarih ve saat
    const now = new Date();
    const dateStr = now.toLocaleDateString('tr-TR');
    const timeStr = now.toLocaleTimeString('tr-TR');
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Oluşturulma: ${dateStr} ${timeStr}`, 20, yPosition);
    
    // Çizgi
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition + 5, doc.internal.pageSize.width - 20, yPosition + 5);
    
    doc.setTextColor(0, 0, 0); // Siyaha geri döndür
    
    return yPosition + 15;
  }
  
  private static addSimpleTable(doc: jsPDF, headers: string[], data: (string | number)[][], startY: number): void {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const tableWidth = pageWidth - (margin * 2);
    const colWidth = tableWidth / headers.length;
    
    let currentY = startY;
    
    // Başlık satırı
    doc.setFillColor(41, 128, 185);
    doc.rect(margin, currentY, tableWidth, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    headers.forEach((header, index) => {
      const x = margin + (index * colWidth) + 2;
      doc.text(header, x, currentY + 7);
    });
    
    currentY += 10;
    
    // Veri satırları
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    data.forEach((row, rowIndex) => {
      // Alternatif satır rengi
      if (rowIndex % 2 === 1) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, currentY, tableWidth, 8, 'F');
      }
      
      row.forEach((cell, colIndex) => {
        const x = margin + (colIndex * colWidth) + 2;
        const cellText = String(cell);
        
        // Uzun metinleri kısalt
        const maxLength = Math.floor(colWidth / 3);
        const displayText = cellText.length > maxLength ? 
          cellText.substring(0, maxLength - 3) + '...' : cellText;
        
        doc.text(displayText, x, currentY + 6);
      });
      
      currentY += 8;
      
      // Sayfa sonu kontrolü
      if (currentY > doc.internal.pageSize.height - 40) {
        doc.addPage();
        currentY = 30;
      }
    });
    
    // Tablo çerçevesi
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, startY, tableWidth, (data.length + 1) * 8 + 2);
  }
  
  private static addFooter(doc: jsPDF): void {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Sayfa numarası (basit yaklaşım)
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Digital Gemini Fabrika Yönetim Sistemi', 20, pageHeight - 20);
    doc.text('Sayfa 1', pageWidth - 40, pageHeight - 20);
  }
  
  public static exportToPDF(options: PDFExportOptions): void {
    const {
      title,
      subtitle,
      headers,
      data,
      filename,
      orientation = 'portrait',
      pageSize = 'a4'
    } = options;
    
    // PDF oluştur
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize
    });
    
    // Başlık ekle
    const startY = this.addHeader(doc, title, subtitle);
    
    // Basit tablo oluştur
    this.addSimpleTable(doc, headers, data, startY);
    
    // Alt bilgi ekle
    this.addFooter(doc);
    
    // PDF'i indir
    doc.save(filename);
  }
  
  // Performans tablosu için özel export
  public static exportPerformanceTable(machines: any[]): void {
    const headers = [
      'Makine ID',
      'Makine Adı',
      'Durum',
      'Verimlilik (%)',
      'Üretim Hızı',
      'Kalite Skoru (%)',
      'OEE (%)',
      'Son Güncelleme'
    ];
    
    const data = machines.map(machine => [
      machine.id,
      machine.name,
      machine.status === 'running' ? 'Çalışıyor' : 
      machine.status === 'idle' ? 'Beklemede' : 
      machine.status === 'maintenance' ? 'Bakımda' : 'Durduruldu',
      machine.efficiency?.toFixed(1) || '0.0',
      machine.productionRate?.toFixed(0) || '0',
      machine.qualityScore?.toFixed(1) || '0.0',
      machine.oee?.toFixed(1) || '0.0',
      new Date().toLocaleString('tr-TR')
    ]);
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    
    this.exportToPDF({
      title: 'Makine Performans Raporu',
      subtitle: `Toplam ${machines.length} makine performans verileri`,
      headers,
      data,
      filename: `makine-performans-${dateStr}-${timeStr}.pdf`,
      orientation: 'landscape'
    });
  }
  
  // IoT sensör verileri için özel export
  public static exportIoTData(sensorData: any[]): void {
    const headers = [
      'Sensör ID',
      'Sensör Tipi',
      'Değer',
      'Birim',
      'Durum',
      'Son Ölçüm',
      'Konum'
    ];
    
    const data = sensorData.map(sensor => [
      sensor.id,
      sensor.type,
      sensor.value?.toString() || '0',
      sensor.unit || '',
      sensor.status === 'active' ? 'Aktif' : 
      sensor.status === 'warning' ? 'Uyarı' : 'Hata',
      new Date(sensor.timestamp).toLocaleString('tr-TR'),
      sensor.location || 'Bilinmiyor'
    ]);
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    
    this.exportToPDF({
      title: 'IoT Sensör Verileri Raporu',
      subtitle: `${sensorData.length} sensörden toplanan veriler`,
      headers,
      data,
      filename: `iot-sensor-verileri-${dateStr}-${timeStr}.pdf`
    });
  }
  
  // Uyarılar için özel export
  public static exportAlerts(alerts: any[]): void {
    const headers = [
      'ID',
      'Tip',
      'Başlık',
      'Açıklama',
      'Önem Seviyesi',
      'Durum',
      'Oluşturulma',
      'Makine'
    ];
    
    const data = alerts.map(alert => [
      alert.id,
      alert.type === 'error' ? 'Hata' :
      alert.type === 'warning' ? 'Uyarı' : 'Bilgi',
      alert.title,
      alert.description || alert.message,
      alert.severity === 'high' ? 'Yüksek' :
      alert.severity === 'medium' ? 'Orta' : 'Düşük',
      alert.acknowledged ? 'Onaylandı' : 'Beklemede',
      alert.timestamp,
      alert.machineId || alert.machine || 'Sistem'
    ]);
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    
    this.exportToPDF({
      title: 'Sistem Uyarıları Raporu',
      subtitle: `Toplam ${alerts.length} uyarı kaydı`,
      headers,
      data,
      filename: `sistem-uyarilari-raporu-${dateStr}-${timeStr}.pdf`,
      orientation: 'landscape'
    });
  }
  
  // Zaman serisi verileri için özel export
  public static exportTimeSeriesData(timeSeriesData: any[], metricName: string): void {
    const headers = [
      'Zaman',
      'Makine ID',
      'Metrik Tipi',
      'Değer',
      'Birim'
    ];
    
    const data = timeSeriesData.map(point => [
      new Date(point.timestamp).toLocaleString('tr-TR'),
      point.machineId,
      point.metricType,
      point.value?.toFixed(2) || '0.00',
      point.unit || ''
    ]);
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    this.exportToPDF({
      title: 'Zaman Serisi Analiz Raporu',
      subtitle: `${metricName} metriği için ${timeSeriesData.length} veri noktası`,
      headers,
      data,
      filename: `zaman_serisi_${metricName}_${dateStr}.pdf`,
      orientation: 'landscape'
    });
  }
} 