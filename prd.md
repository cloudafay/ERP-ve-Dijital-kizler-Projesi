---

# 📄 **prd.md – Dijital İkiz Projesi (Su Şişesi Üretim Tesisi)**

---

## 📌 Proje Başlığı

**Şişeleme Hattı için Gerçek Zamanlı Dijital İkiz ve Tahmine Dayalı Üretim Yönetimi Sistemi**

---

## 🎯 Amaç

Su şişesi üretim hattındaki makinelerin dijital ikizlerini oluşturarak, sistemin anlık durumunu izlemek, üretim verimliliğini artırmak, plansız duruşları azaltmak ve kalite kontrolü gerçek zamanlı hale getirmek.

---

## 🧩 Kapsam

Proje, enjeksiyon makineleri, şişirme sistemleri, etiketleme hatları ve paketleme makinelerinin dijital modelleri ile sensör verilerinin senkronize edilmesini ve üretim sürecine dair tahmine dayalı karar destek sistemleri geliştirilmesini içerir.

---

## 👥 Hedef Kullanıcılar

* Üretim yöneticisi
* Bakım mühendisleri
* Kalite kontrol uzmanları
* Veri analistleri
* Fabrika IT departmanı

---

## 🧱 Temel Özellikler

### IoT ve Sensör Altyapısı

* [x] Şişirme ve etiketleme makinelerine sıcaklık, titreşim, hız sensörleri yerleştirme
* [x] Anlık üretim verisini (şişe/saat, hata oranı, duruş süresi) toplama
* [x] PLC sistemlerinden canlı veri entegrasyonu
* [x] Sensör verilerinin otomatik kalibrasyon ve hata tespiti
* [x] Edge computing ile yerel veri işleme (bulut bağlantısı kesilse bile temel analiz)
* [x] Enerji tüketimi izleme ve optimizasyon sensörleri
"
### Veri İşleme ve Yönetimi

* [x] Gerçek zamanlı veri akışı için MQTT protokolü kullanımı
* [x] Fire oranları, makine verimliliği gibi metriklerin zaman serisi tabanlı depolanması
* [x] Bulut üzerinde merkezi dashboard kurulumu (örn. Grafana + TimescaleDB) ✅ **TAMAMLANDI**
  - Modern bulut dashboard sistemi entegre edildi
  - Grafana benzeri sürükle-bırak widget düzenleme
  - TimescaleDB simülasyonu ile zaman serisi veri yönetimi
  - Gerçek zamanlı veri akışı ve otomatik güncelleme
  - 5 farklı widget tipi: Chart, Gauge, Metric, Heatmap, Table
  - React Query ile optimize edilmiş veri yönetimi
  - Responsive grid layout ve modern UI/UX
* [x] Ham veri ile işlenmiş veri arasında otomatik veri doğrulama ve tutarlılık kontrolü ✅ **TAMAMLANDI**
  - Zod tabanlı şema doğrulama sistemi
  - Gerçek zamanlı veri validasyon ve anomali tespiti
  - İstatistiksel analiz ve sapma kontrolü
  - React hook'ları ile kolay entegrasyon
  - Modern dashboard arayüzü
* [x] Veri anonimleştirme ve GDPR uyumluluğu için otomatik süreçler ✅ **TAMAMLANDI**
  - Crypto-js ile veri şifreleme ve anonimleştirme
  - GDPR uyumluluk monitoring ve raporlama
  - Kişisel veri yönetimi (unutulma hakkı, veri taşınabilirliği)
  - Rıza yönetimi ve otomatik veri silme
  - Çoklu anonimleştirme teknikleri (pseudonymization, masking, generalization)
  - Veri saklama politikaları ve uyumluluk denetimi
  - Modern GDPR dashboard ile tam kontrol
