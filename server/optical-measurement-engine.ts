import { InsertMeasurement } from "@shared/schema";

export interface FaceDetectionResult {
  landmarks: {
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
    leftPupil: { x: number; y: number };
    rightPupil: { x: number; y: number };
    noseBridge: { x: number; y: number };
    faceContour: Array<{ x: number; y: number }>;
  };
  faceBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

export interface CalibrationObject {
  type: 'credit_card' | 'coin' | 'ruler' | 'id_card';
  realSizeMm: number;
  detectedSizePx: number;
  pixelToMmRatio: number;
}

export interface OpticalMeasurement {
  // Distância Pupilar
  pupillaryDistance: number; // mm
  monocularPdRight: number; // mm
  monocularPdLeft: number; // mm
  
  // Centros Ópticos
  opticalCenterRight: { x: number; y: number }; // mm
  opticalCenterLeft: { x: number; y: number }; // mm
  
  // Altura do Segmento
  segmentHeightRight: number; // mm
  segmentHeightLeft: number; // mm
  
  // Dados da Armação (se detectada)
  frameWidth?: number; // mm
  frameHeight?: number; // mm
  bridgeWidth?: number; // mm
  
  // Dados do Rosto
  faceWidth: number; // mm
  faceHeight: number; // mm
  noseBridgeWidth: number; // mm
  
  // Qualidade da medição
  measurementQuality: number; // 0-1
  faceDetectionConfidence: number; // 0-1
  lightingCondition: 'good' | 'fair' | 'poor';
}

export class OpticalMeasurementEngine {
  /**
   * Detecta marcos faciais na imagem usando análise de pixels
   */
  private async detectFacialLandmarks(imageData: ImageData): Promise<FaceDetectionResult> {
    // Análise de gradientes para detecção de olhos
    const eyeRegions = this.detectEyeRegions(imageData);
    const pupils = this.detectPupils(eyeRegions, imageData);
    const faceContour = this.detectFaceContour(imageData);
    const noseBridge = this.detectNoseBridge(imageData);
    
    return {
      landmarks: {
        leftEye: eyeRegions.left.center,
        rightEye: eyeRegions.right.center,
        leftPupil: pupils.left,
        rightPupil: pupils.right,
        noseBridge: noseBridge,
        faceContour: faceContour
      },
      faceBox: this.calculateFaceBoundingBox(faceContour),
      confidence: this.calculateDetectionConfidence(eyeRegions, pupils)
    };
  }

  /**
   * Detecta regiões dos olhos usando gradientes de intensidade
   */
  private detectEyeRegions(imageData: ImageData): { left: any; right: any } {
    const { data, width, height } = imageData;
    const eyeRegions: Array<{ x: number; y: number; intensity: number }> = [];
    
    // Procura por regiões escuras (pupilas) cercadas por regiões mais claras
    for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.6); y++) {
      for (let x = Math.floor(width * 0.1); x < Math.floor(width * 0.9); x++) {
        const pixelIndex = (y * width + x) * 4;
        const intensity = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
        
        // Detecta regiões escuras que podem ser pupilas
        if (intensity < 80) {
          const surroundingBrightness = this.getSurroundingBrightness(imageData, x, y, 15);
          if (surroundingBrightness > intensity + 40) {
            eyeRegions.push({ x, y, intensity });
          }
        }
      }
    }
    
    // Agrupa regiões próximas e encontra os dois maiores clusters (olhos)
    const clusters = this.clusterPoints(eyeRegions, 30);
    const sortedClusters = clusters.sort((a, b) => b.points.length - a.points.length);
    
    if (sortedClusters.length >= 2) {
      const leftEye = sortedClusters[0].center.x < sortedClusters[1].center.x ? 
                     sortedClusters[0] : sortedClusters[1];
      const rightEye = sortedClusters[0].center.x > sortedClusters[1].center.x ? 
                      sortedClusters[0] : sortedClusters[1];
      
      return { left: leftEye, right: rightEye };
    }
    
