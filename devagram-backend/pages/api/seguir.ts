import { UsuarioModel } from '../../models/UsuarioModel';
import { SeguidorModel } from '../../models/SeguidorModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const endpointSeguir = 
  async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
    try {
      if (req.method === 'PUT') {
        const { userId, id } = req?.query;
        const usuarioLogado = await UsuarioModel.findById(userId);

        if (!usuarioLogado) {
          return res.status(400).json({
            error : 'Usuário logado não encontrado!'
          });
        }

        const usuarioASerSeguido = await UsuarioModel.findById(id);
        if (!usuarioASerSeguido) {
          return res.status(400).json({
            error : 'Usuário a ser seguido não encontrado!'
          });
        }

        const euJaSigoEsteUsuario = await SeguidorModel.find({
          usuarioId : usuarioLogado._id,
          usuarioSeguidoId : usuarioASerSeguido._id
        });

        if (euJaSigoEsteUsuario && euJaSigoEsteUsuario.length > 0) {
          euJaSigoEsteUsuario.forEach(async (e : any) => await SeguidorModel.findByIdAndDelete({ _id : e._id }));
          
          usuarioLogado.seguindo--;
          await UsuarioModel.findByIdAndUpdate({
            _id : usuarioLogado._id
          }, usuarioLogado);

          usuarioASerSeguido.seguidores--;
          await UsuarioModel.findByIdAndUpdate({
            _id : usuarioASerSeguido._id
          }, usuarioASerSeguido);

          return res.status(200).json({
            message : `Você deixou de seguir ${ usuarioASerSeguido.nome }`
          });
        } else {
          const seguidor = {
            usuarioId : usuarioLogado._id,
            usuarioSeguidoId : usuarioASerSeguido._id
          };

          await SeguidorModel.create(seguidor);
          
          usuarioLogado.seguindo++;
          await UsuarioModel.findByIdAndUpdate({
            _id : usuarioLogado._id,
          }, usuarioLogado);

          usuarioASerSeguido.seguidores++;
          await UsuarioModel.findByIdAndUpdate({
            _id : usuarioASerSeguido._id
          }, usuarioASerSeguido);

          return res.status(200).json({
            message : `Você começou a seguir ${ usuarioASerSeguido.nome }`
          });
        }
      }

      return res.status(405).json({
        error : 'Método informado na requisição não é válido!'
      });
    } catch(error) {
      console.error(error);
      return res.status(500).json({
        error : 'Não foi possível seguir/desseguir o usuário informado!'
      });
    }
}

export default validarTokenJWT(conectarMongoDB(endpointSeguir));
