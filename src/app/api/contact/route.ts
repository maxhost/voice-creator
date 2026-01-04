import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/shared/api/supabase';
import type { ContactMessageReason } from '@/shared/api/supabase.types';

const json = NextResponse.json;

// Rate limiting: simple in-memory store (resets on deploy)
const submissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 3;

type ContactReason = 'problem' | 'payment' | 'billing' | 'other';

type ContactForm = {
  name: string;
  email: string;
  reason: ContactReason;
  message: string;
  website?: string; // Honeypot field
  timestamp?: number; // Bot detection
};

const REASON_LABELS: Record<ContactReason, string> = {
  problem: 'Technical Problem',
  payment: 'Payment Issue',
  billing: 'Billing/Invoice',
  other: 'Other',
};

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userSubmissions = submissions.get(ip) || [];

  // Clean old submissions
  const recentSubmissions = userSubmissions.filter(
    (time) => now - time < RATE_LIMIT_WINDOW
  );

  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
    return true;
  }

  // Record this submission
  recentSubmissions.push(now);
  submissions.set(ip, recentSubmissions);

  return false;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (isRateLimited(ip)) {
      return json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json() as ContactForm;
    const { name, email, reason, message, website, timestamp } = body;

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.length > 0) {
      // Silently accept but don't send (fool the bot)
      return json({ success: true });
    }

    // Timestamp check - if form submitted too fast (< 3 seconds), likely a bot
    if (timestamp && Date.now() - timestamp < 3000) {
      return json({ success: true }); // Silently accept
    }

    // Validation
    if (!name || name.trim().length < 2) {
      return json({ error: 'Please enter a valid name' }, { status: 400 });
    }

    if (!email || !validateEmail(email)) {
      return json({ error: 'Please enter a valid email' }, { status: 400 });
    }

    if (!reason || !['problem', 'payment', 'billing', 'other'].includes(reason)) {
      return json({ error: 'Please select a reason' }, { status: 400 });
    }

    if (!message || message.trim().length < 10) {
      return json({ error: 'Message must be at least 10 characters' }, { status: 400 });
    }

    if (message.length > 5000) {
      return json({ error: 'Message is too long' }, { status: 400 });
    }

    // Save to database
    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim(),
        reason: reason as ContactMessageReason,
        message: message.trim(),
        ip_address: ip,
        status: 'received',
      });

    if (dbError) {
      console.error('Failed to save contact message:', dbError);
      return json({ error: 'Failed to send message' }, { status: 500 });
    }

    // Log for backup
    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log('Name:', name.trim());
    console.log('Email:', email.trim());
    console.log('Reason:', REASON_LABELS[reason]);
    console.log('Message:', message.trim().substring(0, 100) + '...');
    console.log('================================');

    return json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return json({ error: 'Failed to send message' }, { status: 500 });
  }
}
