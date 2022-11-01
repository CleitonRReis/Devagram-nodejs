import nextConnect from 'next-connect';
import { UsuarioModel } from '../../models/UsuarioModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';

const handler = nextConnect()
  .use(upload.single('file'))
  .put(async (req : NextApiRequest, res :NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);

      if (!usuario) {
        return res.status(400).json({
          error : 'Usuário não encontrado.'
        });
      }

      const { nome } = req?.body;
      if (nome && nome.length > 2) {
        usuario.nome = nome;
      }

      const { file } = req;
      console.log('req', req);
      if (file && file.originalname) {
        const image = await uploadImagemCosmic(req);

        if (image && image.media && image.media.url) {
          usuario.avatar = image.media.url;
        }
      }

      await UsuarioModel.findByIdAndUpdate({
        _id : usuario._id
      }, usuario);

      return res.status(200).json({
        message : 'Usuário atualizado com sucesso.'
      });
    } catch(error) {
      console.error(error);
    }

    return res.status(400).json({
      error : 'Erro ao atualizar dados de usuário.'
    });
}).get(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
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
})

export const config = {
  api : {
    bodyParser : false
  }
}

export default validarTokenJWT(conectarMongoDB(handler));
