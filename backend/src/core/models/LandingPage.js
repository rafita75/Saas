import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['hero', 'features', 'pricing', 'contact', 'testimonials', 'gallery', 'faq', 'cta', 'video', 'blog'],
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const landingPageSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    default: '/',
    lowercase: true,
    trim: true,
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String,
  },
  theme: {
    primaryColor: String,
    secondaryColor: String,
    font: String,
    darkMode: { type: Boolean, default: false },
  },
  sections: [sectionSchema],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Índice para asegurar que el path sea único por tenant
landingPageSchema.index({ tenantId: 1, path: 1 }, { unique: true });

export const LandingPage = mongoose.model('LandingPage', landingPageSchema);