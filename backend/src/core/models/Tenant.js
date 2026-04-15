import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  logo: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'canceled'],
    default: 'active',
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // ✅ Nuevo campo para controlar onboarding
  hasCompletedOnboarding: {
    type: Boolean,
    default: false,
  },
  settings: {
    theme: {
      primaryColor: { type: String, default: '#6366F1' },
      secondaryColor: { type: String, default: '#8B5CF6' },
      font: { type: String, default: 'Inter' },
    },
    features: {
      analytics: { type: Boolean, default: false },
      chat: { type: Boolean, default: false },
    },
  },
}, {
  timestamps: true,
});

export const Tenant = mongoose.model('Tenant', tenantSchema);