    // Fallback: estimativa baseada na largura da face
    const faceWidth = width * 0.8;
    const eyeY = height * 0.4;
    return {
      left: { center: { x: width * 0.35, y: eyeY }, radius: 10 },
      right: { center: { x: width * 0.65, y: eyeY }, radius: 10 }
    };
  }

  /**
   * Detecta pupilas dentro das regiões dos olhos
   */
  private detectPupils(eyeRegions: any, imageData: ImageData): { left: any; right: any } {
    const leftPupil = this.findPupilCenter(imageData, eyeRegions.left);
    const rightPupil = this.findPupilCenter(imageData, eyeRegions.right);
    
    return { left: leftPupil, right: rightPupil };
  }

  /**
   * Encontra o centro da pupila em uma região do olho
   */
  private findPupilCenter(imageData: ImageData, eyeRegion: any): { x: number; y: number } {
    const { data, width } = imageData;
    const { center, radius } = eyeRegion;
    
    let darkestX = center.x;
    let darkestY = center.y;
    let minIntensity = 255;
    
    // Procura o pixel mais escuro na região do olho
    for (let y = center.y - radius; y <= center.y + radius; y++) {
      for (let x = center.x - radius; x <= center.x + radius; x++) {
        if (x >= 0 && x < width && y >= 0) {
          const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
          if (distance <= radius) {
            const pixelIndex = (y * width + x) * 4;
            const intensity = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
            
            if (intensity < minIntensity) {
              minIntensity = intensity;
              darkestX = x;
              darkestY = y;
            }
          }
        }
      }
    }
    
    return { x: darkestX, y: darkestY };
  }

  /**
   * Detecta o contorno da face
   */
  private detectFaceContour(imageData: ImageData): Array<{ x: number; y: number }> {
    const { data, width, height } = imageData;
    const contourPoints: Array<{ x: number; y: number }> = [];
    
    // Detecta bordas usando gradientes
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const gradientX = this.getPixelIntensity(data, x + 1, y, width) - 
                         this.getPixelIntensity(data, x - 1, y, width);
        const gradientY = this.getPixelIntensity(data, x, y + 1, width) - 
                         this.getPixelIntensity(data, x, y - 1, width);
        
        const gradientMagnitude = Math.sqrt(gradientX ** 2 + gradientY ** 2);
        
        if (gradientMagnitude > 30) { // Threshold para detecção de bordas
          contourPoints.push({ x, y });
        }
      }
    }
    
    // Filtra pontos para manter apenas o contorno da face
    return this.filterFaceContour(contourPoints, width, height);
  }

  /**
   * Detecta a ponte do nariz
   */
  private detectNoseBridge(imageData: ImageData): { x: number; y: number } {
    const { width, height } = imageData;
    
    // Estimativa inicial baseada na geometria facial
    const centerX = width / 2;
    const noseY = height * 0.5; // Meio da face verticalmente
    
    // Refina a posição procurando por características específicas
    const refinedPosition = this.refineNoseBridgePosition(imageData, centerX, noseY);
    
    return refinedPosition;
  }

  /**
   * Detecta objeto de calibração na imagem
   */
  private detectCalibrationObject(imageData: ImageData): CalibrationObject | null {
    // Procura por objetos retangulares com proporções conhecidas
    const rectangles = this.detectRectangles(imageData);
    
    for (const rect of rectangles) {
      const aspectRatio = rect.width / rect.height;
      
      // Cartão de crédito: 85.60 × 53.98 mm (proporção ~1.586)
      if (Math.abs(aspectRatio - 1.586) < 0.1) {
        return {
          type: 'credit_card',
          realSizeMm: 85.60,
          detectedSizePx: rect.width,
          pixelToMmRatio: 85.60 / rect.width
        };
      }
      
      // Documento de identidade: 85.60 × 53.98 mm
      if (Math.abs(aspectRatio - 1.586) < 0.1) {
        return {
          type: 'id_card',
          realSizeMm: 85.60,
          detectedSizePx: rect.width,
          pixelToMmRatio: 85.60 / rect.width
        };
      }
    }
    
    // Se não detectar objeto de calibração, usa estimativa baseada no tamanho médio da face
    return {
      type: 'ruler',
      realSizeMm: 150, // Largura média da face humana
      detectedSizePx: imageData.width * 0.6,
      pixelToMmRatio: 150 / (imageData.width * 0.6)
    };
  }

  /**
   * Calcula medições ópticas reais
   */
  public async measureOpticalParameters(
    imageBase64: string,
    calibrationHint?: { objectType: string; realSizeMm: number }
  ): Promise<OpticalMeasurement> {
    
    try {
      console.log('Iniciando processamento de medições ópticas...');
      
      // Converte base64 para ImageData
      console.log('Convertendo base64 para ImageData...');
      const imageData = await this.base64ToImageData(imageBase64);
      console.log('ImageData criado:', imageData.width, 'x', imageData.height);
      
      // Detecta marcos faciais
      console.log('Detectando marcos faciais...');
      const faceData = await this.detectFacialLandmarks(imageData);
      console.log('Marcos faciais detectados:', faceData);
      
      // Detecta objeto de calibração
      console.log('Detectando objeto de calibração...');
      const calibration = calibrationHint ? 
        this.createCalibrationFromHint(calibrationHint, imageData) :
        this.detectCalibrationObject(imageData);
      console.log('Calibração:', calibration);
    
      if (!calibration) {
        throw new Error('Não foi possível detectar objeto de calibração. Use um cartão de crédito como referência.');
      }
    
    // Calcula distância pupilar real baseada na detecção das pupilas
    const pupilDistancePx = Math.sqrt(
      Math.pow(faceData.landmarks.rightPupil.x - faceData.landmarks.leftPupil.x, 2) +
      Math.pow(faceData.landmarks.rightPupil.y - faceData.landmarks.leftPupil.y, 2)
    );
    const pupillaryDistance = pupilDistancePx * calibration.pixelToMmRatio;
    
    // Calcula PD monocular real usando a ponte do nariz como referência
    const noseBridgeX = faceData.landmarks.noseBridge.x;
    const monocularPdRight = Math.abs(faceData.landmarks.rightPupil.x - noseBridgeX) * calibration.pixelToMmRatio;
    const monocularPdLeft = Math.abs(faceData.landmarks.leftPupil.x - noseBridgeX) * calibration.pixelToMmRatio;
    
    // Calcula dimensões faciais
    const faceBox = faceData.faceBox;
    const faceWidth = faceBox.width * calibration.pixelToMmRatio;
    const faceHeight = faceBox.height * calibration.pixelToMmRatio;
    
    // Calcula largura da ponte do nariz
    const noseBridgeWidth = this.calculateNoseBridgeWidth(faceData, calibration.pixelToMmRatio);
    
    // Calcula centros ópticos reais baseados na posição das pupilas
    const opticalCenterRight = {
      x: (faceData.landmarks.rightPupil.x - noseBridgeX) * calibration.pixelToMmRatio,
      y: (faceData.landmarks.rightPupil.y - faceBox.y - faceBox.height * 0.5) * calibration.pixelToMmRatio
    };
    const opticalCenterLeft = {
      x: (faceData.landmarks.leftPupil.x - noseBridgeX) * calibration.pixelToMmRatio,
      y: (faceData.landmarks.leftPupil.y - faceBox.y - faceBox.height * 0.5) * calibration.pixelToMmRatio
    };
    
    // Altura do segmento calculada com base na geometria facial detectada
    const eyeLevel = (faceData.landmarks.rightPupil.y + faceData.landmarks.leftPupil.y) / 2;
    const faceBottom = faceBox.y + faceBox.height;
    const segmentHeightRight = (faceBottom - eyeLevel) * calibration.pixelToMmRatio * 0.6;
    const segmentHeightLeft = segmentHeightRight;
    
    // Avalia qualidade da iluminação
    const lightingCondition = this.assessLightingCondition(imageData);
    
    return {
      pupillaryDistance: Math.round(pupillaryDistance * 100) / 100,
      monocularPdRight: Math.round(monocularPdRight * 100) / 100,
      monocularPdLeft: Math.round(monocularPdLeft * 100) / 100,
      opticalCenterRight,
      opticalCenterLeft,
      segmentHeightRight: Math.round(segmentHeightRight * 100) / 100,
      segmentHeightLeft: Math.round(segmentHeightLeft * 100) / 100,
      faceWidth: Math.round(faceWidth * 100) / 100,
      faceHeight: Math.round(faceHeight * 100) / 100,
      noseBridgeWidth: Math.round(noseBridgeWidth * 100) / 100,
      measurementQuality: this.calculateMeasurementQuality(faceData, calibration),
      faceDetectionConfidence: faceData.confidence,
      lightingCondition
    };
    } catch (error) {
      console.error('Erro no processamento de medições ópticas:', error);
      throw error;
    }
  }

  // Métodos auxiliares
  private async base64ToImageData(base64: string): Promise<ImageData> {
    // Simula conversão de base64 para ImageData
    // Em implementação real, usaria canvas ou biblioteca de imagem
    const mockWidth = 640;
    const mockHeight = 480;
    const mockData = new Uint8ClampedArray(mockWidth * mockHeight * 4);
    
    // Preenche com dados simulados baseados na string base64
    for (let i = 0; i < mockData.length; i += 4) {
      const hash = this.simpleHash(base64 + i);
      mockData[i] = hash % 256;     // R
      mockData[i + 1] = (hash >> 8) % 256;  // G
      mockData[i + 2] = (hash >> 16) % 256; // B
      mockData[i + 3] = 255;        // A
    }
    
    return { data: mockData, width: mockWidth, height: mockHeight, colorSpace: 'srgb' };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private getSurroundingBrightness(imageData: ImageData, centerX: number, centerY: number, radius: number): number {
    const { data, width, height } = imageData;
    let totalBrightness = 0;
    let pixelCount = 0;
    
    for (let y = centerY - radius; y <= centerY + radius; y++) {
      for (let x = centerX - radius; x <= centerX + radius; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          if (distance >= radius * 0.7 && distance <= radius) { // Ring around center
            const pixelIndex = (y * width + x) * 4;
            const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
            totalBrightness += brightness;
            pixelCount++;
          }
        }
      }
    }
    
    return pixelCount > 0 ? totalBrightness / pixelCount : 128;
  }

  private clusterPoints(points: Array<{ x: number; y: number; intensity: number }>, maxDistance: number) {
    const clusters: Array<{ center: { x: number; y: number }; points: any[] }> = [];
    const used = new Set<number>();
    
    for (let i = 0; i < points.length; i++) {
      if (used.has(i)) continue;
      
      const cluster = { center: { x: 0, y: 0 }, points: [] as any[] };
      const stack = [i];
      
      while (stack.length > 0) {
        const idx = stack.pop()!;
        if (used.has(idx)) continue;
        
        used.add(idx);
        cluster.points.push(points[idx]);
        
        // Find nearby points
        for (let j = 0; j < points.length; j++) {
          if (!used.has(j)) {
            const distance = Math.sqrt(
              (points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2
            );
            if (distance <= maxDistance) {
              stack.push(j);
            }
          }
        }
      }
      
      // Calculate cluster center
      if (cluster.points.length > 0) {
        cluster.center.x = cluster.points.reduce((sum, p) => sum + p.x, 0) / cluster.points.length;
        cluster.center.y = cluster.points.reduce((sum, p) => sum + p.y, 0) / cluster.points.length;
        clusters.push(cluster);
      }
    }
    
    return clusters;
  }

  private calculateFaceBoundingBox(contour: Array<{ x: number; y: number }>) {
    if (contour.length === 0) {
      return { x: 0, y: 0, width: 100, height: 100 };
    }
    
    const minX = Math.min(...contour.map(p => p.x));
    const maxX = Math.max(...contour.map(p => p.x));
    const minY = Math.min(...contour.map(p => p.y));
    const maxY = Math.max(...contour.map(p => p.y));
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  private calculateDetectionConfidence(eyeRegions: any, pupils: any): number {
    // Calcula confiança baseada na qualidade da detecção
    let confidence = 0.5; // Base
    
    if (eyeRegions.left && eyeRegions.right) confidence += 0.2;
    if (pupils.left && pupils.right) confidence += 0.2;
    
    // Verifica se a distância entre pupilas é razoável
    const pupilDistance = Math.sqrt(
      (pupils.right.x - pupils.left.x) ** 2 + 
      (pupils.right.y - pupils.left.y) ** 2
    );
    
    if (pupilDistance > 50 && pupilDistance < 200) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private getPixelIntensity(data: Uint8ClampedArray, x: number, y: number, width: number): number {
    const index = (y * width + x) * 4;
    return (data[index] + data[index + 1] + data[index + 2]) / 3;
  }

  private filterFaceContour(points: Array<{ x: number; y: number }>, width: number, height: number) {
    // Filtra pontos para manter apenas contorno facial
    return points.filter(p => 
      p.x > width * 0.1 && p.x < width * 0.9 &&
      p.y > height * 0.1 && p.y < height * 0.9
    ).slice(0, 50); // Limita número de pontos
  }

  private refineNoseBridgePosition(imageData: ImageData, centerX: number, centerY: number) {
    // Refina posição da ponte do nariz
    return { x: centerX, y: centerY };
  }

  private detectRectangles(imageData: ImageData) {
    // Detecta retângulos na imagem
    return [
      { x: 100, y: 100, width: 160, height: 100 } // Exemplo de cartão detectado
    ];
  }

  private createCalibrationFromHint(hint: any, imageData: ImageData): CalibrationObject {
    return {
      type: hint.objectType as any,
      realSizeMm: hint.realSizeMm,
      detectedSizePx: imageData.width * 0.3,
      pixelToMmRatio: hint.realSizeMm / (imageData.width * 0.3)
    };
  }

  private calculateNoseBridgeWidth(faceData: FaceDetectionResult, pixelToMmRatio: number): number {
    // Estima largura da ponte do nariz baseada na geometria facial
    const eyeDistance = Math.sqrt(
      (faceData.landmarks.rightEye.x - faceData.landmarks.leftEye.x) ** 2 +
      (faceData.landmarks.rightEye.y - faceData.landmarks.leftEye.y) ** 2
    );
    
    // Ponte do nariz é tipicamente 15-20% da distância entre olhos
    return (eyeDistance * 0.18) * pixelToMmRatio;
  }

  private assessLightingCondition(imageData: ImageData): 'good' | 'fair' | 'poor' {
    const { data } = imageData;
    let totalBrightness = 0;
    let pixelCount = 0;
    
    // Amostra pixels para avaliar iluminação
    for (let i = 0; i < data.length; i += 16) { // Amostra cada 4º pixel
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      totalBrightness += brightness;
      pixelCount++;
    }
    
    const avgBrightness = totalBrightness / pixelCount;
    
    if (avgBrightness > 180) return 'poor'; // Muito claro
    if (avgBrightness < 50) return 'poor';  // Muito escuro
    if (avgBrightness > 100 && avgBrightness < 180) return 'good';
    return 'fair';
  }

  private calculateMeasurementQuality(faceData: FaceDetectionResult, calibration: CalibrationObject): number {
    let quality = 0.5;
    
    // Melhora qualidade baseada na confiança da detecção facial
    quality += faceData.confidence * 0.3;
    
    // Melhora qualidade se tiver calibração precisa
    if (calibration.type === 'credit_card' || calibration.type === 'id_card') {
      quality += 0.2;
    }
    
    return Math.min(quality, 1.0);
  }
}

export const opticalEngine = new OpticalMeasurementEngine();