import { NextResponse } from 'next/server';

const HUBSPOT_PORTAL_ID = '246175508';
const HUBSPOT_FORM_GUID = 'a18c2eec-dedb-4078-b1e8-a5e0128c11ed';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, hutk } = body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'A valid business email address is required.' },
        { status: 400 }
      );
    }

    const payload = {
      fields: [
        { name: 'email', value: email.trim() },
        { name: 'firstname', value: (name || '').trim() },
        { name: 'subject', value: (subject || '').trim() },
        { name: 'message', value: (message || '').trim() },
      ],
      context: {
        pageUri: 'https://aiforbusinesshub.com/contact',
        pageName: 'Contact Us | AIForBusinessHub',
        ...(hutk ? { hutk } : {}),
      },
    };

    const hsResponse = await fetch(
      `https://api-na2.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!hsResponse.ok) {
      const errText = await hsResponse.text();
      console.error('HubSpot API submission error:', hsResponse.status, errText);
      return NextResponse.json(
        { error: 'Failed to submit inquiry to HubSpot.' },
        { status: hsResponse.status }
      );
    }

    const result = await hsResponse.json().catch(() => ({}));
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error('Contact API server error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while transmitting inquiry.' },
      { status: 500 }
    );
  }
}
