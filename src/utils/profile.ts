import { PublicProfileResponse, ProfileData } from '@/types/api';

// Blood type mapping from API to display format
const bloodTypeMap: Record<string, string> = {
  'a_pos': 'A+',
  'a_neg': 'A-',
  'b_pos': 'B+',
  'b_neg': 'B-',
  'ab_pos': 'AB+',
  'ab_neg': 'AB-',
  'o_pos': 'O+',
  'o_neg': 'O-',
};

// Gender mapping from API to Vietnamese
const genderMap: Record<string, string> = {
  'male': 'Nam',
  'female': 'Nữ',
};

export function convertApiToProfileData(apiData: PublicProfileResponse): ProfileData {
  // Convert donation history from API or use mock data
  const donationHistory = apiData.histories?.map(history => ({
    date: history.date,
    location: history.place.name,
    plateletCount: history.platelet_count,
    donationType: history.donation_type === 'platelets' ? 'Hiến tiểu cầu' : 'Hiến toàn phần'
  })) || [
    // Fallback mock data if API doesn't provide histories
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
    }
  ];

  // Convert ranking/statistics from API or use mock data
  const ranking = apiData.statistics ? {
    currentRank: apiData.statistics.current_rank,
    totalDonations: apiData.statistics.total_donations,
    totalDonors: apiData.statistics.total_donors_count,
    sameBloodTypeCount: apiData.statistics.same_blood_type_count
  } : {
    currentRank: 15,
    totalDonations: donationHistory.length,
    totalDonors: 1250,
    sameBloodTypeCount: 180
  };

  // Convert top donors from API or use mock data
  const topDonors = apiData.statistics?.top_donors?.map((donor) => ({
    name: donor.name.trim(), // Remove extra spaces
    donations: donor.donation_count,
    bloodType: donor.blood_type ? bloodTypeMap[donor.blood_type] || donor.blood_type : '',
    lastDonationDate: donor.last_donation_date
  })) || [
    // Fallback mock data
    { name: "Trần Thị Bình", donations: 28, bloodType: "A+" },
    { name: "Lê Văn Cường", donations: 25, bloodType: "B-" },
    { name: "Phạm Thị Dung", donations: 23, bloodType: "AB+" },
    { name: "Hoàng Văn Em", donations: 22, bloodType: "O-" },
    { name: "Nguyễn Thị Phương", donations: 21, bloodType: "A-" }
  ];

  return {
    avatar: apiData.avatar.medium?.url || apiData.avatar.url,
    fullName: apiData.name,
    dateOfBirth: apiData.birthday || '',
    email: apiData.email,
    gender: apiData.gender ? genderMap[apiData.gender] || apiData.gender : '',
    bloodType: apiData.blood_type ? bloodTypeMap[apiData.blood_type] || apiData.blood_type : '',
    address: apiData.address,
    phoneNumber: apiData.phone_number,
    idNumber: apiData.id_number,
    facebookAccount: apiData.facebook_account,
    placeOfBirth: apiData.place_of_birth,
    donationHistory,
    ranking,
    topDonors,
  };
}

export function formatBirthdayForApi(birthday: string): string {
  // Convert from YYYY-MM-DD to DD/MM/YYYY
  const [year, month, day] = birthday.split('-');
  return `${day}/${month}/${year}`;
}
