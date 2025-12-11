import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/api/supabase';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    // Mark session as used
    const { error } = await supabase
      .from('payment_sessions')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', sessionId)
      .eq('status', 'paid'); // Only update if currently paid

    if (error) {
      console.error('Mark used error:', error);
      return NextResponse.json(
        { error: 'Failed to mark session as used' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark used error:', error);
    return NextResponse.json(
      { error: 'Failed to mark session as used' },
      { status: 500 }
    );
  }
}
