import mongoose, { Schema } from 'mongoose';

const UsuarioSchema = new Schema({
  nome: { type : String, required: true },
  email: { type : String, required: true },
  senha: { type : String, required: true },
  seguindo: { type : Number, default: 0 },
  seguidores: { type : Number, default: 0 },
  publicacoes: { type : Number, default: 0 },
  avatar: { type : String, required: false },
})

export const UsuarioModel = (mongoose.models.usuarios || mongoose.model('usuarios', UsuarioSchema));
