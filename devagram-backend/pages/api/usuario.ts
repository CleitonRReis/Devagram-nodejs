import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
  return res.status(200).json({
    message : 'Usuário autenticado com sucesso'
  });
}

export default validarTokenJWT(usuarioEndpoint);
