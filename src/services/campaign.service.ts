import { api } from '@/services/api';

export const campaignService = {
  async tierPaySpec(app: string, tier: string): Promise<Record<string, any>> {
    const resp = await api.post('/api/tiers/pay-spec', { app, tier });
    return resp.data;
  },

  async tierSettle(app: string, tier: string, xPayment: string): Promise<{ success: boolean; error?: string }> {
    const resp = await api.post(
      '/api/tiers/settle',
      { app, tier },
      { headers: { 'X-Payment': xPayment } },
    );
    return resp.data;
  },

  async tierPaypalOrder(app: string, tier: string): Promise<{ success: boolean; paypal_order_id?: string; amount_usd?: string; error?: string }> {
    const resp = await api.post('/api/tiers/paypal-order', { app, tier });
    return resp.data;
  },

  async tierPaypalActivate(app: string, tier: string, orderId: string): Promise<{ success: boolean; error?: string }> {
    const resp = await api.post(
      '/api/tiers/paypal-activate',
      { app, tier, order_id: orderId },
    );
    return resp.data;
  },
};
