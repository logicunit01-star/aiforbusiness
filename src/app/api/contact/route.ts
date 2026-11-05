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

    // Attempt direct HubSpot API submission asynchronously
    // (Note: Site leads are also captured directly by HubSpot Collected Forms via the tracking script)
    try {
      const v2Params = new URLSearchParams();
      v2Params.append('firstname', trimmedName);
      v2Params.append('name', trimmedName);
      v2Params.append('email', trimmedEmail);
      v2Params.append('aiforbusiness_subject', trimmedSubject);
      v2Params.append('subject', trimmedSubject);
      v2Params.append('aiforbusiness_message', trimmedMessage);
      v2Params.append('message', trimmedMessage);
      v2Params.append('hs_context', JSON.stringify(hsContext));

      fetch(`https://forms.hubspot.com/uploads/form/v2/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: v2Params.toString(),
      }).catch((e) => console.log('v2 relay background note:', e.message));

      fetch(`https://api-na2.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            { name: 'firstname', value: trimmedName },
            { name: 'email', value: trimmedEmail },
            { name: 'aiforbusiness_subject', value: trimmedSubject },
            { name: 'aiforbusiness_message', value: trimmedMessage },
          ],
          context: {
            pageUri: 'https://aiforbusinesshub.com/contact',
            pageName: 'Contact Us | AIForBusinessHub',
          },
        }),
      }).catch((e) => console.log('v3 relay background note:', e.message));
    } catch (e) {
      console.log('Background relay note:', e);
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
