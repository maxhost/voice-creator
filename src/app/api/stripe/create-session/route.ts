import { NextRequest, NextResponse } from 'next/server';
import { stripe, INTERVIEW_PRICE_ID, INTERVIEW_PRICE_CENTS } from '@/shared/api/stripe';
import { supabase } from '@/shared/api/supabase';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: INTERVIEW_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/interview?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}?canceled=true`,
      metadata: {
        product: 'voice_interview',
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    // Store pending session in Supabase
    const { error: dbError } = await supabase
      .from('payment_sessions')
      .insert({
        stripe_session_id: session.id,
        status: 'pending',
        amount: INTERVIEW_PRICE_CENTS,
        paid_at: null,
        used_at: null,
      });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      // Don't fail the request - user can still pay
      // Webhook will handle the record if it doesn't exist
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
