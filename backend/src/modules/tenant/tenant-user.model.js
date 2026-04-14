import mongoose from 'mongoose';

const tenantUserSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'manager', 'staff'],
    default: 'staff',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Índice compuesto para evitar duplicados
tenantUserSchema.index({ tenantId: 1, userId: 1 }, { unique: true });

export const TenantUser = mongoose.model('TenantUser', tenantUserSchema);