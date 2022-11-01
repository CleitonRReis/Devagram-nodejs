import { UsuarioModel } from '../../models/UsuarioModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const usuarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
  try {
    const { userId } = req?.query;
    const usuario = await UsuarioModel.findById(userId);

    return res.status(200).json(usuario);
  } catch(error) {
    console.error(error);
  }
  return res.status(400).json({
    error : 'Não foi possível obter os dados do usuário!'
  });
}

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));
