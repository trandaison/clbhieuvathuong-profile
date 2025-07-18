'use client';

import { useRouter } from 'next/navigation';

interface GoBackButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function GoBackButton({ className, children }: GoBackButtonProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className={className}
    >
      {children}
    </button>
  );
}
