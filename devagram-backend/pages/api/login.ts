import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const endpointLogin = (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg> ) => {
  if (req.method === 'POST') {
    const { usuario, senha } = req.body;
    
    if (usuario === 'cleiton@dev.com.br' && senha === '12345') {
      return res.status(200).json({
        message: 'Usuário autenticado com sucesso!'
      });
    }
    return res.status(400).json({
      error: 'Usuário ou senha inválidos!'
    });
  }

  return res.status(405).json({
    error: 'Método informado não é válido!'
  });
}

export default conectarMongoDB(endpointLogin);
