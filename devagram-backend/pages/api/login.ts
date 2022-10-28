import md5 from 'md5';
import { UsuarioModel } from '../../models/UsuarioModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';

const endpointLogin = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg> ) => {
  if (req.method === 'POST') {
    const { login, senha } = req.body;
    const buscarUsuario = await UsuarioModel.find({
      email : login,
      senha : md5(senha)
    });

    if (buscarUsuario && buscarUsuario.length > 0) {
      const usuarioEncontrado = buscarUsuario[0];

      return res.status(200).json({
        message: `Usuário ${ usuarioEncontrado.nome } autenticado com sucesso!`
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
