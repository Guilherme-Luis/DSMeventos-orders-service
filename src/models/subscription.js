// src/models/subscription.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
    userId: { type: String, required: true, index: true },
    eventId: { type: String, required: true, index: true },

    // snapshot opcional dos dados do evento
    eventTitle: { type: String, default: null },
    eventDate: { type: Date, default: null },
    eventDescription: { type: String, default: null },

    createdAt: { type: Date, default: () => new Date() }
}, { collection: 'subscriptions' });

// índice único composto para evitar inscrições duplicadas
SubscriptionSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// evita erro "Cannot overwrite model once compiled" em dev/hot-reload
export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
