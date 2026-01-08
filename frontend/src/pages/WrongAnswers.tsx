import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { WrongAnswerNote } from '../types';

export default function WrongAnswers() {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerNote[]>([]);
  const [filter, setFilter] = useState<'all' | 'mastered' | 'unmastered'>('unmastered');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWrongAnswers();
  }, [filter]);

  const fetchWrongAnswers = async () => {
    try {
      let mastered;
      if (filter === 'mastered') mastered = 'true';
      if (filter === 'unmastered') mastered = 'false';

      const response = await apiClient.get(`/learning/wrong-answers`, {
        params: { mastered },
      });
      setWrongAnswers(response.data);
    } catch (error) {
      console.error('Failed to fetch wrong answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReviewed = async (id: string, mastered: boolean) => {
    try {
      await apiClient.patch(`/learning/wrong-answers/${id}/review`, { mastered });
      fetchWrongAnswers();
    } catch (error) {
      console.error('Failed to mark as reviewed:', error);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">오답노트</h1>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('unmastered')}
            className={`px-4 py-2 rounded-md ${
              filter === 'unmastered'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            복습 필요
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-4 py-2 rounded-md ${
              filter === 'mastered'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            마스터함
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">로딩 중...</div>
      ) : wrongAnswers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">오답이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {wrongAnswers.map((note) => (
            <div key={note.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {note.problemAttempt.problem.question.substring(0, 100)}...
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    단원: {note.problemAttempt.problem.unitId}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    note.mastered
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {note.mastered ? '마스터' : '복습 필요'}
                </span>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-red-800 mb-2">오답 분석</p>
                <p className="text-sm text-gray-700">{note.analysis}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-green-800 mb-2">올바른 풀이</p>
                <div className="space-y-1">
                  {note.correctSteps.map((step: any, index: number) => (
                    <p key={index} className="text-sm text-gray-700">
                      {index + 1}. {step.description}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                {!note.mastered && (
                  <button
                    onClick={() => handleMarkAsReviewed(note.id, true)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    완전히 이해했어요
                  </button>
                )}
                <button
                  onClick={() => handleMarkAsReviewed(note.id, false)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  다시 복습하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
