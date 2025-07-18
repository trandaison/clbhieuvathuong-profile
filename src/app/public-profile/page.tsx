import Link from 'next/link';

export default function PublicProfileIndexPage() {
  // Example UUIDs for demonstration
  const exampleUUIDs = [
    '550e8400-e29b-41d4-a716-446655440000',
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hệ thống Hồ sơ Hiến máu
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Xem hồ sơ hiến máu công khai thông qua URL có mã định danh duy nhất.
              Mỗi hồ sơ được bảo mật với UUID riêng biệt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cách truy cập hồ sơ
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Định dạng URL:</h3>
                  <code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
                    /public-profile/[uuid]
                  </code>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Ví dụ:</h3>
                  <code className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded break-all">
                    /public-profile/550e8400-e29b-41d4-a716-446655440000
                  </code>
                </div>
              </div>

              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Thông tin hiển thị:</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Thông tin cá nhân và nhóm máu</li>
                  <li>• Lịch sử hiến máu (timeline)</li>
                  <li>• Thống kê và xếp hạng</li>
                  <li>• Top người hiến máu</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Hồ sơ mẫu
              </h2>
              <p className="text-gray-600 mb-4">
                Thử xem các hồ sơ mẫu:
              </p>
              <div className="space-y-3">
                {exampleUUIDs.map((uuid, index) => (
                  <Link
                    key={uuid}
                    href={`/public-profile/${uuid}`}
                    className="block p-4 bg-gray-50 hover:bg-red-50 rounded-lg border transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">
                          Hồ sơ hiến máu #{index + 1}
                        </span>
                      </div>
                      <svg
                        className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <code className="text-xs text-gray-500 break-all mt-2 block">
                      {uuid}
                    </code>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tính năng hệ thống
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-600">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Xác thực UUID</span>
                  <span className="text-xs text-center">Bảo mật với mã định danh duy nhất</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Lịch sử Timeline</span>
                  <span className="text-xs text-center">Theo dõi quá trình hiến máu</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span className="font-medium">Xếp hạng</span>
                  <span className="text-xs text-center">Thống kê và bảng xếp hạng</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">Responsive</span>
                  <span className="text-xs text-center">Tối ưu mọi thiết bị</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Hệ thống Hồ sơ Hiến máu',
  description: 'Truy cập hồ sơ hiến máu công khai với URL có mã định danh UUID duy nhất',
  keywords: ['hiến máu', 'hồ sơ hiến máu', 'hệ thống hiến máu', 'UUID'],
};
