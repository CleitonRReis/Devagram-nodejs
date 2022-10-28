import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../../models/UsuarioModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { LoginRespostaRequisicao } from '../../types/LoginResposta';

const endpointLogin = 
  async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | LoginRespostaRequisicao> ) => {
    const { MINHA_CHAVE_JWT } = process.env;

    if (!MINHA_CHAVE_JWT) {
      return res.status(500).json({
        error: 'ENV JWT não informado!'
      });
    }

    if (req.method === 'POST') {
      const { login, senha } = req.body;
      const buscarUsuario = await UsuarioModel.find({
        email : login,
        senha : md5(senha)
      });

      if (buscarUsuario && buscarUsuario.length > 0) {
        const usuarioEncontrado = buscarUsuario[0];
        const token = jwt.sign({
          _id : usuarioEncontrado._id
        }, MINHA_CHAVE_JWT);

        return res.status(200).json({
          nome : usuarioEncontrado.nome,
          email : usuarioEncontrado.email,
          token
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
