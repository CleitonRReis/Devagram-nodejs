import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../models/UsuarioModel';

const pesquisaEndpoint = 
  async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try {
      if (req.method === 'GET') {
        const { filtro } = req?.query;

        if (!filtro || filtro.length < 2) {
          res.status(400).json({
            error : 'Favor informar, pelo menos, dois caracteres'
          });
        }

        const usuariosEncontrados = await UsuarioModel.find({
          $or : [
            { nome : { $regex : filtro, $options: 'i'} },
            { email : { $regex : filtro, $options: 'i' } }
          ]
        });

        return res.status(200).json(usuariosEncontrados);
      }


      return res.status(405).json({
        error : `Método de requisição informado: ${ req.method } não é válido!`
      });
    } catch(error) {
      console.error(error);
      return res.status(500).json({
        error : 'Não foi possível buscar usuários! =/'
      });
    }
}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
