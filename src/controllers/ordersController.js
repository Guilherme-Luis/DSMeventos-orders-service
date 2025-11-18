// src/controllers/ordersController.js
import Subscription from '../models/subscription.js';

const { DSM_EVENTS_SERVICE } = process.env;

/**
 * Normaliza o ID do evento retornado pelo events-service.
 */
function normalizeEventId(eventObj, fallbackEventId) {
  if (!eventObj) return fallbackEventId || null;
  return eventObj._id ?? eventObj.id ?? fallbackEventId ?? null;
}

/**
 * Busca um evento pelo ID via Events-Service (Gateway)
 */
async function fetchEvent(eventId) {
  if (!DSM_EVENTS_SERVICE) throw new Error('DSM_EVENTS_SERVICE não configurado');

  const url = `${DSM_EVENTS_SERVICE}/${eventId}`;
  const res = await fetch(url);

  if (res.status === 200) {
    return await res.json();
  }
  if (res.status === 404) {
    return null;
  }

  const text = await res.text();
  throw new Error(`Events-service retornou ${res.status}: ${text}`);
}

/**
 * POST /api/orders/subscribe
 */
export async function subscribe(req, res) {
  try {
    const userId = req.user?.id;
    const { eventId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });
    if (!eventId) return res.status(400).json({ message: 'eventId é obrigatório' });

    // 1 — Valida existência do evento
    let eventObj;
    try {
      eventObj = await fetchEvent(eventId);
    } catch (err) {
      console.error('Erro ao comunicar com events-service:', err.message);
      return res.status(502).json({
        message: 'Erro ao comunicar com events-service',
        error: err.message
      });
    }

    if (!eventObj) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // 2 — Snapshot dos dados do evento
    const snapshot = {
      eventTitle: eventObj.title ?? null,
      eventDate: eventObj.date ? new Date(eventObj.date) : null,
      eventDescription: eventObj.description ?? null
    };

    // 3 — Criar inscrição
    let subscription;
    try {
      subscription = await Subscription.create({
        userId,
        eventId,
        ...snapshot
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: 'Usuário já inscrito neste evento' });
      }
      console.error('Erro ao criar inscrição:', err);
      return res.status(500).json({ message: 'Erro ao criar inscrição', error: err.message });
    }

    const normalizedEventId = normalizeEventId(eventObj, eventId);

    return res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      subscription: {
        id: subscription._id,
        userId: subscription.userId,
        eventId: subscription.eventId,
        createdAt: subscription.createdAt,
      },
      event: {
        id: normalizedEventId,
        data: eventObj
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
}

/**
 * GET /api/orders/my-subscriptions
 */
export async function mySubscriptions(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const subs = await Subscription.find({ userId }).lean();

    const detailed = await Promise.all(subs.map(async (s) => {
      let eventObj = null;

      // Tenta buscar do Events-Service, mas se falhar usamos snapshot
      try {
        eventObj = await fetchEvent(s.eventId);
      } catch (e) {
        console.warn(`Falha ao buscar evento ${s.eventId}:`, e.message);
        eventObj = null;
      }

      const normalizedEventId = normalizeEventId(eventObj, s.eventId);

      return {
        subscriptionId: s._id,
        createdAt: s.createdAt,
        eventId: s.eventId,
        event: {
          id: normalizedEventId,
          data: eventObj ?? {
            _id: s.eventId,
            title: s.eventTitle,
            date: s.eventDate,
            description: s.eventDescription
          }
        }
      };
    }));

    return res.json({ subscriptions: detailed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar inscrições', error: err.message });
  }
}

/**
 * DELETE /api/orders/:subscriptionId
 */
export async function cancelSubscription(req, res) {
  try {
    const userId = req.user?.id;
    const { subscriptionId } = req.params;

    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });
    if (!subscriptionId) return res.status(400).json({ message: 'subscriptionId é obrigatório' });

    const sub = await Subscription.findById(subscriptionId);
    if (!sub) return res.status(404).json({ message: 'Inscrição não encontrada' });

    if (String(sub.userId) !== String(userId)) {
      return res.status(403).json({ message: 'Não autorizado a cancelar esta inscrição' });
    }

    await Subscription.deleteOne({ _id: subscriptionId });

    return res.json({ message: 'Inscrição cancelada com sucesso', subscriptionId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao cancelar inscrição', error: err.message });
  }
}
