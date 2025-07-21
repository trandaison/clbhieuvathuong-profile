'use client';

import { useState, useEffect } from 'react';
import ProfileVerification from './ProfileVerification';
import ProfileDisplay from './ProfileDisplay';
import { ProfileData } from '@/types/api';
import { fetchPublicProfileAction } from '@/actions/profile';
import { convertApiToProfileData } from '@/utils/profile';
import { formatBirthdayForApi } from '@/utils/profile';

interface CachedVerificationData {
  uuid: string;
  fullName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  idNumber: string;
  phoneNumber: string;
  timestamp: number;
}

interface VerificationFormData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  idNumber: string;
  phoneNumber: string;
}

interface ProfileWrapperProps {
  uuid: string;
  profile: ProfileData;
  isPartial: boolean;
}

export default function ProfileWrapper({ uuid, profile, isPartial }: ProfileWrapperProps) {
  const [isVerified, setIsVerified] = useState(!isPartial); // Initialize based on isPartial
  const [fullProfile, setFullProfile] = useState<ProfileData>(profile);
  const [isLoading, setIsLoading] = useState(isPartial); // Only load if partial
  const [shouldShowVerification, setShouldShowVerification] = useState(false);

  useEffect(() => {
    // Only check cache if we have partial data
    if (isPartial) {
      checkCachedDataAndAutoVerify();
    }
  }, [uuid, isPartial]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkCachedDataAndAutoVerify = async () => {
    setIsLoading(true);

    try {
      // Get cached data from sessionStorage
      const cachedData = getCachedVerificationData();

      if (!cachedData) {
        // No cached data, show verification form
        setShouldShowVerification(true);
        setIsLoading(false);
        return;
      }

      // Check if UUID matches
      if (cachedData.uuid !== uuid) {
        // Different UUID, clear cache and show verification form
        clearCachedVerificationData();
        setShouldShowVerification(true);
        setIsLoading(false);
        return;
      }

      // UUID matches, try auto verification with cached data
      const result = await fetchPublicProfileAction(uuid, {
        gender: cachedData.gender,
        id_number: cachedData.idNumber,
        phone_number: cachedData.phoneNumber,
        birthday: formatBirthdayForApi(cachedData.dateOfBirth),
      });

      if (result && !result.isPartial) {
        // Successful verification with cached data
        const convertedProfile = convertApiToProfileData(result.profile);
        setFullProfile(convertedProfile);
        setIsVerified(true);
      } else {
        // Failed verification, clear cache and show verification form
        clearCachedVerificationData();
        setShouldShowVerification(true);
      }
    } catch (error) {
      console.error('Auto verification error:', error);
      clearCachedVerificationData();
      setShouldShowVerification(true);
    }

    setIsLoading(false);
  };

  const getCachedVerificationData = (): CachedVerificationData | null => {
    if (typeof window === 'undefined') return null;

    try {
      const cached = sessionStorage.getItem('verification_data');
      if (!cached) return null;

      const data: CachedVerificationData = JSON.parse(cached);

      // Check if data is expired (1 hour)
      const isExpired = Date.now() - data.timestamp > 60 * 60 * 1000;
      if (isExpired) {
        sessionStorage.removeItem('verification_data');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting cached verification data:', error);
      sessionStorage.removeItem('verification_data');
      return null;
    }
  };

  const clearCachedVerificationData = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('verification_data');
    }
  };

  const saveCachedVerificationData = (data: Omit<CachedVerificationData, 'timestamp'>) => {
    if (typeof window !== 'undefined') {
      const dataToCache: CachedVerificationData = {
        ...data,
        timestamp: Date.now()
      };
      sessionStorage.setItem('verification_data', JSON.stringify(dataToCache));
    }
  };

  const handleVerificationSuccess = (verifiedProfile: ProfileData, verificationData: VerificationFormData) => {
    setFullProfile(verifiedProfile);
    setIsVerified(true);
    setShouldShowVerification(false); // Reset verification flag

    // Cache the verification data
    saveCachedVerificationData({
      uuid,
      fullName: verificationData.fullName,
      gender: verificationData.gender as 'male' | 'female',
      dateOfBirth: verificationData.dateOfBirth,
      idNumber: verificationData.idNumber,
      phoneNumber: verificationData.phoneNumber,
    });
  };

  // Show loading screen while checking cache and auto-verifying
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra thông tin...</p>
        </div>
      </div>
    );
  }

  // Show verification form if needed
  if (!isVerified && (shouldShowVerification || isPartial)) {
    return (
      <ProfileVerification
        profile={profile}
        uuid={uuid}
        onVerificationSuccess={handleVerificationSuccess}
        cachedData={getCachedVerificationData()}
      />
    );
  }

  return <ProfileDisplay profile={fullProfile} />;
}
