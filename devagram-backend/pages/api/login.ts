import type { NextApiRequest, NextApiResponse } from 'next';

export default (
  req : NextApiRequest,
  res : NextApiResponse
) => {
  if (req.method === 'POST') {
    const { usuario, senha } = req.body;
    
    if (usuario === 'cleiton@dev.com.br' && senha === '12345') {
      return res.status(200).json({
        message: 'Usuário autenticado com sucesso!'
      });
    }
    return res.status(400).json({
      erro: 'Usuário ou senha inválidos!'
    });
  }

  return res.status(405).json({
    erro: 'Método informado não é válido!'
  });
}
