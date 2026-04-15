import mongoose from 'mongoose';

const modulePlanSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  priceMonthly: {
    type: Number,
    required: true,
    min: 0,
  },
  priceYearly: {
    type: Number,
    min: 0,
  },
  features: {
    type: [String],
    default: [],
  },
  limits: {
    products: { type: Number, default: 0 },
    storage: { type: Number, default: 0 },
    employees: { type: Number, default: 0 },
    images: { type: Number, default: 0 },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Índice compuesto único
modulePlanSchema.index({ moduleId: 1, slug: 1 }, { unique: true });

export const ModulePlan = mongoose.model('ModulePlan', modulePlanSchema);