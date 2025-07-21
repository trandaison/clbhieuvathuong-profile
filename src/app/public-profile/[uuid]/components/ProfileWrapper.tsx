'use client';

import { useState } from 'react';
import ProfileVerification from './ProfileVerification';
import ProfileDisplay from './ProfileDisplay';
import { ProfileData } from '@/types/api';

interface ProfileWrapperProps {
  uuid: string;
  profile: ProfileData;
  isPartial: boolean;
}

export default function ProfileWrapper({ uuid, profile, isPartial }: ProfileWrapperProps) {
  const [isVerified, setIsVerified] = useState(!isPartial);
  const [fullProfile, setFullProfile] = useState<ProfileData>(profile);

  const handleVerificationSuccess = (verifiedProfile: ProfileData) => {
    setFullProfile(verifiedProfile);
    setIsVerified(true);
  };

  // If we only have partial data (name + avatar), show verification form
  if (!isVerified && isPartial) {
    return (
      <ProfileVerification
        profile={profile}
        uuid={uuid}
        onVerificationSuccess={handleVerificationSuccess}
      />
    );
  }

  return <ProfileDisplay profile={fullProfile} />;
}