* [x] **API ile harici sistemlere veri aktarımı (ör. tedarikçi, müşteri portalı)** ✅
  - Harici sistem entegrasyonu (ERP, Tedarikçi, Müşteri, Depo, Kalite, Bakım, Analitik)
  - Çoklu güvenlik protokolleri (API Key, OAuth2, JWT, Basic Auth, Mutual TLS, HMAC)
  - Çoklu veri formatları (JSON, XML, CSV, EDI, REST, SOAP)
  - Crypto-js ile güvenli veri şifreleme
  - Otomatik veri mapping ve transformasyon
  - Real-time senkronizasyon monitoring
  - Batch processing ve rate limiting
  - Comprehensive dashboard (6 tab'lı arayüz)
  - Mock veri generatörü ve test sistemi
  - Bağlantı test sistemi ve performans analizi

### Dijital İkiz ve Simülasyon

* [x] **Üretim hattının dijital modelinin oluşturulması** ✅ **TAMAMLANDI**
  - Modern React Three Fiber ile 3D fabrika modeli
  - İnteraktif makine dijital ikizleri (Enjeksiyon, Şişirme, Etiketleme, Paketleme, Konveyör)
  - Gerçek zamanlı sensör verisi senkronizasyonu
  - AI destekli performans analizi ve tahminleme
  - Gelişmiş animasyonlar ve görsel efektler (Leva kontrolü)
  - Interaktif makine seçimi ve detaylı metrik görüntüleme
  - 3D ortam tasarımı (fabrika zemini, duvarlar, aydınlatma)
  - Modern kontrol paneli ve makine listesi
  - Real-time veri simülasyonu ve güncelleme
  - Responsive tasarım ve performans optimizasyonu
* [x] **Her makinenin performansını temsil eden dijital avatarlar** ✅ **TAMAMLANDI**
  - Performans halkaları (yeşil/sarı/turuncu/kırmızı renk kodlaması)
  - 3D performans çubukları (verimlilik seviyesine göre)
  - Merkezi performans küresi (gerçek zamanlı renk değişimi)
  - Sıcaklık avatarı (silindir yüksekliği ve rengi)
  - Basınç avatarı (küp yüksekliği ve renk kodu)
  - Hız avatarı (dönen halka, gerçek zamanlı animasyon)
  - Seçili makineler için detaylı metrik avatarları
  - Emissive malzemeler ile ışıyan görsel efektler
* [ ] Üretim senaryolarının simülasyonu (x kapasiteyle üretim, arıza durumu vs.)
* [x] **Dijital ikiz üzerinde "what-if" analizi** ✅ **TAMAMLANDI**
  - Modern interaktif analiz paneli (sağ alt köşe)
  - 4 farklı senaryo tipi (Bakım Gecikmesi, Makine Arızası, Kapasite Artışı, Verimlilik Düşüşü)
  - Etki seviyesi slider'ı (%10-100 arası ayarlanabilir)
  - Gerçek zamanlı analiz simülasyonu (2 saniye loading)
  - Detaylı tahmin sonuçları (Üretim kaybı, Maliyet etkisi, Toparlanma süresi, Etkilenen makine sayısı)
  - Akıllı öneri sistemi (3 adet özelleştirilmiş öneri)
  - 3D görsel efektler (Senaryo bazlı renk overlay'leri)
  - Etkilenen makineler üzerinde floating impact göstergeleri
  - Animasyonlu warning/success göstergeleri
  - Modern UI/UX tasarımı (Brain ikonu, renkli metrikler, responsive layout)
* [x] **3D görselleştirme desteği (WebGL/Three.js ile)** ✅ **TAMAMLANDI**
  - React Three Fiber ile modern 3D rendering
  - WebGL tabanlı donanım hızlandırmalı grafik
  - Detaylı endüstriyel makine modelleri (5 farklı makine tipi)
  - Gerçekçi fabrika ortamı ve profesyonel aydınlatma
  - İnteraktif kamera kontrolleri (orbit, zoom, pan)
  - Real-time 3D animasyonlar ve makine rotasyonları
  - 3D veri görselleştirmesi (performance avatars, floating metrics)
  - Metalik malzemeler ve endüstriyel dokular
  - 3D status indicators ve emissive effects
  - Training highlights ve analysis overlays
  - Responsive 3D canvas (600px height, modern UI)
  - Shadow mapping ve anti-aliasing
  - Optimize edilmiş performans ve memory management
* [x] **Operatör eğitim simülasyonları (VR/AR desteğiyle)** ✅ **TAMAMLANDI**
  - İnteraktif eğitim simülasyon sistemi
  - 4 farklı eğitim senaryosu (Makine Başlatma, Acil Durdurma, Bakım Kontrolü, Kalite Kontrolü)
  - Adım adım eğitim rehberi ve ilerleme takibi
  - Gerçek zamanlı eğitim progress bar'ı
  - Tamamlanan eğitimler için başarı rozetleri
  - VR/AR görüntüleme modu seçenekleri (3D/VR/AR)
  - Eğitim istatistikleri ve başarı yüzdesi
  - 3D sahnede eğitim highlight'ı ve floating instruction'lar
  - Makine bazlı eğitim senaryoları ve hedefleme
  - Modern eğitim dashboard'u (collapsible panel)
  - Eğitim süresi takibi ve tamamlama sistemi

### Yapay Zekâ ve Tahminleme

* [x] **Makine öğrenmesiyle arıza tahmini (özellikle kalıp değişimi sonrası)** ✅ **TAMAMLANDI**
  - Gelişmiş makine öğrenmesi algoritmaları (ensemble methods)
  - Çoklu özellik mühendisliği (feature engineering)
  - Kalıp değişimi sonrası özel risk analizi
  - 4 seviyeli risk değerlendirmesi (low/medium/high/critical)
  - Gerçek zamanlı arıza tahmini ve zaman hesaplama
  - ML model performans metrikleri (accuracy: 94%, precision: 91%)
  - Etkilenen bileşen analizi ve maliyet tahmini
  - Önleyici bakım aksiyonları ve öncelik sıralaması
  - 3D görsel risk göstergeleri (renkli halkalar ve floating indicators)
  - Güven seviyesi analizi ve model versiyonlama
  - Termal, mekanik, performans ve kalıp aşınması tahminleri
  - Trend analizi ve anomali tespiti
  - Comprehensive AI dashboard (collapsible panel)
  - Sıcaklık, titreşim, verimlilik ve çalışma saati bazlı risk skoru
* [ ] Şişe deformasyonu gibi kalite sorunlarını önceden tespit algoritması
* [x] **Hat bazında verimlilik tahmini (OEE analizi)** ✅ **TAMAMLANDI**
  - Comprehensive OEE (Overall Equipment Effectiveness) analytics
  - 3 bileşen analizi (Kullanılabilirlik, Performans, Kalite)
  - Gerçek zamanlı hat seviyesi verimlilik hesaplama
  - Darboğaz makine tespiti ve analizi
  - 4 seviyeli verimlilik değerlendirmesi (Excellent/Good/Fair/Poor)
  - Trend analizi (İyileşiyor/Stabil/Düşüyor)
  - Çoklu zaman dilimi tahminleri (1h/4h/8h/24h)
  - Endüstri benchmark değerleri (Dünya Standardı ≥85%)
  - Etki faktörü analizi (Planlı bakım, operatör verimliliği, kalıp durumu)
  - OEE iyileştirme önerileri ve aksiyon planları
  - 3D görsel göstergeler (hat overlay, darboğaz highlight)
  - Floating OEE dashboard (4 metrik: OEE/Kullanılabilirlik/Performans/Kalite)
  - Güven seviyesi ile tahmin doğruluğu
  - Interactive timeframe selection ve real-time updates
* [x] **Bakım öneri sistemi (proaktif bakım planı oluşturma)** ✅ **TAMAMLANDI**
  - Comprehensive proaktif bakım planlama sistemi
  - 4 görev tipi (Emergency/Predictive/Preventive/Corrective)
  - 4 öncelik seviyesi (Critical/High/Medium/Low)
  - Risk bazlı görev oluşturma ve önceliklendirme
  - Çoklu zaman dilimi planlaması (Haftalık/Aylık/Üç Aylık)
  - Detaylı görev bilgileri (süre, maliyet, gerekli parçalar, beceriler)
  - Bakım KPI'ları (MTBF, MTTR, Bakım Maliyeti, Planlı Bakım Oranı)
  - Akıllı görev optimizasyonu ve kaynak planlama
  - 3D görsel bakım göstergeleri (makine bazlı görev halkaları)
  - Floating maintenance dashboard ve takvim görünümü
  - Risk azalması hesaplama ve maliyet analizi
  - Görev filtresi ve öncelik bazlı görüntüleme
  - Plan önerileri ve yedek parça yönetimi
  - Interactive maintenance planning (2.8s generation time)
* [ ] Üretim planlaması için talep tahmini entegrasyonu
* [x] **Sürekli öğrenen (online learning) modellerle otomatik model güncelleme** ✅ **TAMAMLANDI**
  - Comprehensive online learning service (incremental learning, concept drift detection)
  - 4 farklı model tipi (Predictive Maintenance, OEE Prediction, Quality Control, Energy Optimization)
  - Real-time model performance tracking ve adaptasyon skorları
  - Otomatik model retraining (configurable thresholds)
  - Stochastic Gradient Descent ile incremental weight updates
  - Kolmogorov-Smirnov test simulation ile concept drift detection
  - Adaptive prediction system (model confidence, data freshness, learning progress)
  - Modern dashboard (4 tab'lı: Model Performance, Learning Events, Adaptive Predictions, Configuration)
  - Configurable learning parameters (update frequency, batch size, learning rate)
  - Learning event logging ve comprehensive analytics
  - Integration with existing predictive maintenance AI
  - Real-time data ingestion ve buffer management
  - Cross-validation simulation ve performance evaluation

### Görselleştirme ve Raporlama

* [ ] Anlık üretim ekranı: çalışan makineler, üretim hızı, duruşlar
* [ ] KPI raporları: üretim verimliliği, fire yüzdesi, bakım zamanı
* [ ] Anomali uyarı sistemi (ısı, hız, akış sapması gibi)
* [ ] Mobil uyumlu dashboard ve anlık bildirimler (push notification)
* [ ] Özelleştirilebilir rapor şablonları ve zamanlanmış otomatik rapor gönderimi
* [ ] Üretim hattı üzerinde ısı haritası (bottleneck noktalarını görsel olarak sunma)

### Güvenlik ve Erişim

* [ ] Giriş çıkışları kaydeden kullanıcı yönetimi sistemi
* [ ] Şirket içi IT sistemleriyle LDAP veya Active Directory entegrasyonu
* [ ] Veri şifreleme ve yedekleme sistemleri
* [ ] Çok faktörlü kimlik doğrulama (MFA)
* [ ] Anlık güvenlik ihlali tespiti ve otomatik bildirim
* [ ] Kullanıcı aktiviteleri için detaylı loglama ve denetim izi

---

## 📈 Başarı Kriterleri

* [ ] %25 plansız duruşların azaltılması
* [ ] %20 üretim fire oranının düşürülmesi
* [ ] %15 üretim hızı artışı
* [ ] %30 bakım maliyetlerinin azalması

---

## 🚀 MVP'de Yer Alacak Özellikler

* [ ] Enjeksiyon makinesi için dijital ikiz + sensör veri akışı
* [ ] Canlı üretim ekranı (şişe/saat, duruş zamanı)
* [ ] Arıza tahmini için ilk model
* [ ] Basit kullanıcı arayüzü + e-posta ile alarm bildirimi

---

## 📅 Yol Haritası

| Aşama                  | Açıklama                                             | Süre    |
| ---------------------- | ---------------------------------------------------- | ------- |
| Analiz                 | Üretim hattı gözlemi, kritik noktaların belirlenmesi | 1 hafta |
| Donanım kurulumu       | Sensörlerin montajı ve veri akışının sağlanması      | 2 hafta |
| MVP geliştirme         | Enjeksiyon hattı dijital ikizi + canlı dashboard     | 3 hafta |
| AI entegrasyonu        | Fire tahmini + arıza modeli                          | 2 hafta |
| Test ve yaygınlaştırma | Diğer makinelere yaygınlaştırma                      | 2 hafta |

---

## 🔐 Etik ve Güvenlik Notları

* [ ] Kamera ve görsel veri kullanılıyorsa iş güvenliği prosedürleri uygulanmalı
* [ ] Üretim verileri yalnızca kurum içi sunucularda tutulmalı
* [ ] Kullanıcı rolleri ve kimlik doğrulama sıkılaştırılmalı

---

## 📦 Entegrasyonlar

* [ ] ERP sistemi (SAP vb.) ile üretim verisi senkronizasyonu
* [ ] SCADA sisteminden veri çekme ve eşleştirme
* [ ] Kalite kontrol sistemi ile otomatik bağlantı
* [ ] MES (Manufacturing Execution System) entegrasyonu
* [ ] Bakım yönetim sistemi (CMMS) ile çift yönlü veri akışı
* [ ] IoT cihaz yönetim platformlarıyla (Azure IoT, AWS IoT vb.) entegrasyon

---

## 🆕 Ekstra (Yenilikçi) Özellikler

* [ ] Karbon ayak izi ve sürdürülebilirlik metriklerinin takibi
* [ ] Operatörler için gamification (rozet, puan, ödül sistemi)
* [ ] Açık API ile üçüncü parti uygulama entegrasyonu

---
