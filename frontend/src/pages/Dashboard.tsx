import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Stats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/achievements/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">대시보드</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">전체 정확도</dt>
            <dd className="mt-1 text-3xl font-semibold text-primary-600">
              {stats?.overallAccuracy.toFixed(1)}%
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">풀이한 문제</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats?.totalAttempts}개
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">학습 시간</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {Math.floor((stats?.totalLearningTime || 0) / 60)}분
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">완료한 단원</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats?.completedUnits}개
            </dd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">오답 현황</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">전체 오답</span>
              <span className="font-semibold">{stats?.totalWrongAnswers}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">마스터한 오답</span>
              <span className="font-semibold text-green-600">{stats?.masteredWrongAnswers}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">복습 필요</span>
              <span className="font-semibold text-orange-600">
                {(stats?.totalWrongAnswers || 0) - (stats?.masteredWrongAnswers || 0)}개
              </span>
            </div>
          </div>
          <Link
            to="/wrong-answers"
            className="mt-4 block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            오답노트 보기
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">최근 7일 문제 풀이</span>
              <span className="font-semibold">{stats?.recentAttempts}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">정답률</span>
              <span className="font-semibold text-green-600">
                {stats?.correctAttempts}/{stats?.totalAttempts}
              </span>
            </div>
          </div>
          <Link
            to="/achievements"
            className="mt-4 block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            성취도 분석 보기
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">빠른 시작</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/units"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            새로운 단원 학습하기
          </Link>
          <Link
            to="/wrong-answers"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            오답 복습하기
          </Link>
          <Link
            to="/achievements"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            성취도 확인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
