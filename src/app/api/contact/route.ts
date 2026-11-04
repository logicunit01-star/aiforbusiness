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

    const trimmedEmail = email.trim();
    const trimmedName = (name || '').trim();
    const trimmedSubject = (subject || '').trim();
    const trimmedMessage = (message || '').trim();

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      undefined;

    const hsContext = {
      pageUrl: 'https://aiforbusinesshub.com/contact',
      pageName: 'Contact Us | AIForBusinessHub',
      ...(clientIp ? { ipAddress: clientIp } : {}),
      ...(hutk ? { hutk } : {}),
    };

    // 1. Submit via HubSpot Form Upload API (v2) - natively creates contact and populates form submissions
    const v2Params = new URLSearchParams();
    v2Params.append('firstname', trimmedName);
    v2Params.append('name', trimmedName);
    v2Params.append('email', trimmedEmail);
    v2Params.append('aiforbusiness_subject', trimmedSubject);
    v2Params.append('subject', trimmedSubject);
    v2Params.append('aiforbusiness_message', trimmedMessage);
    v2Params.append('message', trimmedMessage);
    v2Params.append('hs_context', JSON.stringify(hsContext));

    const v2Promise = fetch(
      `https://forms.hubspot.com/uploads/form/v2/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: v2Params.toString(),
      }
    );

    // 2. Submit via HubSpot Form Submissions API (v3) with exact custom property names
    const v3Payload = {
      submittedAt: Date.now(),
      fields: [
        { name: 'firstname', value: trimmedName },
        { name: 'name', value: trimmedName },
        { name: 'email', value: trimmedEmail },
        { name: 'aiforbusiness_subject', value: trimmedSubject },
        { name: 'subject', value: trimmedSubject },
        { name: 'aiforbusiness_message', value: trimmedMessage },
        { name: 'message', value: trimmedMessage },
      ],
      context: {
        pageUri: 'https://aiforbusinesshub.com/contact',
        pageName: 'Contact Us | AIForBusinessHub',
        ...(clientIp ? { ipAddress: clientIp } : {}),
        ...(hutk ? { hutk } : {}),
      },
    };

    const v3Promise = fetch(
      `https://api-na2.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(v3Payload),
      }
    );

    const [v2Res, v3Res] = await Promise.allSettled([v2Promise, v3Promise]);

    const v2Ok = v2Res.status === 'fulfilled' && (v2Res.value.status === 204 || v2Res.value.ok);
    const v3Ok = v3Res.status === 'fulfilled' && v3Res.value.ok;

    if (!v2Ok && !v3Ok) {
      console.error('Both HubSpot endpoints failed:', { v2Res, v3Res });
      return NextResponse.json(
        { error: 'Failed to record lead in HubSpot.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the lead.' },
      { status: 500 }
    );
  }
}
