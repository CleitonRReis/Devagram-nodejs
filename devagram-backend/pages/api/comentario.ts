import { UsuarioModel } from '../../models/UsuarioModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { PublicacaoModel } from '../../models/PublicacaoModel';

const comentarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if (req.method === 'PUT') {
      const { userId, id } = req?.query
      const usuarioLogado = await UsuarioModel.findById(userId);

      if (!usuarioLogado) {
        return res.status(400).json({
          error : 'Usuário não encontrado!'
        });
      }

      const publicacao = await PublicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({
          error : 'Publicação não encontrada!'
        });
      }

      if (!req.body || !req.body.comentario || req.body.comentario.length < 2) {
        return res.status(400).json({
          error : 'Comentário inválido!'
        });
      }

      const comentario = {
        nome : usuarioLogado.nome,
        usuarioId : usuarioLogado._id,
        comentario : req.body.comentario
      }

      publicacao.comentarios.push(comentario);
      await PublicacaoModel.findByIdAndUpdate({
        _id : publicacao._id
      }, publicacao);

      return res.status(200).json({
        message : 'Comentário adicionado com sucesso!'
      });
    }

    return res.status(405).json({
      error : `Método informado na requisição - ${ req.method } - inválido.`
    });
  } catch(error) {
    console.error(error);
    return res.status(500).json({
      error : 'Ocorreu um erro ao fazer o comentário.'
    });
  }
};

export default validarTokenJWT(conectarMongoDB(comentarioEndpoint));
