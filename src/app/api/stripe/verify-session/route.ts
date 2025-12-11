import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/api/supabase';
import { stripe } from '@/shared/api/stripe';
import type { PaymentSession } from '@/shared/api/supabase.types';

const json = NextResponse.json;
const selectFields = 'id, stripe_session_id, status, amount, created_at, paid_at, used_at';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) return json({ error: 'Missing session_id' }, { status: 400 });

  try {
    const { data: session, error: dbError } = await supabase
      .from('payment_sessions').select(selectFields)
      .eq('stripe_session_id', sessionId).single<PaymentSession>();

    if (dbError && dbError.code !== 'PGRST116') console.error('DB error:', dbError);
    if (session?.status === 'paid') return json({ status: 'paid', sessionId: session.stripe_session_id });
    if (session?.status === 'used') return json({ status: 'used', error: 'Session already used' });

    // Fallback: verify with Stripe (handles webhook race condition)
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (stripeSession.payment_status === 'paid') {
      const now = new Date().toISOString();
      const email = stripeSession.customer_details?.email || null;
      if (session) {
        await supabase.from('payment_sessions').update({ status: 'paid', paid_at: now, customer_email: email }).eq('stripe_session_id', sessionId);
      } else {
        await supabase.from('payment_sessions').insert({ stripe_session_id: sessionId, status: 'paid', amount: stripeSession.amount_total || 399, paid_at: now, customer_email: email, used_at: null });
      }
      return json({ status: 'paid', sessionId });
    }

    return json({ status: 'pending', error: 'Payment not completed' });
  } catch (error) {
    console.error('Verify error:', error);
    return json({ status: 'error', error: 'Failed to verify' }, { status: 500 });
  }
}
