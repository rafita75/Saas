import mongoose from 'mongoose';

const tenantModuleSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ModulePlan',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due'],
    default: 'active',
  },
  startsAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  canceledAt: Date,
  autoRenew: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Índice único: solo una suscripción activa por módulo por tenant
tenantModuleSchema.index({ tenantId: 1, moduleId: 1 }, { unique: true });
tenantModuleSchema.index({ tenantId: 1, status: 1 });

export const TenantModule = mongoose.model('TenantModule', tenantModuleSchema);