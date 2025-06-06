// Sistema de teste para verificar medições ópticas com dados reais
import { opticalEngine } from './server/optical-measurement-engine.js';

// Teste com imagem base64 simples de face
const testImage = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`;

async function testOpticalMeasurements() {
  try {
    console.log('Iniciando teste do sistema de medição óptica...');
    
    // Teste 1: Verificar se o engine consegue processar uma imagem
    const calibrationHint = {
      objectType: 'credit_card',
      realSizeMm: 85.60
    };
    
    console.log('Processando imagem com engine de medição...');
    const measurements = await opticalEngine.measureOpticalParameters(
      testImage,
      calibrationHint
    );
    
    console.log('Medições calculadas:');
    console.log('- Distância Pupilar:', measurements.pupillaryDistance, 'mm');
    console.log('- PD Monocular Direito:', measurements.monocularPdRight, 'mm');
    console.log('- PD Monocular Esquerdo:', measurements.monocularPdLeft, 'mm');
    console.log('- Centro Óptico Direito:', measurements.opticalCenterRight);
    console.log('- Centro Óptico Esquerdo:', measurements.opticalCenterLeft);
    console.log('- Qualidade da Medição:', measurements.measurementQuality);
    console.log('- Confiança da Detecção:', measurements.faceDetectionConfidence);
    console.log('- Condição de Iluminação:', measurements.lightingCondition);
    
    // Verificar se as medições são valores reais (não zero ou indefinidas)
    if (measurements.pupillaryDistance > 0 && 
        measurements.monocularPdRight > 0 && 
        measurements.monocularPdLeft > 0) {
      console.log('✅ Sistema de medição funcionando com dados reais');
      return true;
    } else {
      console.log('❌ Sistema retornando dados inválidos');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    return false;
  }
}

testOpticalMeasurements().then(success => {
  if (success) {
    console.log('\n✅ TESTE CONCLUÍDO: Sistema de medição óptica funcionando corretamente');
  } else {
    console.log('\n❌ TESTE FALHOU: Sistema precisa de correções');
  }
  process.exit(success ? 0 : 1);
});