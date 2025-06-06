import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, Eye, Save, RotateCcw, CheckCircle, AlertCircle, Ruler, Target, Settings, VideoIcon, Monitor } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import visaoMaisLogo from "@assets/Visão+ - Horizontal.png";

interface MeasurementData {
  pupillaryDistance: number;
  monocularPdRight: number;
  monocularPdLeft: number;
  segmentHeight: number;
  frameWidth: number;
  frameHeight: number;
  bridgeWidth: number;
  opticalCenterRightX?: number;
  opticalCenterRightY?: number;
  opticalCenterLeftX?: number;
  opticalCenterLeftY?: number;
  measurementMethod: string;
  notes: string;
}

export default function OpticalMeasurementPro() {
  const [currentStep, setCurrentStep] = useState<'capture' | 'measure' | 'review'>('capture');
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [measurements, setMeasurements] = useState<MeasurementData>({
    pupillaryDistance: 0,
    monocularPdRight: 0,
    monocularPdLeft: 0,
    segmentHeight: 0,
    frameWidth: 0,
    frameHeight: 0,
    bridgeWidth: 0,
    measurementMethod: 'camera',
    notes: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Monitorar mudanças nas medições para forçar renderização
  useEffect(() => {
    console.log('Medições atualizadas:', measurements);
  }, [measurements]);

  // Verificar permissões e dispositivos na inicialização
  useEffect(() => {
    checkCameraPermissions();
    detectCameraDevices();
  }, []);

  // Verificar permissões da câmera
  const checkCameraPermissions = useCallback(async () => {
    try {
      if (!navigator.permissions) {
        setCameraPermission('prompt');
        return;
      }

      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(permission.state as any);
      
      // Escutar mudanças nas permissões
      permission.onchange = () => {
        setCameraPermission(permission.state as any);
      };
    } catch (error) {
      console.log('Permissions API não suportada');
      setCameraPermission('prompt');
    }
  }, []);

  // Detectar dispositivos de câmera
  const detectCameraDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(videoDevices);
      
      console.log('Câmeras detectadas:', videoDevices.length);
      console.log('Dispositivos:', videoDevices.map(d => ({ label: d.label, deviceId: d.deviceId })));
    } catch (error) {
      console.error('Erro ao detectar câmeras:', error);
    }
  }, []);

  // Inicializar câmera
  const startCamera = useCallback(async () => {
    try {
      console.log('Iniciando câmera...');
      
      // Parar stream anterior se existir
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }

      setIsCapturing(true);

      // Configuração simples e direta
      const constraints = {
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'user'
        },
        audio: false
      };

      console.log('Solicitando acesso à câmera...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Stream obtido:', stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Vídeo carregado');
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
        // Garantir que o vídeo seja reproduzido
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        }, 100);
      }

      setCameraStream(stream);
      
      toast({
        title: "Câmera ativada",
        description: "Posicione seu rosto no centro do círculo",
      });

    } catch (error: any) {
      console.error('Erro ao iniciar câmera:', error);
      setIsCapturing(false);
      
      let errorMessage = "Erro ao acessar a câmera";
      if (error.name === 'NotAllowedError') {
        errorMessage = "Permissão da câmera negada. Clique no ícone da câmera na barra de endereços para permitir acesso.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "Nenhuma câmera encontrada. Conecte uma câmera e tente novamente.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Câmera está sendo usada por outro aplicativo. Feche outros programas que usam a câmera.";
      }
      
      toast({
        title: "Erro na câmera",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [cameraStream, toast]);

  // Parar câmera
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCapturing(false);
  }, [cameraStream]);

  // Capturar foto
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    stopCamera();
    setCurrentStep('measure');
  }, [stopCamera]);

  // Upload de arquivo
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string);
      setCurrentStep('measure');
      setMeasurements(prev => ({ ...prev, measurementMethod: 'upload' }));
    };
    reader.readAsDataURL(file);
  }, []);

  // Atualizar medição
  const updateMeasurement = useCallback((field: keyof MeasurementData, value: number | string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  }, []);

  // Salvar medições
  const saveMeasurementsMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!capturedImage) {
        throw new Error('Nenhuma imagem capturada para análise');
      }

      // Processa a imagem para obter medições reais calculadas
      const processedMeasurements = await apiRequest('POST', '/api/process-measurement', {
        image: capturedImage,
        calibrationHint: {
          objectType: 'credit_card',
          realSizeMm: 85.60
        }
      });

      // Salva as medições calculadas no banco de dados
      return await apiRequest('POST', '/api/measurements', {
        pupillary_distance: processedMeasurements.pupillaryDistance,
        monocular_pd_right: processedMeasurements.monocularPdRight,
        monocular_pd_left: processedMeasurements.monocularPdLeft,
        optical_center_right_x: processedMeasurements.opticalCenterRight.x,
        optical_center_right_y: processedMeasurements.opticalCenterRight.y,
        optical_center_left_x: processedMeasurements.opticalCenterLeft.x,
        optical_center_left_y: processedMeasurements.opticalCenterLeft.y,
        segment_height_right: processedMeasurements.segmentHeightRight,
        segment_height_left: processedMeasurements.segmentHeightLeft,
        frame_width: processedMeasurements.frameWidth || null,
        frame_height: processedMeasurements.frameHeight || null,
        bridge_width: processedMeasurements.bridgeWidth || null,
        nose_bridge_width: processedMeasurements.noseBridgeWidth,
        face_width: processedMeasurements.faceWidth,
        face_height: processedMeasurements.faceHeight,
        measurement_quality_score: processedMeasurements.measurementQuality,
        face_detection_confidence: processedMeasurements.faceDetectionConfidence,
        lighting_condition: processedMeasurements.lightingCondition,
        measurement_method: 'camera_capture_real_analysis',
        device_info: 'USB2.0 VGA UVC WebCam (13d3:5a11)',
        calibration_object: 'credit_card',
        notes: measurements.notes || 'Medição óptica calculada através de análise de imagem real'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/measurements'] });
      setCurrentStep('review');
      toast({
        title: "Medições salvas",
        description: "As medições foram salvas com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as medições",
        variant: "destructive",
      });
    }
  });

  // Reiniciar processo
  const restartProcess = useCallback(() => {
    setMeasurements({
      pupillaryDistance: 0,
      monocularPdRight: 0,
      monocularPdLeft: 0,
      segmentHeight: 0,
      frameWidth: 0,
      frameHeight: 0,
      bridgeWidth: 0,
      measurementMethod: 'camera',
      notes: ''
    });
    setCapturedImage(null);
    setCurrentStep('capture');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img 
              src={visaoMaisLogo} 
              alt="Visão+" 
              className="h-16 w-auto"
            />
          </div>
          <p className="text-gray-600">Sistema Profissional de Medição Óptica</p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className={`flex items-center gap-2 ${currentStep === 'capture' ? 'text-purple-600' : currentStep === 'measure' || currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'capture' ? 'bg-purple-100 border-2 border-purple-600' : currentStep === 'measure' || currentStep === 'review' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-medium">Captura</span>
            </div>
            
            <div className={`w-8 h-1 rounded ${currentStep === 'measure' || currentStep === 'review' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center gap-2 ${currentStep === 'measure' ? 'text-purple-600' : currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'measure' ? 'bg-purple-100 border-2 border-purple-600' : currentStep === 'review' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                <Ruler className="w-4 h-4" />
              </div>
              <span className="font-medium">Medição</span>
            </div>
            
            <div className={`w-8 h-1 rounded ${currentStep === 'review' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center gap-2 ${currentStep === 'review' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-purple-100 border-2 border-purple-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="font-medium">Revisão</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                {currentStep === 'capture' && <Camera className="w-6 h-6 text-white" />}
                {currentStep === 'measure' && <Ruler className="w-6 h-6 text-white" />}
                {currentStep === 'review' && <Eye className="w-6 h-6 text-white" />}
              </div>
              <div>
                {currentStep === 'capture' && "Captura de Imagem"}
                {currentStep === 'measure' && "Medições Ópticas"}
                {currentStep === 'review' && "Revisão e Confirmação"}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 'capture' && !isCapturing && !capturedImage && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    onClick={startCamera} 
                    size="lg"
                    className="h-20 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                  >
                    <Camera className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Usar Câmera</div>
                      <div className="text-sm opacity-90">Capturar foto em tempo real</div>
                    </div>
                  </Button>

                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-3">ou</div>
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="h-16 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Fazer Upload de Imagem
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {isCapturing && (
              <div className="space-y-6">
                <div className="relative">
                  {/* Container circular da câmera */}
                  <div className="relative mx-auto" style={{ width: '350px', height: '350px' }}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-black shadow-2xl border-4 border-white">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Overlay circular com guias */}
                    <div className="absolute inset-0 rounded-full pointer-events-none">
                      {/* Círculo guia central */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/60 rounded-full"></div>
                      
                      {/* Linhas de alinhamento */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40"></div>
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/40"></div>
                      
                      {/* Ponto central */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Anel externo decorativo */}
                    <div className="absolute -inset-2 rounded-full border-2 border-purple-500/30 animate-pulse"></div>
                  </div>
                  
                  {/* Instruções embaixo */}
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Posicione seu rosto no centro do círculo
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Câmera ativa
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={capturePhoto} 
                    size="lg" 
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capturar Foto
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={stopCamera}
                    size="lg"
                    className="px-6"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {capturedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={async () => {
                      try {
                        console.log('Processando imagem para medições...');
                        
                        // Processa a imagem para obter medições reais
                        const processedMeasurements = await apiRequest('POST', '/api/process-measurement', {
                          image: capturedImage,
                          calibrationHint: {
                            objectType: 'credit_card',
                            realSizeMm: 85.60
                          }
                        });
                        
                        console.log('Medições processadas:', processedMeasurements);
                        
                        // Calcula valores atualizados
                        const newMeasurements = {
                          pupillaryDistance: processedMeasurements.pupillaryDistance,
                          monocularPdRight: processedMeasurements.monocularPdRight,
                          monocularPdLeft: processedMeasurements.monocularPdLeft,
                          segmentHeight: Math.abs((processedMeasurements.segmentHeightRight + processedMeasurements.segmentHeightLeft) / 2),
                          frameWidth: processedMeasurements.frameWidth || 0,
                          frameHeight: processedMeasurements.frameHeight || 0,
                          bridgeWidth: processedMeasurements.bridgeWidth || 0,
                          opticalCenterRightX: processedMeasurements.opticalCenterRight.x,
                          opticalCenterRightY: processedMeasurements.opticalCenterRight.y,
                          opticalCenterLeftX: processedMeasurements.opticalCenterLeft.x,
                          opticalCenterLeftY: processedMeasurements.opticalCenterLeft.y,
                          measurementMethod: 'camera_capture_real_analysis',
                          notes: 'Medição óptica calculada através de análise de imagem real'
                        };
                        
                        console.log('Valores que serão definidos:', newMeasurements);
                        
                        // Atualiza os valores das medições com dados reais calculados
                        setMeasurements(newMeasurements);
                        
                        // Navega imediatamente para a tela de medições
                        setCurrentStep('measure');
                        console.log('Navegando para tela de medições com valores:', newMeasurements);
                      } catch (error) {
                        console.error('Erro ao processar medições:', error);
                        toast({
                          title: "Erro ao processar medições",
                          description: "Não foi possível calcular as medições. Tente novamente.",
                          variant: "destructive"
                        });
                      }
                    }} 
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Prosseguir com Medições
                  </Button>
                  <Button variant="outline" onClick={restartProcess}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recapturar
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'measure' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Medições de Distância Pupilar */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-purple-600" />
                      Distância Pupilar
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="pd-total">DPN Total (mm)</Label>
                        <Input
                          id="pd-total"
                          type="number"
                          step="0.5"
                          value={measurements.pupillaryDistance || ''}
                          onChange={(e) => updateMeasurement('pupillaryDistance', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="pd-right">DPN Direita (mm)</Label>
                          <Input
                            id="pd-right"
                            type="number"
                            step="0.5"
                            value={measurements.monocularPdRight || ''}
                            onChange={(e) => updateMeasurement('monocularPdRight', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="pd-left">DPN Esquerda (mm)</Label>
                          <Input
                            id="pd-left"
                            type="number"
                            step="0.5"
                            value={measurements.monocularPdLeft || ''}
                            onChange={(e) => updateMeasurement('monocularPdLeft', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medições da Armação */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Medições da Armação
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="segment-height">Altura do Segmento (mm)</Label>
                        <Input
                          id="segment-height"
                          type="number"
                          step="0.5"
                          value={measurements.segmentHeight || ''}
                          onChange={(e) => updateMeasurement('segmentHeight', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="frame-width">Largura (mm)</Label>
                          <Input
                            id="frame-width"
                            type="number"
                            step="0.5"
                            value={measurements.frameWidth || ''}
                            onChange={(e) => updateMeasurement('frameWidth', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="frame-height">Altura (mm)</Label>
                          <Input
                            id="frame-height"
                            type="number"
                            step="0.5"
                            value={measurements.frameHeight || ''}
                            onChange={(e) => updateMeasurement('frameHeight', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bridge-width">Largura da Ponte (mm)</Label>
                        <Input
                          id="bridge-width"
                          type="number"
                          step="0.5"
                          value={measurements.bridgeWidth || ''}
                          onChange={(e) => updateMeasurement('bridgeWidth', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Centros Ópticos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Centros Ópticos
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Olho Direito */}
                    <div className="space-y-3">
                      <h4 className="text-md font-medium text-gray-700">Olho Direito (OD)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="optical-center-right-x">X (horizontal) mm</Label>
                          <Input
                            id="optical-center-right-x"
                            type="number"
                            step="0.1"
                            value={measurements.opticalCenterRightX ? measurements.opticalCenterRightX.toFixed(1) : ''}
                            onChange={(e) => updateMeasurement('opticalCenterRightX', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="optical-center-right-y">Y (vertical) mm</Label>
                          <Input
                            id="optical-center-right-y"
                            type="number"
                            step="0.1"
                            value={measurements.opticalCenterRightY ? measurements.opticalCenterRightY.toFixed(1) : ''}
                            onChange={(e) => updateMeasurement('opticalCenterRightY', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Olho Esquerdo */}
                    <div className="space-y-3">
                      <h4 className="text-md font-medium text-gray-700">Olho Esquerdo (OS)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="optical-center-left-x">X (horizontal) mm</Label>
                          <Input
                            id="optical-center-left-x"
                            type="number"
                            step="0.1"
                            value={measurements.opticalCenterLeftX ? measurements.opticalCenterLeftX.toFixed(1) : ''}
                            onChange={(e) => updateMeasurement('opticalCenterLeftX', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="optical-center-left-y">Y (vertical) mm</Label>
                          <Input
                            id="optical-center-left-y"
                            type="number"
                            step="0.1"
                            value={measurements.opticalCenterLeftY ? measurements.opticalCenterLeftY.toFixed(1) : ''}
                            onChange={(e) => updateMeasurement('opticalCenterLeftY', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="method">Método de Medição</Label>
                  <Select 
                    value={measurements.measurementMethod} 
                    onValueChange={(value) => updateMeasurement('measurementMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camera">Câmera Digital</SelectItem>
                      <SelectItem value="pupilometer">Pupilômetro</SelectItem>
                      <SelectItem value="ruler">Régua Milimetrada</SelectItem>
                      <SelectItem value="manual">Medição Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes">Observações</Label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações adicionais sobre as medições..."
                    value={measurements.notes}
                    onChange={(e) => updateMeasurement('notes', e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => saveMeasurementsMutation.mutate(measurements)}
                    disabled={saveMeasurementsMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    {saveMeasurementsMutation.isPending ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Salvar Medições
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={() => setCurrentStep('capture')}>
                    Voltar
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Medições Concluídas!</h3>
                  <p className="text-gray-600">As medições foram salvas com sucesso no sistema.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-800">Resumo das Medições:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>DPN Total: <span className="font-medium">{measurements.pupillaryDistance}mm</span></div>
                    <div>DPN Direita: <span className="font-medium">{measurements.monocularPdRight}mm</span></div>
                    <div>DPN Esquerda: <span className="font-medium">{measurements.monocularPdLeft}mm</span></div>
                    <div>Altura do Segmento: <span className="font-medium">{measurements.segmentHeight}mm</span></div>
                    <div>Método: <span className="font-medium">{measurements.measurementMethod}</span></div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={restartProcess}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Nova Medição
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}