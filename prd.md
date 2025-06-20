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

* [ ] Üretim hattının dijital modelinin oluşturulması
* [ ] Her makinenin performansını temsil eden dijital avatarlar
* [ ] Üretim senaryolarının simülasyonu (x kapasiteyle üretim, arıza durumu vs.)
* [ ] Dijital ikiz üzerinde "what-if" analizi (ör. bakım gecikirse ne olur?)
* [ ] 3D görselleştirme desteği (WebGL/Three.js ile)
* [ ] Operatör eğitim simülasyonları (VR/AR desteğiyle)

### Yapay Zekâ ve Tahminleme

* [ ] Makine öğrenmesiyle arıza tahmini (özellikle kalıp değişimi sonrası)
* [ ] Şişe deformasyonu gibi kalite sorunlarını önceden tespit algoritması
* [ ] Hat bazında verimlilik tahmini (OEE analizi)
* [ ] Bakım öneri sistemi (proaktif bakım planı oluşturma)
* [ ] Üretim planlaması için talep tahmini entegrasyonu
* [ ] Sürekli öğrenen (online learning) modellerle otomatik model güncelleme

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
