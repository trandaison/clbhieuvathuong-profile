'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import ProfileVerification from './ProfileVerification';
import ProfileDisplay from './ProfileDisplay';

interface ProfileWrapperProps {
  uuid: string;
  profile: any;
}

export default function ProfileWrapper({ uuid, profile }: ProfileWrapperProps) {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  if (!isVerified) {
    return (
      <ProfileVerification
        profile={profile}
        onVerificationSuccess={handleVerificationSuccess}
      />
    );
  }

  return <ProfileDisplay profile={profile} />;
}
