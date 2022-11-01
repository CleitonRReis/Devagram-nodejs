import nextConnect from 'next-connect';
import type { NextApiResponse } from 'next';
import { UsuarioModel } from '../../models/UsuarioModel';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';

const handler = nextConnect()
  .use(upload.single('file'))
  .post(async (req : any, res : NextApiResponse<RespostaPadraoMsg>) => {
    
    try {
      const { userId } = req.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({
          error : 'Usuário não encontrado!'
        });
      }

      if (!req || !req.body) {
        return res.status(400).json({
          error : 'Parâmetros da publicação não informados!'
        });
      }
      
      const { descricao } = req.body;
      if (!descricao || descricao.length < 2) {
        return res.status(400).json({
          error : 'Descrição deve conter, no mínimo, dois caracteres.'
        });
      }

      if (!req.file || !req.file.originalname) {
        return res.status(400).json({
          error : 'Imagem é obrigatória!'
        });
      }

      const image = await uploadImagemCosmic(req);
      const publicacaoASerSalva = {
        descricao,
        data : new Date(),
        foto : image.media.url,
        idUsuario : usuario._id,
      }

      await PublicacaoModel.create(publicacaoASerSalva);

      return res.status(200).json({
        message : 'Publicação criada com sucesso!'
      });
    } catch(error) {
      console.log(error);
      return res.status(400).json({
        error : 'Houve um erro ao salvar a publicação!'
      })
    }
})

export const config = {
  api: {
    bodyParser : false
  }
}

export default validarTokenJWT(conectarMongoDB(handler));
