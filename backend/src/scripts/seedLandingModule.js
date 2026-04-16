import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Module } from '../core/models/Module.js';
import { ModulePlan } from '../core/models/ModulePlan.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const plans = [
  {
    slug: 'gratis',
    name: 'Gratis',
    priceMonthly: 0,
    priceYearly: 0,
    features: ['1 Landing Page', '5 Secciones', '3 Plantillas básicas', 'Subdominio gratis', 'Formulario básico'],
    limits: {
      maxPages: 1,
      maxSections: 5,
      hasCustomDomain: false,
      templatesLevel: 0,
      canEditCSS: false
    },
    sortOrder: 1
  },
  {
    slug: 'basico',
    name: 'Básico',
    priceMonthly: 39,
    priceYearly: 374,
    features: ['3 Landing Pages', '15 Secciones', '10 Plantillas', 'Menú simple', 'WhatsApp flotante'],
    limits: {
      maxPages: 3,
      maxSections: 15,
      hasCustomDomain: false,
      templatesLevel: 1,
      canEditCSS: false
    },
    sortOrder: 2
  },
  {
    slug: 'pro',
    name: 'Pro',
    priceMonthly: 129,
    priceYearly: 1238,
    features: ['10 Landing Pages', '30 Secciones', 'Todas las plantillas', 'Dominio personalizado', 'Google Analytics'],
    limits: {
      maxPages: 10,
      maxSections: 30,
      hasCustomDomain: true,
      templatesLevel: 2,
      canEditCSS: true
    },
    sortOrder: 3
  },
  {
    slug: 'ultra',
    name: 'Ultra',
    priceMonthly: 299,
    priceYearly: 2870,
    features: ['30 Landing Pages', '100 Secciones', 'Mega menú', 'Modo oscuro automático', 'Hotjar / Heatmaps'],
    limits: {
      maxPages: 30,
      maxSections: 100,
      hasCustomDomain: true,
      templatesLevel: 3,
      canEditCSS: true
    },
    sortOrder: 4
  },
  {
    slug: 'empresa',
    name: 'Empresa',
    priceMonthly: 599,
    priceYearly: 5750,
    features: ['Landing Pages Ilimitadas', 'Secciones Ilimitadas', 'Plantillas exclusivas', 'SLA garantizado', 'Gerente de cuenta'],
    limits: {
      maxPages: 9999,
      maxSections: 9999,
      hasCustomDomain: true,
      templatesLevel: 4,
      canEditCSS: true
    },
    sortOrder: 5
  }
];

const seedLandingModule = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Conectado a MongoDB para seeding...');

    // 1. Crear o actualizar el Módulo
    let landingModule = await Module.findOne({ slug: 'landing-page' });
    
    if (!landingModule) {
      landingModule = await Module.create({
        name: 'Landing Page',
        slug: 'landing-page',
        description: 'Constructor de páginas de aterrizaje profesionales para tu negocio.',
        icon: 'Globe',
        category: 'Marketing',
        isAlpha: false,
        isActive: true
      });
      console.log('✅ Módulo Landing Page creado');
    }

    // 2. Crear los Planes
    for (const planData of plans) {
      await ModulePlan.findOneAndUpdate(
        { moduleId: landingModule._id, slug: planData.slug },
        { ...planData, moduleId: landingModule._id },
        { upsert: true, new: true }
      );
      console.log(`✅ Plan ${planData.name} actualizado/creado`);
    }

    console.log('✨ Seeding completado con éxito');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seeding:', error);
    process.exit(1);
  }
};

seedLandingModule();