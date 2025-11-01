'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Logos Section */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8">
              {/* NEU Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/logo/NEU logo.png"
                  alt="NEU Logo"
                  width={150}
                  height={150}
                  className="object-contain h-auto"
                  priority
                />
              </div>
              
              {/* LogoNCT */}
              <div className="flex-shrink-0">
                <Image
                  src="/logo/LogoNCT.png"
                  alt="NCT Logo"
                  width={150}
                  height={150}
                  className="object-contain h-auto"
                  priority
                />
              </div>
              
              {/* FDA Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/logo/FDA logo_không nền.png"
                  alt="FDA Logo"
                  width={150}
                  height={150}
                  className="object-contain h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight drop-shadow-md">
              NEU Class Manager
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 mb-4 font-semibold">
              Hệ thống quản lý lớp học và thi cử trực tuyến
            </p>
                <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
              Công cụ hỗ trợ sinh viên tra cứu điểm thi và thực hiện bài kiểm tra giữa kỳ một cách thuận tiện và hiệu quả
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* Score Lookup Card */}
            <Link
              href="/lookup"
              className="group bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-8 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="inline-block bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Tra Cứu Điểm Thi
                </h3>
                <p className="text-gray-800 mb-4 font-medium">
                  Tìm kiếm và xem kết quả điểm thi giữa kỳ nhanh chóng và chính xác
                </p>
                <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  Xem chi tiết
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Exam Taking Card */}
            <Link
              href="/exam"
              className="group bg-white rounded-2xl shadow-xl border-2 border-indigo-200 p-8 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="inline-block bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full p-6 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Làm Bài Thi
                </h3>
                <p className="text-gray-800 mb-4 font-medium">
                  Thực hiện bài kiểm tra giữa kỳ trực tuyến với giao diện thân thiện và dễ sử dụng
                </p>
                <div className="inline-flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700">
                  Bắt đầu làm bài
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Access Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <Link
              href="/lookup"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
            >
              🔍 Tra Cứu Điểm
            </Link>
            <Link
              href="/exam"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
            >
              📝 Làm Bài Thi
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-900 mb-2 font-semibold">© 2024 NEU Class Manager</p>
          <p className="text-sm text-gray-800 font-medium">
            Hệ thống quản lý lớp học và thi cử - Trường Đại học Kinh tế Quốc dân
          </p>
        </div>
      </footer>
    </div>
  )
}
