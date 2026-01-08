import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">초등 수학 학습</h1>

      <div className="bg-white shadow rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">환영합니다!</h2>
        <p className="text-gray-600 mb-6">
          2022 개정 교육과정을 반영한 초등학생 수학 학습 플랫폼입니다.
          학년별, 단원별로 체계적인 학습을 시작하세요.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>데모 버전:</strong> 이 버전은 프론트엔드만 배포된 데모입니다.
            완전한 기능을 사용하려면 백엔드 서버가 필요합니다.
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">📚 학년별/단원별 학습</h3>
            <p className="text-sm text-gray-600">1-6학년 전 학년 교육과정 지원</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">💡 개념 학습</h3>
            <p className="text-sm text-gray-600">핵심 개념과 예제 문제 제공</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">✏️ 문제 풀이</h3>
            <p className="text-sm text-gray-600">난이도별 다양한 유형의 문제</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">📊 성취도 분석</h3>
            <p className="text-sm text-gray-600">학습 진도와 취약점 분석</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">학습 시작하기</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/units"
            className="flex items-center justify-center px-6 py-4 border-2 border-primary-600 rounded-lg shadow-sm text-lg font-medium text-primary-600 bg-white hover:bg-primary-50 transition-colors"
          >
            📖 단원 선택하기
          </Link>
          <a
            href="https://github.com/drtknoh-sudo/basicmath"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            💻 GitHub 저장소
          </a>
        </div>
      </div>
    </div>
  );
}
