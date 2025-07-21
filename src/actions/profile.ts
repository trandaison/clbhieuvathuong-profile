'use server';

import { PublicProfileResponse, ProfileData, VerificationRequest } from '@/types/api';
import { convertApiToProfileData } from '@/utils/profile';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

export async function fetchPublicProfileAction(
  uuid: string,
  verificationData?: Omit<VerificationRequest, 'uuid'>
): Promise<{ profile: PublicProfileResponse; isPartial: boolean } | null> {
  try {
    let url = `${API_BASE_URL}/api/public_profiles/${uuid}`;

    if (verificationData) {
      const params = new URLSearchParams({
        gender: verificationData.gender,
        id_number: verificationData.id_number,
        phone_number: verificationData.phone_number,
        birthday: verificationData.birthday,
      });
      url += `?${params.toString()}`;
    }

    console.log('Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const profile: PublicProfileResponse = await response.json();
    const isPartial = response.status === 206;

    return { profile, isPartial };
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return null;
  }
}

export async function verifyProfileAction(
  uuid: string,
  verificationData: {
    gender: "male" | "female";
    id_number: string;
    phone_number: string;
    birthday: string; // DD/MM/YYYY format
  },
  captchaToken: string
): Promise<{ success: boolean; profile?: ProfileData; error?: string }> {
  try {
    // First verify reCAPTCHA
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    });

    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success) {
      return { success: false, error: 'reCAPTCHA verification failed' };
    }

    // Then fetch profile with verification data
    const result = await fetchPublicProfileAction(uuid, verificationData);

    if (!result || result.isPartial) {
      return { success: false, error: 'Thông tin không chính xác. Vui lòng kiểm tra lại.' };
    }

    const profile = convertApiToProfileData(result.profile);
    return { success: true, profile };

  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, error: 'Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.' };
  }
}
