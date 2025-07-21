'use client';

import { ProfileData } from '@/types/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileDisplayProps {
  profile: ProfileData;
}

export default function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const maskSensitiveInfo = (value: string, keepLast: number = 2) => {
    if (!value || value.length <= keepLast) return value;
    const masked = '*'.repeat(value.length - keepLast);
    return masked + value.slice(-keepLast);
  };

  const formatFacebookAccount = (facebookAccount: string) => {
    if (!facebookAccount) return null;

    // Check if it's a URL
    const isUrl = facebookAccount.includes('facebook.com') || facebookAccount.includes('fb.com') || facebookAccount.startsWith('http');

    if (isUrl) {
      return (
        <a
          href={facebookAccount.startsWith('http') ? facebookAccount : `https://${facebookAccount}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {facebookAccount}
        </a>
      );
    }

    return facebookAccount;
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors: { [key: string]: string } = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-red-200 text-red-900',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-200 text-blue-900',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-200 text-purple-900',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-green-200 text-green-900',
    };
    return colors[bloodType] || 'bg-gray-100 text-gray-800';
  };

  const getDonationTypeIcon = (type: string) => {
    if (type === "Hiến tiểu cầu") {
      return (
        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
      </svg>
    );
  };

  // Prepare data for platelet chart
  const plateletChartData = profile.donationHistory
    .filter(donation => donation.plateletCount && donation.plateletCount > 0) // Filter out entries without platelet count
    .map(donation => {
      const date = new Date(donation.date);
      return {
        date: `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`,
        plateletCount: donation.plateletCount,
        fullDate: donation.date,
        displayDate: new Date(donation.date).toLocaleDateString('vi-VN')
      };
    })
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-red-100"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.fullName}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${getBloodTypeColor(profile.bloodType)}`}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  Nhóm máu: {profile.bloodType}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center sm:justify-start">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Sinh: {formatDate(profile.dateOfBirth)}</span>
                </div>
                {profile.email && profile.email.trim() && (
                  <div className="flex items-center justify-center sm:justify-start">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span>{profile.email}</span>
                  </div>
                )}
                <div className="flex items-center justify-center sm:justify-start">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{profile.gender}</span>
                </div>
                {profile.idNumber && profile.idNumber.trim() && (
                  <div className="flex items-center justify-center sm:justify-start">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <span>CCCD: {maskSensitiveInfo(profile.idNumber)}</span>
                  </div>
                )}
                {profile.phoneNumber && profile.phoneNumber.trim() && (
                  <div className="flex items-center justify-center sm:justify-start">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>SĐT: {maskSensitiveInfo(profile.phoneNumber)}</span>
                  </div>
                )}
                {profile.facebookAccount && profile.facebookAccount.trim() && (
                  <div className="flex items-center justify-center sm:justify-start sm:col-span-2 lg:col-span-2">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="truncate">Facebook: {formatFacebookAccount(profile.facebookAccount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation History Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 overflow-hidden">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Nhật ký hiến máu
              </h2>

              <div className="relative">
                {profile.donationHistory.length === 0 ? (
                  // Empty state when no donation history
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-6">
                      <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Chưa có nhật ký hiến máu
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Bạn chưa có nhật ký hiến máu nào được ghi nhận trên website{' '}
                      <span className="font-medium text-red-600">
                        {typeof window !== 'undefined' ? window.location.host : 'hiến máu'}
                      </span>
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Enhanced Timeline with gradient background */}
                    <div className="absolute left-20 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 via-red-500 to-red-600 rounded-full shadow-lg"></div>

                    {/* Floating timeline background */}
                    <div className="absolute left-16 top-0 bottom-0 w-8 bg-gradient-to-r from-red-50 to-transparent rounded-lg opacity-30"></div>

                    <div className="space-y-8">
                      {profile.donationHistory.map((donation, index: number) => (
                        <div key={index} className="relative group">
                          {/* Date display on left side */}
                          <div className="absolute left-0 top-2 flex flex-col items-center w-16">
                            <div className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-center shadow-sm">
                              <div className="text-lg font-bold text-red-600">
                                {new Date(donation.date).getFullYear()}
                              </div>
                              <div className="text-sm text-gray-700 font-semibold -mt-1">
                                Th {new Date(donation.date).getMonth() + 1}
                              </div>
                              <div className="text-xs text-gray-400 font-normal -mt-1">
                                Ngày {new Date(donation.date).getDate()}
                              </div>
                            </div>
                          </div>

                          {/* Animated timeline node */}
                          <div className="absolute left-[4.375rem] flex items-center justify-center top-6">
                            <div className="relative">
                              {/* Outer ring with pulse animation */}
                              <div className="w-6 h-6 bg-red-600 rounded-full animate-pulse shadow-lg"></div>
                              {/* Inner core */}
                              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                              </div>
                              {/* Glow effect */}
                              <div className="absolute inset-0 bg-red-300 rounded-full blur-sm opacity-40 group-hover:opacity-70 transition-opacity"></div>
                            </div>
                          </div>

                          {/* Enhanced Content Card */}
                          <div className="ml-28 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                            <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                              {/* Donation type header */}
                              <div className="flex items-center mb-3">
                                <div className={`p-2 rounded-lg mr-3 flex items-center justify-center ${
                                  donation.donationType === "Hiến tiểu cầu"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-red-100 text-red-600"
                                }`}>
                                  {getDonationTypeIcon(donation.donationType)}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {donation.donationType}
                                </h3>
                              </div>

                              {/* Details grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 font-medium">Địa điểm</div>
                                    <div className="text-sm text-gray-900 font-semibold">{donation.location}</div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 font-medium">Chỉ số tiểu cầu</div>
                                    <div className="text-sm text-gray-900 font-semibold">
                                      {donation.plateletCount && donation.plateletCount > 0
                                        ? `${donation.plateletCount} (x10³/μL)`
                                        : '-'
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Statistics and Rankings */}
          <div className="space-y-6">
            {/* Personal Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Thống kê
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">#{profile.ranking.currentRank}</div>
                  <div className="text-sm text-red-700 font-medium">Thứ hạng hiện tại</div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Lần hiến</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{profile.ranking.totalDonations}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Tổng người hiến</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">{profile.ranking.totalDonors}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getBloodTypeColor(profile.bloodType).replace('text-', 'bg-').replace('-800', '-100').replace('-900', '-200')} ${getBloodTypeColor(profile.bloodType)}`}>
                        {profile.bloodType}
                      </div>
                      <span className="text-sm font-medium text-gray-700">Cùng nhóm máu</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">{profile.ranking.sameBloodTypeCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platelet Chart - Only show if 2+ donations */}
            {profile.ranking.totalDonations >= 2 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Biểu đồ chỉ số tiểu cầu
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={plateletChartData}
                      margin={{
                        top: 5,
                        left: -30,
                        bottom: -5,
                      }}
                    >
                      <defs>
                        <linearGradient id="plateletGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        domain={['dataMin - 10', 'dataMax + 10']}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} (x10³/μL)`, 'Chỉ số tiểu cầu']}
                        labelFormatter={(label, payload) => {
                          if (payload && payload.length > 0) {
                            return `Thời gian: ${payload[0].payload.displayDate}`;
                          }
                          return `Thời gian: ${label}`;
                        }}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          color: '#374151',
                          fontWeight: '500'
                        }}
                        labelStyle={{
                          color: '#1f2937',
                          fontWeight: '600'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="plateletCount"
                        stroke="#dc2626"
                        strokeWidth={3}
                        fill="url(#plateletGradient)"
                        dot={false}
                        activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Top Donors */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                Top hiến máu nhiều nhất
              </h3>
              <div className="space-y-3">
                {profile.topDonors.map((donor, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{donor.name}</div>
                        <div className="flex items-center space-x-2">
                          <div className={`text-xs px-2 py-0.5 rounded ${getBloodTypeColor(donor.bloodType)}`}>
                            {donor.bloodType}
                          </div>
                          {donor.lastDonationDate && (
                            <div className="text-xs text-gray-500">
                              Gần nhất: {new Date(donor.lastDonationDate).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-red-600">
                      {donor.donations} lần
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
