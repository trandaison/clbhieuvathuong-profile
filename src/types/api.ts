// API Response Types
export interface AvatarUrls {
  url: string;
  thumb: {
    url: string;
  };
  medium: {
    url: string;
  };
  small: {
    url: string;
  };
}

export interface ApiPlace {
  id: number;
  name: string;
  address: string;
  is_hospital: boolean;
}

export interface ApiDonationHistory {
  id: number;
  date: string;
  donation_type: string;
  platelet_count: number;
  is_verified: boolean;
  place: ApiPlace;
}

export interface ApiTopDonor {
  rank: number; // Note: không sử dụng vì không chính xác
  name: string;
  blood_type: string;
  donation_count: number;
  last_donation_date: string;
}

export interface ApiStatistics {
  same_blood_type_count: number;
  total_donors_count: number;
  total_donations: number;
  current_rank: number;
  top_donors: ApiTopDonor[];
}

export interface PublicProfileResponse {
  id: number;
  email?: string;
  name: string;
  address?: string;
  gender?: "male" | "female";
  id_number?: string;
  phone_number?: string;
  phone_number_2?: string;
  blood_type?: "a_pos" | "a_neg" | "b_pos" | "b_neg" | "ab_pos" | "ab_neg" | "o_pos" | "o_neg";
  avatar: AvatarUrls;
  birthday?: string;
  facebook_account?: string;
  place_of_birth?: string;
  created_at?: string;
  updated_at?: string;

  // New API fields from actual response
  histories?: ApiDonationHistory[];
  statistics?: ApiStatistics;
}

export interface VerificationRequest {
  uuid: string;
  gender: "male" | "female";
  id_number: string;
  phone_number: string;
  birthday: string; // Format: DD/MM/YYYY
}

// Converted profile data for internal use
export interface ProfileData {
  avatar: string;
  fullName: string;
  dateOfBirth: string;
  email?: string;
  gender: string;
  bloodType: string;
  address?: string;
  phoneNumber?: string;
  idNumber?: string;
  facebookAccount?: string;
  placeOfBirth?: string;
  donationHistory: DonationRecord[];
  ranking: {
    currentRank: number;
    totalDonations: number;
    totalDonors: number;
    sameBloodTypeCount: number;
  };
  topDonors: TopDonor[];
}

export interface DonationRecord {
  date: string;
  location: string;
  plateletCount: number;
  donationType: string;
}

export interface TopDonor {
  name: string;
  donations: number;
  bloodType: string;
  lastDonationDate?: string;
}
