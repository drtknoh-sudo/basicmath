import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Problem } from '../types';

export default function ProblemSolving() {
  const { unitId } = useParams();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchProblems();
  }, [unitId]);

  const fetchProblems = async () => {
    try {
      const response = await apiClient.get(`/problems?unitId=${unitId}&limit=10`);
      setProblems(response.data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const response = await apiClient.post(`/problems/${currentProblem.id}/submit`, {
        answer: userAnswer,
        timeSpent,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setUserAnswer('');
    setResult(null);
  };

  if (loading) return <div className="text-center py-12">로딩 중...</div>;
  if (problems.length === 0) return <div className="text-center py-12">문제가 없습니다.</div>;
  if (currentIndex >= problems.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">모든 문제를 완료했습니다!</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  const currentProblem = problems[currentIndex];

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          문제 {currentIndex + 1} / {problems.length}
        </h1>
        <span className="text-sm text-gray-600">난이도: {'⭐'.repeat(currentProblem.difficulty)}</span>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">문제</h2>
        <p className="text-gray-700 whitespace-pre-wrap mb-6">{currentProblem.question}</p>

        {currentProblem.type === '객관식' && currentProblem.choices && (
          <div className="space-y-2 mb-6">
            {currentProblem.choices.map((choice, index) => (
              <label key={index} className="flex items-center p-3 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="answer"
                  value={choice}
                  checked={userAnswer === choice}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={!!result}
                  className="mr-3"
                />
                <span>{choice}</span>
              </label>
            ))}
          </div>
        )}

        {currentProblem.type !== '객관식' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">답안 입력</label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={!!result}
              placeholder="답을 입력하세요"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        )}

        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={!userAnswer || submitting}
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '채점 중...' : '제출하기'}
          </button>
        ) : (
          <div>
            <div className={`p-4 rounded-lg mb-4 ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-semibold ${result.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {result.isCorrect ? '정답입니다!' : '틀렸습니다.'}
              </p>
              {!result.isCorrect && (
                <p className="text-sm text-gray-700 mt-2">
                  정답: {result.correctAnswer}
                </p>
              )}
              {result.wrongStep && (
                <p className="text-sm text-orange-600 mt-2">
                  {result.wrongStep}번째 단계에서 오류가 발생했습니다.
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">해설</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{result.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              다음 문제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
