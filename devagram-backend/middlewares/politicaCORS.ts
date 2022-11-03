import NextCors from 'nextjs-cors';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export const politicaCORS = (handler : NextApiHandler) => 
  async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
    try {
      await NextCors(req, res, {
        origin : '*',
        methods : ['GET', 'POST', 'PUT'],
        optionSuccessStatus : 200
      });

      return handler(req, res);
    } catch(error) {
      console.log('Erro ao tratar a política de CORS: ', error);
      res.status(500).json({
        error : 'Ocorreu um erro ao tratar a política de CORS.'
      });
    }
}
