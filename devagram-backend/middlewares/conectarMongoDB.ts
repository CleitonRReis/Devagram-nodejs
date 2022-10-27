import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';
import { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) => 
  async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

  //verificar se o banco já está conectado, se estiver, seguir  para o endpoint
  //ou próximo middleware
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  //Já que não está conectado, vamos conectar
  //1º obter a variável de ambiente preenchida no env
  const { DB_CONEXAO_STRING } = process.env;

  //se a env estiver vazia, aborta o uso do sistema e avisa o programador
  if (!DB_CONEXAO_STRING) {
    return res.status(500).json({
      error: 'Env de configuração do banco, não informada!'
    });
  }

  mongoose.connection.on('connected', () => console.log('Banco de dados conectado!'));
  mongoose.connection.on('error', error => console.log(`Houve um erro ao conectar ao banco de dados: ${ error }`));
  await mongoose.connect(DB_CONEXAO_STRING);

  return handler(req, res);
}
