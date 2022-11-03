import { NextApiRequest, NextApiResponse } from 'next';
import { UsuarioModel } from '../../models/UsuarioModel';
import { politicaCORS } from '../../middlewares/politicaCORS';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';

const likeEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if (req.method === 'PUT') {
      const { id } = req?.query;
      const publicacao = await PublicacaoModel.findById(id);

      if (!publicacao) {
        return res.status(400).json({
          error : 'Publicação não encontrada!'
        });
      }

      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({
          error : 'Usuário não encontrada!'
        });
      }

      const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario.id.toString());
      if (indexDoUsuarioNoLike != -1) {
        publicacao.likes.splice(indexDoUsuarioNoLike, 1);
        await PublicacaoModel.findByIdAndUpdate({
          _id : publicacao._id
        }, publicacao);

        return res.status(200).json({
          message : 'Publicação descurtida com sucesso!'
        });
      } else {
        publicacao.likes.push(usuario.id);
        await PublicacaoModel.findByIdAndUpdate({
          _id : publicacao._id
        }, publicacao);
      }

      return res.status(200).json({
        message : 'Publicação curtida com sucesso!'
      });
    }

    return res.status(405).json({
      error : 'Método informado não é válido!'
    });
  } catch(error) {
    console.error(error);
    return res.status(500).json({
      error : 'Ocorreu um erro ao curtir/descurtir o post!'
    });
  }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));
