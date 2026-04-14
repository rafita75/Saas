import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['trial', 'semilla', 'impulso', 'negocio', 'imperio'],
    default: 'trial',
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'canceled'],
    default: 'active',
  },
  settings: {
    logo: { type: String, default: '' },
    primaryColor: { type: String, default: '#6366F1' },
    secondaryColor: { type: String, default: '#8B5CF6' },
  },
  selectedModules: {
    type: [String],
    default: [],
  },
  trialEndsAt: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Tenant = mongoose.model('Tenant', tenantSchema);