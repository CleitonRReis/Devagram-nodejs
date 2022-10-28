import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler : NextApiHandler) => 
  (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { MINHA_CHAVE_JWT } = process.env;
      if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({
          error : 'ENV chave JWT não foi informada na execucão do projeto!'
        });
      }
  
      if (!req || !req.headers) {
        return res.status(401).json({
          error : 'Não foi possível validar o token de acesso'
        });
      }
  
      if (req.method !== 'OPTIONS') {
        const { authorization } = req.headers;
        if (!authorization) {
          return res.status(401).json({
            error : 'Não foi possível validar o token de acesso'
          });
        }
  
        const token = authorization.substring(7);
        if (!token) {
          return res.status(401).json({
            error : 'Não foi possível validar o token de acesso'
          });
        }
  
        const tokenDecodificado = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
        if (!tokenDecodificado) {
          return res.status(401).json({
            error : 'Não foi possível validar o token de acesso'
          });
        }
  
        if (!req.query) {
          req.query = {};
        }
  
        req.query.userId = tokenDecodificado._id;
      }
    }catch(error) {
      console.error(error);
      return res.status(401).json({
        message : 'Não foi possível validar o token de acesso'
      });
    }

  return handler(req, res);
}
