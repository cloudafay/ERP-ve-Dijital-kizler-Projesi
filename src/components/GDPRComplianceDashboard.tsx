import React, { useState } from 'react';
import {
  useGDPRCompliance,
  usePersonalDataManagement,
  useConsentManagement,
  useDataRetention,
  useAnonymizationMetrics,
  useComplianceAudit,
  GDPRDataCategory,
  LegalBasis,
} from '../hooks/useGDPRCompliance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  UserX,
  Download,
  Trash2,
  Eye,
  Clock,
  Users,
  Database,
  Lock,
  Unlock,
  FileText,
  Calendar,
  Settings,
  RefreshCw,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { cn } from '../lib/utils';

export function GDPRComplianceDashboard() {
  const [selectedDataSubject, setSelectedDataSubject] = useState('');
  const [showNewDataDialog, setShowNewDataDialog] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showErasureDialog, setShowErasureDialog] = useState(false);

  const {
    complianceReport,
    complianceStatus,
    isLoading: complianceLoading,
    forceComplianceCheck,
  } = useGDPRCompliance();

  const {
    recordPersonalData,
    anonymizeData,
    processErasureRequest,
    exportPersonalData,
    isProcessing,
  } = usePersonalDataManagement();

  const {
    recordConsent,
    withdrawConsent,
    isProcessing: consentProcessing,
  } = useConsentManagement();

  const {
    retentionPolicies,
    upcomingDeletions,
    updateRetentionPolicy,
  } = useDataRetention();

  const {
    metrics: anonymizationMetrics,
    isLoading: metricsLoading,
  } = useAnonymizationMetrics();

  const {
    auditHistory,
    runComplianceAudit,
    isAuditing,
  } = useComplianceAudit();

  // Form state
  const [newDataForm, setNewDataForm] = useState({
    dataSubjectId: '',
    fieldName: '',
    value: '',
    category: GDPRDataCategory.PERSONAL_IDENTIFIABLE,
    legalBasis: LegalBasis.CONSENT,
    retentionDays: 2555,
  });

  const [consentForm, setConsentForm] = useState({
    dataSubjectId: '',
    purpose: '',
    legalBasis: LegalBasis.CONSENT,
    consentGiven: true,
    dataCategories: [GDPRDataCategory.PERSONAL_IDENTIFIABLE],
    source: 'web',
  });

  const [erasureForm, setErasureForm] = useState({
    dataSubjectId: '',
    reason: '',
  });

  const handleRecordPersonalData = () => {
    recordPersonalData.mutate(newDataForm, {
      onSuccess: () => {
        setShowNewDataDialog(false);
        setNewDataForm({
          dataSubjectId: '',
          fieldName: '',
          value: '',
          category: GDPRDataCategory.PERSONAL_IDENTIFIABLE,
          legalBasis: LegalBasis.CONSENT,
          retentionDays: 2555,
        });
      }
    });
  };

  const handleRecordConsent = () => {
    recordConsent.mutate(consentForm, {
      onSuccess: () => {
        setShowConsentDialog(false);
        setConsentForm({
          dataSubjectId: '',
          purpose: '',
          legalBasis: LegalBasis.CONSENT,
          consentGiven: true,
          dataCategories: [GDPRDataCategory.PERSONAL_IDENTIFIABLE],
          source: 'web',
        });
      }
    });
  };

  const handleErasureRequest = () => {
    processErasureRequest.mutate({
      dataSubjectId: erasureForm.dataSubjectId,
      reason: erasureForm.reason,
    }, {
      onSuccess: () => {
        setShowErasureDialog(false);
        setErasureForm({ dataSubjectId: '', reason: '' });
      }
    });
  };

  const getComplianceColor = (isCompliant: boolean) => {
    return isCompliant ? 'text-green-600' : 'text-red-600';
  };

  const getComplianceBadge = (isCompliant: boolean) => {
    return isCompliant ? (
      <Badge className="bg-green-100 text-green-800">Uyumlu</Badge>
    ) : (
      <Badge variant="destructive">Uyumsuz</Badge>
    );
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GDPR Uyumluluk & Veri Anonimleştirme</h1>
          <p className="text-muted-foreground">
            Kişisel veri koruma ve uyumluluk yönetimi
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => runComplianceAudit.mutate('manual')}
            disabled={isAuditing}
            className="flex items-center space-x-2"
          >
            {isAuditing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            <span>Manuel Denetim</span>
          </Button>

          <Button
            onClick={forceComplianceCheck}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Kontrol Et</span>
          </Button>
        </div>
      </div>

      {/* Uyumluluk Durumu Alert */}
      {!complianceStatus.isCompliant && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>GDPR Uyumluluk Sorunları Tespit Edildi!</AlertTitle>
          <AlertDescription>
            {complianceStatus.issues.length} adet uyumluluk sorunu bulundu. 
            Acil müdahale gerekebilir.
          </AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              GDPR Uyumluluk
            </CardTitle>
            <Shield className={cn(
              "h-4 w-4",
              getComplianceColor(complianceStatus.isCompliant)
            )} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getComplianceBadge(complianceStatus.isCompliant)}
            </div>
            <p className="text-xs text-muted-foreground">
              Son kontrol: {complianceStatus.lastCheck.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kişisel Veriler
            </CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceReport?.personalDataRecords.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {complianceReport?.dataSubjects || 0} veri sahibi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Anonimleştirilmiş
            </CardTitle>
            <Lock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceReport?.anonymizedRecords.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              %{complianceReport ? 
                ((complianceReport.anonymizedRecords / complianceReport.personalDataRecords) * 100).toFixed(1) 
                : '0'} oranı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Rızalar
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceReport?.activeConsents.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Geçerli izinler
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="personal-data">Kişisel Veriler</TabsTrigger>
          <TabsTrigger value="consent">Rıza Yönetimi</TabsTrigger>
          <TabsTrigger value="anonymization">Anonimleştirme</TabsTrigger>
          <TabsTrigger value="retention">Saklama Süresi</TabsTrigger>
          <TabsTrigger value="audit">Denetim</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Uyumluluk Sorunları</span>
                </CardTitle>
                <CardDescription>
                  Tespit edilen GDPR uyumluluk sorunları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceStatus.issues.length > 0 ? (
                    complianceStatus.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50"
                      >
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            {issue}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>Uyumluluk sorunu bulunamadı</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Öneriler</span>
                </CardTitle>
                <CardDescription>
                  GDPR uyumluluğu için öneriler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceStatus.recommendations.length > 0 ? (
                    complianceStatus.recommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg border border-blue-200 bg-blue-50"
                      >
                        <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-800">
                            {recommendation}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>Ek öneri bulunamadı</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deletions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Yaklaşan Silme İşlemleri</span>
              </CardTitle>
              <CardDescription>
                Saklama süresi dolacak veriler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeletions.map((deletion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{deletion.dataSubjectId}</p>
                      <p className="text-sm text-muted-foreground">
                        {deletion.recordCount} kayıt • {deletion.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {deletion.scheduledDate.toLocaleDateString()}
                      </p>
                      <Badge variant={deletion.canBePostponed ? "secondary" : "destructive"}>
                        {deletion.canBePostponed ? "Ertelenebilir" : "Zorunlu"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Data Tab */}
        <TabsContent value="personal-data" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Kişisel Veri Yönetimi</h3>
            <div className="flex items-center space-x-2">
              <Dialog open={showNewDataDialog} onOpenChange={setShowNewDataDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Veri Ekle</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Kişisel Veri Kaydı</DialogTitle>
                    <DialogDescription>
                      GDPR uyumlu yeni kişisel veri kaydı oluşturun
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dataSubjectId" className="text-right">
                        Veri Sahibi ID
                      </Label>
                      <Input
                        id="dataSubjectId"
                        value={newDataForm.dataSubjectId}
                        onChange={(e) => setNewDataForm({
                          ...newDataForm,
                          dataSubjectId: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fieldName" className="text-right">
                        Alan Adı
                      </Label>
                      <Input
                        id="fieldName"
                        value={newDataForm.fieldName}
                        onChange={(e) => setNewDataForm({
                          ...newDataForm,
                          fieldName: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="text-right">
                        Değer
                      </Label>
                      <Input
                        id="value"
                        value={newDataForm.value}
                        onChange={(e) => setNewDataForm({
                          ...newDataForm,
                          value: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Kategori
                      </Label>
                      <Select
                        value={newDataForm.category}
                        onValueChange={(value) => setNewDataForm({
                          ...newDataForm,
                          category: value as GDPRDataCategory
                        })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={GDPRDataCategory.PERSONAL_IDENTIFIABLE}>
                            Kişisel Tanımlayıcı
                          </SelectItem>
                          <SelectItem value={GDPRDataCategory.SENSITIVE_PERSONAL}>
                            Hassas Kişisel
                          </SelectItem>
                          <SelectItem value={GDPRDataCategory.OPERATIONAL}>
                            Operasyonel
                          </SelectItem>
                          <SelectItem value={GDPRDataCategory.TECHNICAL}>
                            Teknik
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleRecordPersonalData}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showErasureDialog} onOpenChange={setShowErasureDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center space-x-2">
                    <UserX className="h-4 w-4" />
                    <span>Unutulma Hakkı</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Unutulma Hakkı İsteği</DialogTitle>
                    <DialogDescription>
                      Veri sahibinin tüm kişisel verilerini sil veya anonimleştir
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="erasureDataSubjectId" className="text-right">
                        Veri Sahibi ID
                      </Label>
                      <Input
                        id="erasureDataSubjectId"
                        value={erasureForm.dataSubjectId}
                        onChange={(e) => setErasureForm({
                          ...erasureForm,
                          dataSubjectId: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">
                        Sebep
                      </Label>
                      <Textarea
                        id="reason"
                        value={erasureForm.reason}
                        onChange={(e) => setErasureForm({
                          ...erasureForm,
                          reason: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleErasureRequest}
                      disabled={isProcessing}
                      variant="destructive"
                    >
                      {isProcessing ? "İşleniyor..." : "Sil/Anonimleştir"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Kişisel Veri İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {complianceReport?.personalDataRecords || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Toplam Kayıt
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {complianceReport?.anonymizedRecords || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Anonimleştirilmiş
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {complianceReport?.deletedRecords || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Silinmiş
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {complianceReport?.dataSubjects || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Veri Sahibi
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consent Management Tab */}
        <TabsContent value="consent" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Rıza Yönetimi</h3>
            <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Rıza Ekle</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Rıza Kaydı</DialogTitle>
                  <DialogDescription>
                    Kullanıcı rızasını kaydedin
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="consentDataSubjectId" className="text-right">
                      Veri Sahibi ID
                    </Label>
                    <Input
                      id="consentDataSubjectId"
                      value={consentForm.dataSubjectId}
                      onChange={(e) => setConsentForm({
                        ...consentForm,
                        dataSubjectId: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purpose" className="text-right">
                      Amaç
                    </Label>
                    <Input
                      id="purpose"
                      value={consentForm.purpose}
                      onChange={(e) => setConsentForm({
                        ...consentForm,
                        purpose: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleRecordConsent}
                    disabled={consentProcessing}
                  >
                    {consentProcessing ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rıza İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {complianceReport?.activeConsents || 0}
                  </div>
                  <div className="text-sm text-green-700">
                    Aktif Rızalar
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {complianceReport?.dataSubjects || 0}
                  </div>
                  <div className="text-sm text-blue-700">
                    Toplam Kullanıcı
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anonymization Tab */}
        <TabsContent value="anonymization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anonimleştirme İstatistikleri</CardTitle>
              <CardDescription>
                Veri anonimleştirme metrikları ve teknikler
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Metrikler yükleniyor...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Metrics Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {anonymizationMetrics?.totalRecords.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Toplam Kayıt
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {anonymizationMetrics?.anonymizedRecords.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Anonimleştirilmiş
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {anonymizationMetrics?.pendingAnonymization}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bekleyen
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {anonymizationMetrics?.anonymizationRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Anonimleştirme Oranı
                      </div>
                    </div>
                  </div>

                  {/* Techniques Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Anonimleştirme Teknikleri</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={anonymizationMetrics?.techniques}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                          >
                            {anonymizationMetrics?.techniques.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'][index % 4]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Aylık Trend</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={anonymizationMetrics?.monthlyTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="anonymized"
                            stroke="#8884d8"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="deleted"
                            stroke="#82ca9d"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Veri Saklama Politikaları</CardTitle>
              <CardDescription>
                Veri kategorilerine göre saklama süreleri ve kurallar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retentionPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h4 className="font-medium">{policy.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(policy.defaultRetentionDays / 365)} yıl • {policy.legalBasis}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label>Otomatik Sil</Label>
                        <Switch
                          checked={policy.autoDelete}
                          onCheckedChange={(checked) =>
                            updateRetentionPolicy(policy.id, { autoDelete: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label>Otomatik Anonimleştir</Label>
                        <Switch
                          checked={policy.autoAnonymize}
                          onCheckedChange={(checked) =>
                            updateRetentionPolicy(policy.id, { autoAnonymize: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uyumluluk Denetim Geçmişi</CardTitle>
              <CardDescription>
                GDPR uyumluluk denetimlerinin geçmişi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditHistory.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{audit.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.date.toLocaleDateString()} • {audit.auditor}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={audit.result === 'Uyumlu' ? 'default' : 'destructive'}
                      >
                        {audit.result}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {audit.issues} sorun, {audit.recommendations} öneri
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}