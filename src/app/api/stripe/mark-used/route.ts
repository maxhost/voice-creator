import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/api/supabase';

const json = NextResponse.json;

export async function POST(request: NextRequest) {
  try {
    const { sessionId, ideasGenerated } = await request.json();

    if (!sessionId) return json({ error: 'Missing sessionId' }, { status: 400 });

    const { error } = await supabase.from('payment_sessions')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        ideas_generated: ideasGenerated || 0,
      })
      .eq('stripe_session_id', sessionId)
      .eq('status', 'paid');

    if (error) {
      console.error('Mark used error:', error);
      return json({ error: 'Failed to mark session' }, { status: 500 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Mark used error:', error);
    return json({ error: 'Failed to mark session' }, { status: 500 });
  }
}
