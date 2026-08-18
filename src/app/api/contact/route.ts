import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    // In production this can dispatch SMS, Telegram notification or email to Coach Fisha
    console.log(`[New Contact Inquiry] Name: ${name}, Phone: ${phone}, Message: ${message}`);

    return NextResponse.json({
      success: true,
      message: 'Inquiry received. Coach Fisha or academy staff will contact you shortly.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
