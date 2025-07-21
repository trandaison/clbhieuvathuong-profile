import { notFound } from 'next/navigation';
import ProfileWrapper from './components/ProfileWrapper';
import { fetchPublicProfileAction } from '@/actions/profile';
import { convertApiToProfileData } from '@/utils/profile';

interface PublicProfilePageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function PublicProfilePage({
  params
}: PublicProfilePageProps) {
  const { uuid } = await params;

  if (!uuid.trim()) {
    notFound();
  }

  // Fetch user profile data based on UUID (without verification data initially)
  const result = await fetchPublicProfileAction(uuid);

  if (!result) {
    notFound();
  }

  const { profile: apiProfile, isPartial } = result;
  const profile = convertApiToProfileData(apiProfile);

  return <ProfileWrapper uuid={uuid} profile={profile} isPartial={isPartial} />;
}

// Generate metadata dynamically based on the UUID
export async function generateMetadata({
  params
}: PublicProfilePageProps) {
  const { uuid } = await params;

  // Fetch profile data for metadata
  const result = await fetchPublicProfileAction(uuid);  if (!result) {
    return {
      title: 'Hồ sơ không tìm thấy',
      description: 'Hồ sơ hiến máu không tồn tại hoặc đã bị xóa.',
    };
  }

  const { profile: apiProfile } = result;
  const userName = apiProfile.name || 'Người hiến máu';
  const bloodType = apiProfile.blood_type ?
    apiProfile.blood_type.replace('_pos', '+').replace('_neg', '-').toUpperCase() : '';

  return {
    title: `Hồ sơ hiến máu - ${userName}`,
    description: `Xem hồ sơ hiến máu và lịch sử đóng góp của ${userName}${bloodType ? `. Nhóm máu ${bloodType}` : ''}.`,
    keywords: ['hiến máu', 'hồ sơ hiến máu', 'lịch sử hiến máu', bloodType].filter(Boolean),
    openGraph: {
      title: `Hồ sơ hiến máu - ${userName}`,
      description: `Xem hồ sơ và lịch sử hiến máu của ${userName}`,
      type: 'profile',
      images: apiProfile.avatar?.medium?.url ? [apiProfile.avatar.medium.url] : undefined,
    },
  };
}
