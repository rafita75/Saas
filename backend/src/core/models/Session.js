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
    unique: true,
  },
  ip: String,
  userAgent: String,
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL - se elimina automáticamente al expirar
  },
}, {
  timestamps: true,
});

sessionSchema.index({ userId: 1 });
sessionSchema.index({ token: 1 });

export const Session = mongoose.model('Session', sessionSchema);