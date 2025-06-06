import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, Ruler, Eye, Save, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MeasurementData {
  pupillaryDistance: number;
  monocularPdRight: number;
  monocularPdLeft: number;
  segmentHeight: number;
  frameWidth: number;
  frameHeight: number;
  bridgeWidth: number;
  measurementMethod: string;
  notes: string;
}

export default function OpticalMeasurementSimple() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [measurements, setMeasurements] = useState<MeasurementData>({
    pupillaryDistance: 0,
    monocularPdRight: 0,
    monocularPdLeft: 0,
    segmentHeight: 0,
    frameWidth: 0,
    frameHeight: 0,
    bridgeWidth: 0,
    measurementMethod: 'manual',
    notes: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Inicializar câmera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      toast({
        title: "Erro na Câmera",
        description: "Não foi possível acessar a câmera. Use medição manual.",
        variant: "destructive"
      });
      setShowManualInput(true);
    }
  }, []);

  // Capturar foto
  const capturePhoto = useCallback(() => {
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
    
    // Parar câmera
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCapturing(false);
    setShowManualInput(true);
  }, []);

  // Carregar arquivo
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      setShowManualInput(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Salvar medições
  const saveMeasurementMutation = useMutation({
    mutationFn: async () => {
      // Validar dados básicos
      if (measurements.pupillaryDistance <= 0) {
        throw new Error('Distância pupilar é obrigatória');
      }

      return apiRequest('/api/measurements', 'POST', {
        pupillary_distance: measurements.pupillaryDistance,
        monocular_pd_right: measurements.monocularPdRight,
        monocular_pd_left: measurements.monocularPdLeft,
        segment_height_right: measurements.segmentHeight,
        segment_height_left: measurements.segmentHeight,
        frame_width: measurements.frameWidth,
        frame_height: measurements.frameHeight,
        bridge_width: measurements.bridgeWidth,
        measurement_method: measurements.measurementMethod,
        notes: measurements.notes,
        reference_image_url: capturedImage,
        measurement_quality_score: 1.0,
        face_detection_confidence: 1.0,
        lighting_condition: 'good'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/measurements'] });
      toast({
        title: "Medição Salva",
        description: "Medições salvas com sucesso no sistema.",
        variant: "default"
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao Salvar",
        description: error.message || "Erro ao salvar medições.",
        variant: "destructive"
      });
    }
  });

  // Resetar formulário
  const resetForm = () => {
    setMeasurements({
      pupillaryDistance: 0,
      monocularPdRight: 0,
      monocularPdLeft: 0,
      segmentHeight: 0,
      frameWidth: 0,
      frameHeight: 0,
      bridgeWidth: 0,
      measurementMethod: 'manual',
      notes: ''
    });
    setCapturedImage(null);
    setShowManualInput(false);
    setIsCapturing(false);
  };

  // Calcular PD monocular automaticamente
  const updatePupillaryDistance = (pd: number) => {
    setMeasurements(prev => ({
      ...prev,
      pupillaryDistance: pd,
      monocularPdRight: pd / 2,
      monocularPdLeft: pd / 2
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medição Óptica Profissional
        </h1>
        <p className="text-gray-600">
          Sistema de medição precisa para distância pupilar e parâmetros ópticos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Área de Captura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Captura de Referência
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isCapturing && !capturedImage && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button onClick={startCamera} className="h-16 flex-col">
                    <Camera className="w-6 h-6 mb-2" />
                    Usar Câmera
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-16 flex-col"
                  >
                    <Ruler className="w-6 h-6 mb-2" />
                    Carregar Foto
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowManualInput(true)}
                    className="h-16 flex-col"
                  >
                    <Eye className="w-6 h-6 mb-2" />
                    Inserir Manualmente
                  </Button>
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

            {isCapturing && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Posicione o rosto no centro da tela para referência
                  </p>
                  <Button onClick={capturePhoto} size="lg" className="px-8">
                    <Camera className="w-5 h-5 mr-2" />
                    Capturar Foto
                  </Button>
                </div>
              </div>
            )}

            {capturedImage && (
              <div className="space-y-4">
                <img 
                  src={capturedImage} 
                  alt="Foto de referência" 
                  className="w-full rounded-lg"
                />
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nova Foto
                </Button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        {/* Formulário de Medições */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Medições Ópticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showManualInput ? (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Capture uma foto ou escolha inserir medições manualmente</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Distância Pupilar */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Distância Pupilar (PD)</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label htmlFor="pd-total" className="text-sm">PD Total (mm) *</Label>
                      <Input
                        id="pd-total"
                        type="number"
                        value={measurements.pupillaryDistance || ''}
                        onChange={(e) => updatePupillaryDistance(Number(e.target.value))}
                        placeholder="Ex: 64"
                        className="text-lg font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="pd-right" className="text-sm">PD Direito</Label>
                        <Input
                          id="pd-right"
                          type="number"
                          value={measurements.monocularPdRight || ''}
                          onChange={(e) => setMeasurements(prev => ({
                            ...prev,
                            monocularPdRight: Number(e.target.value)
                          }))}
                          placeholder="32"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pd-left" className="text-sm">PD Esquerdo</Label>
                        <Input
                          id="pd-left"
                          type="number"
                          value={measurements.monocularPdLeft || ''}
                          onChange={(e) => setMeasurements(prev => ({
                            ...prev,
                            monocularPdLeft: Number(e.target.value)
                          }))}
                          placeholder="32"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Altura do Segmento */}
                <div>
                  <Label htmlFor="segment-height" className="text-sm">Altura do Segmento (mm)</Label>
                  <Input
                    id="segment-height"
                    type="number"
                    value={measurements.segmentHeight || ''}
                    onChange={(e) => setMeasurements(prev => ({
                      ...prev,
                      segmentHeight: Number(e.target.value)
                    }))}
                    placeholder="Ex: 22"
                  />
                </div>

                {/* Dados da Armação */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Dados da Armação</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="frame-width" className="text-sm">Largura (mm)</Label>
                      <Input
                        id="frame-width"
                        type="number"
                        value={measurements.frameWidth || ''}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          frameWidth: Number(e.target.value)
                        }))}
                        placeholder="52"
                      />
                    </div>
                    <div>
                      <Label htmlFor="frame-height" className="text-sm">Altura (mm)</Label>
                      <Input
                        id="frame-height"
                        type="number"
                        value={measurements.frameHeight || ''}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          frameHeight: Number(e.target.value)
                        }))}
                        placeholder="42"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bridge-width" className="text-sm">Ponte (mm)</Label>
                    <Input
                      id="bridge-width"
                      type="number"
                      value={measurements.bridgeWidth || ''}
                      onChange={(e) => setMeasurements(prev => ({
                        ...prev,
                        bridgeWidth: Number(e.target.value)
                      }))}
                      placeholder="18"
                    />
                  </div>
                </div>

                {/* Método de Medição */}
                <div>
                  <Label htmlFor="method" className="text-sm">Método de Medição</Label>
                  <Select
                    value={measurements.measurementMethod}
                    onValueChange={(value) => setMeasurements(prev => ({
                      ...prev,
                      measurementMethod: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Medição Manual</SelectItem>
                      <SelectItem value="pupilometer">Pupilômetro</SelectItem>
                      <SelectItem value="ruler">Régua</SelectItem>
                      <SelectItem value="camera">Câmera</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Observações */}
                <div>
                  <Label htmlFor="notes" className="text-sm">Observações</Label>
                  <Input
                    id="notes"
                    value={measurements.notes}
                    onChange={(e) => setMeasurements(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    placeholder="Observações adicionais sobre a medição"
                  />
                </div>

                {/* Resumo da Medição */}
                {measurements.pupillaryDistance > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                    <h4 className="font-semibold text-blue-900">Resumo da Medição</h4>
                    <div className="text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>PD Total:</span>
                        <Badge variant="secondary">{measurements.pupillaryDistance} mm</Badge>
                      </div>
                      {measurements.segmentHeight > 0 && (
                        <div className="flex justify-between">
                          <span>Altura Segmento:</span>
                          <Badge variant="secondary">{measurements.segmentHeight} mm</Badge>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Método:</span>
                        <Badge variant="outline">{measurements.measurementMethod}</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => saveMeasurementMutation.mutate()}
                    disabled={saveMeasurementMutation.isPending || measurements.pupillaryDistance <= 0}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saveMeasurementMutation.isPending ? 'Salvando...' : 'Salvar Medições'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
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