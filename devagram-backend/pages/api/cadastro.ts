import md5 from 'md5';
import nextConnect from 'next-connect';
import { UsuarioModel } from '../../models/UsuarioModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';

const handler = nextConnect()
  .use(upload.single('file'))
  .post(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
    try {
      console.log('cadastrar usuario', req.body)
      const usuario = req.body as CadastroRequisicao;
      const validarNome = !usuario.nome || usuario.nome.length < 2;
      const validarSenha = !usuario.senha || usuario.senha.length < 4;
      const validarEmail = !usuario.email || 
                            usuario.email.length < 5 || 
                            !usuario.email.includes('@') || 
                            !usuario.email.includes('.com');
  
      if (validarNome) {
        return res.status(400).json({
          error : 'Nome inválido!'
        });
      }
  
      if (validarEmail) {
        return res.status(400).json({
          error : 'Email informado é inválido!'
        });
      }
  
      if (validarSenha) {
        return res.status(400).json({
          error : 'Senha inválida! Senha deve conter, pelo menos, 4 caracteres!'
        });
      }
      
      const validarSeUsuarioExiste = await UsuarioModel.find({
        email : usuario.email
      });
      
      if (validarSeUsuarioExiste && validarSeUsuarioExiste.length > 0) {
        return res.status(400).json({
          message : 'Usuário já existe no banco com o email informado!'
        });
      }

      //enviar imagem do multer para o cosmicjs
      const image = await uploadImagemCosmic(req);
      console.log('image bla', image);

      const usuarioASerSalvo = {
        nome: usuario.nome,
        email: usuario.email,
        senha: md5(usuario.senha),
        avatar: image?.media?.url
      }

      await UsuarioModel.create(usuarioASerSalvo);
      return res.status(200).json({
        message : 'Usuário cadastrado com sucesso!'
      });
    }
    catch(e) {
      console.log(e)
      return res.status(500).json({
        error : 'Erro ao cadastrar usuário!'
    });
  }
})

export const config = {
  api: {
    bodyParser : false
  }
}

export default conectarMongoDB(handler);
