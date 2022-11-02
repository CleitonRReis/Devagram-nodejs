import { UsuarioModel } from '../../models/UsuarioModel';
import { SeguidorModel } from '../../models/SeguidorModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
  try {
    if (req.method === 'GET') {
      if (req?.query?.id) {
        const usuario = await UsuarioModel.findById(req?.query?.id);

        if (!usuario) {
          return res.status(400).json({
            error : 'Usuário não encontrado!'
          });
        }

        const publicacoes = await PublicacaoModel
          .find({ idUsuario : usuario._id })
          .sort({ data : -1 });
        
          return res.status(200).json(publicacoes);
        } else {
          const { userId } = req?.query;
          const usuarioLogado = await UsuarioModel.findById(userId);

          if (!usuarioLogado) {
            return res.status(400).json({
              error : 'Usuário não encontrado.'
            });
          }

          const seguidores = await SeguidorModel.find({ usuarioId : usuarioLogado._id });
          const seguidoresIds = seguidores.map(e => e.usuarioSeguidoId);
          
          const publicacoes = await PublicacaoModel.find({
            $or : [
              { idUsuario : seguidoresIds },
              { idUsuario : usuarioLogado._id }
            ]
          }).sort({ data : -1 });

          const results = [];
          for (const publicacao of publicacoes) {
            const usuarioDaPulicacao = await UsuarioModel.findById(publicacao.idUsuario);

            if (usuarioDaPulicacao) {
              const objetoFinal = {...publicacao._doc, usuario : {
                nome : usuarioDaPulicacao.nome,
                avatar : usuarioDaPulicacao.avatar
              }};

              results.push(objetoFinal);
            }
          }

          return res.status(200).json(results);
        }
    }

    return res.status(405).json({
      error : 'Método informado não é válido!'
    });
  } catch(error) {
    console.error(error);
  }

  return res.status(400).json({
    error : 'Não foi possível obter o feed do usuário.'
  });
}

export default validarTokenJWT(conectarMongoDB(feedEndpoint));
