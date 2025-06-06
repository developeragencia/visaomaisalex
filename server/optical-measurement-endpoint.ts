import express, { Request, Response } from 'express';
import { opticalEngine } from './optical-measurement-engine';

const router = express.Router();

// POST /api/optical-measurement
router.post('/optical-measurement', async (req: Request, res: Response) => {
  try {
    const { imageBase64, calibrationHint } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Imagem base64 é obrigatória.' });
    }
    const result = await opticalEngine.processImage(imageBase64, calibrationHint);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao processar medição óptica.' });
  }
});

export default router; 