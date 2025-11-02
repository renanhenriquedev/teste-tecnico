import mongoose, { Schema } from 'mongoose';

const AuditSchema = new Schema(
  {
    type: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export const AuditModel = mongoose.model('Audit', AuditSchema);
