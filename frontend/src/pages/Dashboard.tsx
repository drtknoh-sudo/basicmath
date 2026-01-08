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
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">AI 에이전트 모드로 운영됩니다</p>
              <p className="text-sm text-gray-700">
                각 학년과 단원마다 전담 AI 선생님이 배정되어 실시간으로 개념을 설명하고 문제를 생성합니다.
                백엔드 서버 없이도 완전한 학습이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">AI 에이전트 주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="font-semibold text-gray-900 mb-2">🤖 전담 AI 선생님</h3>
            <p className="text-sm text-gray-600">각 단원마다 특화된 AI 선생님이 배정되어 맞춤형 학습 제공</p>
          </div>
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-gray-900 mb-2">💡 실시간 개념 생성</h3>
            <p className="text-sm text-gray-600">학생 수준에 맞춘 개념 설명과 예제를 즉시 생성</p>
          </div>
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h3 className="font-semibold text-gray-900 mb-2">✏️ AI 문제 출제</h3>
            <p className="text-sm text-gray-600">난이도별 맞춤형 문제를 무한정 생성 및 채점</p>
          </div>
          <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
            <h3 className="font-semibold text-gray-900 mb-2">💬 대화형 질문응답</h3>
            <p className="text-sm text-gray-600">궁금한 점을 AI 선생님에게 자유롭게 질문</p>
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
