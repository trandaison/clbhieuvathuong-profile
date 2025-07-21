'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { ProfileData } from '@/types/api';
import { verifyProfileAction } from '@/actions/profile';
import { formatBirthdayForApi } from '@/utils/profile';

interface VerificationForm {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  idNumber: string;
  phoneNumber: string;
}

interface ProfileVerificationProps {
  profile: ProfileData;
  uuid: string;
  onVerificationSuccess: (verifiedProfile: ProfileData) => void;
}

export default function ProfileVerification({ profile, uuid, onVerificationSuccess }: ProfileVerificationProps) {
  const [verificationForm, setVerificationForm] = useState<VerificationForm>({
    fullName: profile.fullName || '',
    gender: '',
    dateOfBirth: '',
    idNumber: '',
    phoneNumber: ''
  });
  const [verificationError, setVerificationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleInputChange = (field: keyof VerificationForm, value: string) => {
    setVerificationForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (verificationError) {
      setVerificationError('');
    }
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    // Clear error when captcha is completed
    if (token && verificationError) {
      setVerificationError('');
    }
  };

  const handleVerification = async () => {
    setIsLoading(true);
    setVerificationError('');

    // Validate required fields
    if (!verificationForm.fullName || !verificationForm.gender ||
        !verificationForm.dateOfBirth || !verificationForm.idNumber ||
        !verificationForm.phoneNumber) {
      setVerificationError('Vui lòng điền đầy đủ tất cả thông tin');
      setIsLoading(false);
      return;
    }

    // Validate reCAPTCHA
    if (!captchaToken) {
      setVerificationError('Vui lòng hoàn thành xác thực reCAPTCHA');
      setIsLoading(false);
      return;
    }

    try {
      // Call server action for verification
      const result = await verifyProfileAction(
        uuid,
        {
          gender: verificationForm.gender as "male" | "female",
          id_number: verificationForm.idNumber,
          phone_number: verificationForm.phoneNumber,
          birthday: formatBirthdayForApi(verificationForm.dateOfBirth),
        },
        captchaToken
      );

      if (result.success && result.profile) {
        onVerificationSuccess(result.profile);
      } else {
        setVerificationError(result.error || 'Thông tin không chính xác. Vui lòng kiểm tra lại.');
        // Reset reCAPTCHA on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setCaptchaToken(null);
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError('Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.');
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    }    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Header with avatar and message */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img
                src={profile.avatar}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-red-100"
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Bạn đang truy cập trang thông tin nhật ký hiến máu của thành viên{' '}
              <span className="text-red-600">{profile.fullName}</span>
            </h1>
            <p className="text-sm text-gray-600">
              Vui lòng điền các thông tin bên dưới để xác nhận:
            </p>
          </div>

          {/* Verification Form */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={verificationForm.fullName}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 cursor-not-allowed"
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Gender and Date of Birth - Same Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  value={verificationForm.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 h-[42px] appearance-none bg-white bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={verificationForm.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CCCD/CMND <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={verificationForm.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Nhập số CCCD/CMND"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={verificationForm.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                onChange={onCaptchaChange}
                onExpired={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
              />
            </div>

            {/* Error Message */}
            {verificationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {verificationError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleVerification}
              disabled={isLoading || !captchaToken}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xác thực...
                </>
              ) : (
                'Xem thông tin'
              )}
            </button>
          </div>

          {/* Helper text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Thông tin của bạn được bảo mật và chỉ để xác thực
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
