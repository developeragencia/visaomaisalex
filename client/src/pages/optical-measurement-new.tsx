import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Ruler, Eye, Target, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CalibrationObject {
  type: 'credit_card' | 'coin' | 'ruler' | 'id_card';
  realSizeMm: number;
}

interface MeasurementResults {
  pupillaryDistance: number;
  monocularPdRight: number;
  monocularPdLeft: number;
  opticalCenterRight: { x: number; y: number };
  opticalCenterLeft: { x: number; y: number };
  segmentHeightRight: number;
  segmentHeightLeft: number;
  faceWidth: number;
  faceHeight: number;
  noseBridgeWidth: number;
  measurementQuality: number;
  faceDetectionConfidence: number;
  lightingCondition: 'good' | 'fair' | 'poor';
}

export default function OpticalMeasurementNew() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<MeasurementResults | null>(null);
  const [calibrationObject, setCalibrationObject] = useState<CalibrationObject>({
    type: 'credit_card',
    realSizeMm: 85.60
  });
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [measurementStep, setMeasurementStep] = useState<'setup' | 'calibration' | 'capture' | 'processing' | 'results'>('setup');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Inicializar câmera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMeasurementStep('calibration');
    } catch (error) {
      toast({
        title: "Erro na Câmera",
        description: "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive"
      });
    }
  };

  // Parar câmera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Capturar imagem da câmera
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    setMeasurementStep('processing');
    
    // Processar medição
    processMeasurement(imageData);
  }, []);

  // Carregar imagem do arquivo
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      setMeasurementStep('processing');
      processMeasurement(imageData);
    };
    reader.readAsDataURL(file);
  }, []);

  // Processar medição usando o engine óptico
  const processMeasurement = async (imageBase64: string) => {
    try {
      const response = await apiRequest('/api/optical-measurement', 'POST', {
        imageBase64,
        calibrationHint: {
          objectType: calibrationObject.type,
          realSizeMm: calibrationObject.realSizeMm
        }
      });

      setMeasurements(response);
      setMeasurementStep('results');
      
      toast({
        title: "Medição Concluída",
        description: "Medições ópticas calculadas com sucesso!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro na Medição",
        description: "Não foi possível processar a medição. Tente novamente.",
        variant: "destructive"
      });
      setMeasurementStep('capture');
    }
  };

  // Salvar medições no banco
  const saveMeasurementMutation = useMutation({
    mutationFn: async () => {
      if (!measurements) throw new Error('Nenhuma medição para salvar');
      
      return apiRequest('/api/measurements', 'POST', {
        pupillary_distance: measurements.pupillaryDistance,
        monocular_pd_right: measurements.monocularPdRight,
        monocular_pd_left: measurements.monocularPdLeft,
        optical_center_right_x: measurements.opticalCenterRight.x,
        optical_center_right_y: measurements.opticalCenterRight.y,
        optical_center_left_x: measurements.opticalCenterLeft.x,
        optical_center_left_y: measurements.opticalCenterLeft.y,
        segment_height_right: measurements.segmentHeightRight,
        segment_height_left: measurements.segmentHeightLeft,
        face_width: measurements.faceWidth,
        face_height: measurements.faceHeight,
        nose_bridge_width: measurements.noseBridgeWidth,
        measurement_quality_score: measurements.measurementQuality,
        face_detection_confidence: measurements.faceDetectionConfidence,
        lighting_condition: measurements.lightingCondition,
        measurement_method: 'camera',
        calibration_object: calibrationObject.type,
        reference_image_url: capturedImage
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/measurements'] });
      toast({
        title: "Medição Salva",
        description: "As medições foram salvas com sucesso no sistema.",
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as medições. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Reiniciar processo
  const resetMeasurement = () => {
    setCapturedImage(null);
    setMeasurements(null);
    setMeasurementStep('setup');
    stopCamera();
  };

  // Cleanup da câmera
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Avaliação da qualidade da medição
  const getQualityColor = (quality: number) => {
    if (quality >= 0.8) return "bg-green-100 text-green-800";
    if (quality >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getQualityText = (quality: number) => {
    if (quality >= 0.8) return "Excelente";
    if (quality >= 0.6) return "Boa";
    return "Ruim";
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medição Óptica Avançada
        </h1>
        <p className="text-gray-600">
          Sistema de medição precisa de distância pupilar, centros ópticos e parâmetros faciais
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Área de Captura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Captura de Imagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            {measurementStep === 'setup' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Escolha como capturar a imagem para medição:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button onClick={initializeCamera} className="h-20 flex-col">
                      <Camera className="w-6 h-6 mb-2" />
                      Usar Câmera
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-20 flex-col"
                    >
                      <Ruler className="w-6 h-6 mb-2" />
                      Carregar Arquivo
                    </Button>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {measurementStep === 'calibration' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-lg mb-2">Objeto de Calibração</h3>
                  <p className="text-gray-600 text-sm">
                    Segure um objeto de tamanho conhecido próximo ao rosto para calibração precisa
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={calibrationObject.type === 'credit_card' ? 'default' : 'outline'}
                    onClick={() => setCalibrationObject({ type: 'credit_card', realSizeMm: 85.60 })}
                    className="text-sm"
                  >
                    Cartão de Crédito
                    <br />
                    <span className="text-xs">85.6mm</span>
                  </Button>
                  <Button
                    variant={calibrationObject.type === 'id_card' ? 'default' : 'outline'}
                    onClick={() => setCalibrationObject({ type: 'id_card', realSizeMm: 85.60 })}
                    className="text-sm"
                  >
                    RG/CNH
                    <br />
                    <span className="text-xs">85.6mm</span>
                  </Button>
                </div>
                
                <Button 
                  onClick={() => setMeasurementStep('capture')}
                  className="w-full"
                >
                  Continuar
                </Button>
              </div>
            )}

            {measurementStep === 'capture' && cameraStream && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Guias de posicionamento */}
                    <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Posicione seu rosto no centro e mantenha o objeto de calibração visível
                  </p>
                  <Button onClick={captureImage} size="lg" className="px-8">
                    <Camera className="w-5 h-5 mr-2" />
                    Capturar Foto
                  </Button>
                </div>
              </div>
            )}

            {measurementStep === 'processing' && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Processando medições...</p>
              </div>
            )}

            {capturedImage && (
              <div className="mt-4">
                <img 
                  src={capturedImage} 
                  alt="Imagem capturada" 
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        {/* Resultados das Medições */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Resultados das Medições
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!measurements ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Capture uma imagem para ver os resultados das medições</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Qualidade da Medição */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Qualidade da Medição</span>
                  <Badge className={getQualityColor(measurements.measurementQuality)}>
                    {getQualityText(measurements.measurementQuality)} ({Math.round(measurements.measurementQuality * 100)}%)
                  </Badge>
                </div>

                {/* Distância Pupilar */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Distância Pupilar (PD)
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span>PD Binocular:</span>
                      <span className="font-bold text-blue-700">
                        {measurements.pupillaryDistance.toFixed(1)} mm
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">PD Direito:</span>
                        <span className="font-medium">{measurements.monocularPdRight.toFixed(1)} mm</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">PD Esquerdo:</span>
                        <span className="font-medium">{measurements.monocularPdLeft.toFixed(1)} mm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Centros Ópticos */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Centros Ópticos
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600 mb-1">Olho Direito</div>
                      <div className="text-xs">
                        X: {measurements.opticalCenterRight.x.toFixed(1)} mm<br />
                        Y: {measurements.opticalCenterRight.y.toFixed(1)} mm
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600 mb-1">Olho Esquerdo</div>
                      <div className="text-xs">
                        X: {measurements.opticalCenterLeft.x.toFixed(1)} mm<br />
                        Y: {measurements.opticalCenterLeft.y.toFixed(1)} mm
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medidas Faciais */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Medidas Faciais</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Largura da Face:</span>
                      <span className="font-medium">{measurements.faceWidth.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Altura da Face:</span>
                      <span className="font-medium">{measurements.faceHeight.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Ponte do Nariz:</span>
                      <span className="font-medium">{measurements.noseBridgeWidth.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Altura Segmento:</span>
                      <span className="font-medium">{measurements.segmentHeightRight.toFixed(1)} mm</span>
                    </div>
                  </div>
                </div>

                {/* Condições de Medição */}
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Detecção Facial:</span>
                      <span className="font-medium">{Math.round(measurements.faceDetectionConfidence * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Iluminação:</span>
                      <span className="font-medium capitalize">{measurements.lightingCondition}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => saveMeasurementMutation.mutate()}
                    disabled={saveMeasurementMutation.isPending}
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {saveMeasurementMutation.isPending ? 'Salvando...' : 'Salvar Medições'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetMeasurement}
                    className="w-full"
                  >
                    Nova Medição
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}