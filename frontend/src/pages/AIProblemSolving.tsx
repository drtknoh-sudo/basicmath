import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createProblemAgent, type Problem } from '../services/aiAgent';

export default function AIProblemSolving() {
  const { grade, unitId } = useParams<{ grade: string; unitId: string }>();
  const [agent, setAgent] = useState<ReturnType<typeof createProblemAgent> | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    feedback: string;
    wrongStep?: number;
    hint?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [difficulty, setDifficulty] = useState<number>(0); // 0 = 전체
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    if (!grade || !unitId) return;

    const loadProblems = async () => {
      setLoading(true);
      try {
        const problemAgent = createProblemAgent(parseInt(grade), unitId);
        setAgent(problemAgent);

        const loadedProblems = await problemAgent.generateProblems(5, difficulty || undefined);
        setProblems(loadedProblems);
        setCurrentProblemIndex(0);
      } catch (error) {
        console.error('문제 로딩 실패:', error);
        alert('문제를 불러오는데 실패했습니다. API 키를 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, [grade, unitId, difficulty]);

  const currentProblem = problems[currentProblemIndex];

  const handleSubmit = async () => {
    if (!userAnswer.trim() || !agent || !currentProblem) return;

    setLoading(true);
    try {
      const checkResult = await agent.checkAnswer(currentProblem, userAnswer);
      setResult(checkResult);
      setShowResult(true);

      // 점수 업데이트
      if (checkResult.isCorrect) {
        setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      } else {
        setScore(prev => ({ ...prev, total: prev.total + 1 }));
      }
    } catch (error) {
      console.error('답안 채점 실패:', error);
      alert('답안 채점에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setResult(null);
      setShowHint(false);
      setHint('');
    }
  };

  const handleGetHint = async () => {
    if (!agent || !currentProblem || showHint) return;

    setLoading(true);
    try {
      const hintText = await agent.getHint(currentProblem);
      setHint(hintText);
      setShowHint(true);
    } catch (error) {
      console.error('힌트 가져오기 실패:', error);
      alert('힌트를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDifficulty = (newDifficulty: number) => {
    setDifficulty(newDifficulty);
    setCurrentProblemIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setResult(null);
    setShowHint(false);
    setHint('');
    setScore({ correct: 0, total: 0 });
  };

  if (loading && problems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI가 문제를 생성하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">문제를 불러올 수 없습니다.</p>
        </div>
        <Link to="/units" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          ← 단원 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/units" className="text-primary-600 hover:text-primary-700 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          단원 목록으로
        </Link>
      </div>

      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">AI 문제 풀이</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              문제 {currentProblemIndex + 1} / {problems.length}
            </span>
            <div className="bg-green-50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-green-800">
                정답률: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* 난이도 선택 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">난이도:</span>
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => handleChangeDifficulty(level)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                difficulty === level
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level === 0 ? '전체' : level}
            </button>
          ))}
        </div>
      </div>

      {/* 문제 카드 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentProblem.difficulty <= 2
                  ? 'bg-green-50 text-green-700'
                  : currentProblem.difficulty === 3
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                난이도 {currentProblem.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {currentProblem.type}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentProblem.question}
          </h2>

          {/* 객관식 선택지 */}
          {currentProblem.type === '객관식' && currentProblem.choices && (
            <div className="space-y-2 mb-4">
              {currentProblem.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setUserAnswer(choice)}
                  disabled={showResult}
                  className={`w-full text-left px-4 py-3 border-2 rounded-lg transition-colors ${
                    userAnswer === choice
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${showResult ? 'cursor-not-allowed opacity-75' : ''}`}
                >
                  <span className="font-medium mr-2">{index + 1}.</span>
                  {choice}
                </button>
              ))}
            </div>
          )}

          {/* 단답형/서술형 입력 */}
          {currentProblem.type !== '객관식' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                답안 입력:
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showResult}
                placeholder="답을 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              />
            </div>
          )}

          {/* 힌트 */}
          {showHint && hint && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">힌트</h4>
                  <p className="text-sm text-yellow-800">{hint}</p>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          {!showResult && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleGetHint}
                disabled={showHint || loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                💡 힌트
              </button>
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || loading}
                className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? '채점 중...' : '제출하기'}
              </button>
            </div>
          )}
        </div>

        {/* 결과 표시 */}
        {showResult && result && (
          <div className="p-6">
            <div className={`rounded-lg p-4 mb-4 ${
              result.isCorrect
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {result.isCorrect ? (
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    result.isCorrect ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.isCorrect ? '정답입니다!' : '아쉽게도 틀렸습니다'}
                  </h3>
                  <p className={`text-sm whitespace-pre-line ${
                    result.isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.feedback}
                  </p>
                </div>
              </div>
            </div>

            {/* 해설 */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">📚 해설</h4>
              <p className="text-sm text-blue-800 mb-3">{currentProblem.explanation}</p>

              <h5 className="font-medium text-blue-900 mb-2 text-sm">풀이 단계:</h5>
              <ol className="space-y-1">
                {currentProblem.steps.map((step, index) => (
                  <li
                    key={index}
                    className={`text-sm ${
                      result.wrongStep === step.stepNumber
                        ? 'text-red-700 font-medium'
                        : 'text-blue-700'
                    }`}
                  >
                    {step.stepNumber}. {step.description} → {step.expectedValue}
                    {result.wrongStep === step.stepNumber && ' ❌ 이 단계에서 실수'}
                  </li>
                ))}
              </ol>
            </div>

            {/* 다음 문제 */}
            {currentProblemIndex < problems.length - 1 ? (
              <button
                onClick={handleNext}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
              >
                다음 문제 →
              </button>
            ) : (
              <div className="text-center">
                <div className="bg-green-50 rounded-lg p-6 mb-4">
                  <h3 className="text-xl font-bold text-green-900 mb-2">모든 문제를 완료했습니다!</h3>
                  <p className="text-green-800 mb-4">
                    총 {score.total}문제 중 {score.correct}문제를 맞췄습니다.
                  </p>
                  <div className="text-4xl font-bold text-green-600">
                    {Math.round((score.correct / score.total) * 100)}점
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/concepts/${grade}/${unitId}`}
                    className="flex-1 px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium text-center transition-colors"
                  >
                    개념 다시 보기
                  </Link>
                  <button
                    onClick={() => {
                      setCurrentProblemIndex(0);
                      setUserAnswer('');
                      setShowResult(false);
                      setResult(null);
                      setScore({ correct: 0, total: 0 });
                    }}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
                  >
                    다시 풀기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
