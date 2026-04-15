import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,  // ✅ Solo esto es suficiente para el índice único
  },
  ip: String,
  userAgent: String,
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },  // ✅ TTL index - se elimina automáticamente
  },
}, {
  timestamps: true,
});

// ✅ Solo índices adicionales necesarios
sessionSchema.index({ userId: 1 });

export const Session = mongoose.model('Session', sessionSchema);