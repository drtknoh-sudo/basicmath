import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Achievement } from '../types';

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await apiClient.get('/achievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 70) return 'text-blue-600';
    if (accuracy >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-100';
    if (accuracy >= 70) return 'bg-blue-100';
    if (accuracy >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) return <div className="text-center py-12">로딩 중...</div>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">성취도 분석</h1>

      {achievements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">아직 학습 기록이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">문제를 풀어보세요!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {achievement.unit.unitName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {achievement.unit.grade}학년 {achievement.unit.semester}학기 - {achievement.unit.category}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${getAccuracyBg(achievement.accuracy)}`}>
                  <p className={`text-2xl font-bold ${getAccuracyColor(achievement.accuracy)}`}>
                    {achievement.accuracy.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-600 text-center">정확도</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">풀이한 문제</p>
                  <p className="text-2xl font-semibold text-gray-900">{achievement.problemsSolved}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">평균 시간</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {Math.floor(achievement.averageTime)}초
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">취약 개념</p>
                  <p className="text-2xl font-semibold text-orange-600">
                    {(achievement.weakConcepts as string[]).length}개
                  </p>
                </div>
              </div>

              {(achievement.weakConcepts as string[]).length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-orange-800 mb-2">
                    보충 학습이 필요한 개념
                  </p>
                  <p className="text-sm text-gray-700">
                    해당 단원의 개념을 다시 학습하고 문제를 더 풀어보세요.
                  </p>
                </div>
              )}

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => window.location.href = `/units/${achievement.unit.id}/concepts/${achievement.unit.id}`}
                  className="flex-1 px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50"
                >
                  개념 복습
                </button>
                <button
                  onClick={() => window.location.href = `/problems/${achievement.unit.id}`}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  문제 더 풀기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
