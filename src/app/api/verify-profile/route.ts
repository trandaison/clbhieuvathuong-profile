import { NextRequest, NextResponse } from 'next/server';

interface VerifyRequest {
  captchaToken: string;
  formData: {
    fullName: string;
    gender: string;
    dateOfBirth: string;
    idNumber: string;
    phoneNumber: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { captchaToken, formData }: VerifyRequest = await request.json();

    // Verify reCAPTCHA token with Google
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: String(process.env.RECAPTCHA_SECRET_KEY),
        response: captchaToken,
      }),
    });

    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'reCAPTCHA verification failed',
          details: recaptchaResult['error-codes']
        },
        { status: 400 }
      );
    }

    // TODO: Add your actual user verification logic here
    // For now, we'll use the same mock logic
    const isValidUser = formData.fullName.toLowerCase() === 'a';

    if (isValidUser) {
      return NextResponse.json({
        success: true,
        message: 'Verification successful'
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid user information'
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
