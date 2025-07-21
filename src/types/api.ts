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
}
