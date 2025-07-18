import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Hệ thống Hiến máu
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Chào mừng đến với Hệ thống Hiến máu. Quản lý và xem hồ sơ hiến máu công khai
            với URL bảo mật dựa trên UUID.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-12">
            <Link
              href="/public-profile"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Xem Hồ sơ Hiến máu
            </Link>

            <Link
              href="/public-profile/550e8400-e29b-41d4-a716-446655440000"
              className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Hồ sơ Mẫu
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bảo mật</h3>
              <p className="text-gray-600">URL dựa trên UUID đảm bảo tính riêng tư và bảo mật hồ sơ</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lịch sử</h3>
              <p className="text-gray-600">Theo dõi lịch sử hiến máu với timeline chi tiết</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Xếp hạng</h3>
              <p className="text-gray-600">Hệ thống xếp hạng và thống kê người hiến máu</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600 mb-1">1,250+</div>
                <div className="text-sm text-gray-500">Người hiến máu</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">5,420+</div>
                <div className="text-sm text-gray-500">Lần hiến máu</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">8</div>
                <div className="text-sm text-gray-500">Nhóm máu</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                <div className="text-sm text-gray-500">Hỗ trợ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
