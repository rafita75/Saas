import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'GTQ',
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['recurrente', 'transferencia', 'efectivo'],
  },
  paymentId: String,
  billingPeriod: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  items: [{
    tenantModuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TenantModule',
    },
    moduleName: String,
    planName: String,
    price: Number,
  }],
  paidAt: Date,
}, {
  timestamps: true,
});

invoiceSchema.index({ tenantId: 1 });
invoiceSchema.index({ status: 1 });

export const Invoice = mongoose.model('Invoice', invoiceSchema);