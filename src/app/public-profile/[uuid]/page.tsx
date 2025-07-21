import { notFound } from 'next/navigation';
import ProfileWrapper from './components/ProfileWrapper';

interface PublicProfilePageProps {
  params: Promise<{
    uuid: string;
  }>;
}

// Mock data for demonstration
const mockProfileData = {
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
  fullName: "Nguyễn Văn An",
  dateOfBirth: "1990-05-15",
  email: "nguyenvanan@email.com",
  gender: "Nam",
  bloodType: "O+",
  donationHistory: [
    {
      date: "2024-01-15",
      location: "Bệnh viện Chợ Rẫy",
      plateletCount: 250,
      donationType: "Hiến toàn phần"
    },
    {
      date: "2023-11-20",
      location: "Trung tâm Hiến máu TP.HCM",
      plateletCount: 280,
      donationType: "Hiến tiểu cầu"
    },
    {
      date: "2023-09-10",
      location: "Bệnh viện Bình Dân",
      plateletCount: 265,
      donationType: "Hiến toàn phần"
    },
    {
      date: "2023-06-05",
      location: "Trung tâm Hiến máu TP.HCM",
      plateletCount: 275,
      donationType: "Hiến tiểu cầu"
    },
    {
      date: "2023-03-12",
      location: "Bệnh viện Chợ Rẫy",
      plateletCount: 260,
      donationType: "Hiến toàn phần"
    }
  ],
  ranking: {
    currentRank: 15,
    totalDonations: 5,
    totalDonors: 1250,
    sameBloodTypeCount: 180 // Số người cùng nhóm máu O+
  },
  topDonors: [
    { name: "Trần Thị Bình", donations: 28, bloodType: "A+" },
    { name: "Lê Văn Cường", donations: 25, bloodType: "B-" },
    { name: "Phạm Thị Dung", donations: 23, bloodType: "AB+" },
    { name: "Hoàng Văn Em", donations: 22, bloodType: "O-" },
    { name: "Nguyễn Thị Phương", donations: 21, bloodType: "A-" }
  ]
};

export default async function PublicProfilePage({
  params
}: PublicProfilePageProps) {
  const { uuid } = await params;

  // Validate UUID format (basic validation)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(uuid)) {
    notFound();
  }

  // TODO: Fetch user profile data based on UUID
  // const profile = await fetchUserProfile(uuid);
  // if (!profile) {
  //   notFound();
  // }

  const profile = mockProfileData;

  return <ProfileWrapper uuid={uuid} profile={profile} />;
}

// Generate metadata dynamically based on the UUID
export async function generateMetadata({
  params
}: PublicProfilePageProps) {
  const { uuid } = await params;

  // TODO: In real implementation, fetch user data to get actual name
  // const profile = await fetchUserProfile(uuid);
  // const userName = profile?.fullName || 'Người hiến máu';

  return {
    title: `Hồ sơ hiến máu - ${mockProfileData.fullName}`,
    description: `Xem hồ sơ hiến máu và lịch sử đóng góp của ${mockProfileData.fullName}. Nhóm máu ${mockProfileData.bloodType}, đã hiến ${mockProfileData.ranking.totalDonations} lần.`,
    keywords: ['hiến máu', 'hồ sơ hiến máu', 'lịch sử hiến máu', mockProfileData.bloodType],
    openGraph: {
      title: `Hồ sơ hiến máu - ${mockProfileData.fullName}`,
      description: `Xem hồ sơ và lịch sử hiến máu của ${mockProfileData.fullName}`,
      type: 'profile',
    },
  };
}
