import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/shared/api/stripe';
import { supabase } from '@/shared/api/supabase';
import Stripe from 'stripe';

const json = NextResponse.json;

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return json({ error: 'Webhook not configured' }, { status: 500 });

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) return json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    return json({ error: `Signature failed: ${msg}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const now = new Date().toISOString();
    const email = session.customer_details?.email || null;

    const { error: updateErr } = await supabase.from('payment_sessions')
      .update({ status: 'paid', paid_at: now, customer_email: email })
      .eq('stripe_session_id', session.id);

    if (updateErr) {
      await supabase.from('payment_sessions').insert({
        stripe_session_id: session.id, status: 'paid',
        amount: session.amount_total || 399, paid_at: now,
        customer_email: email, used_at: null,
      });
    }
  }

  return json({ received: true });
}
