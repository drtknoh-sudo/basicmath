import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createConceptAgent, type Concept } from '../services/aiAgent';

export default function AIConceptLearning() {
  const { grade, unitId } = useParams<{ grade: string; unitId: string }>();
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConcept, setSelectedConcept] = useState<number>(0);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [agent, setAgent] = useState<ReturnType<typeof createConceptAgent> | null>(null);

  useEffect(() => {
    if (!grade || !unitId) return;

    const loadConcepts = async () => {
      setLoading(true);
      try {
        const conceptAgent = createConceptAgent(parseInt(grade), unitId);
        setAgent(conceptAgent);

        const loadedConcepts = await conceptAgent.getConcepts();
        setConcepts(loadedConcepts);
      } catch (error) {
        console.error('개념 로딩 실패:', error);
        alert('개념을 불러오는데 실패했습니다. API 키를 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadConcepts();
  }, [grade, unitId]);

  const handleAskQuestion = async () => {
    if (!question.trim() || !agent) return;

    const userQuestion = question.trim();
    setQuestion('');

    // 사용자 질문 추가
    setChatHistory(prev => [...prev, { role: 'user', content: userQuestion }]);

    try {
      const answer = await agent.askQuestion(userQuestion);
      // AI 답변 추가
      setChatHistory(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error('질문 처리 실패:', error);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: '죄송합니다. 답변을 생성하는데 문제가 발생했습니다.'
      }]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI 선생님이 개념을 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (concepts.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">개념을 불러올 수 없습니다. API 키 설정을 확인해주세요.</p>
        </div>
        <Link to="/units" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          ← 단원 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const currentConcept = concepts[selectedConcept];

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/units" className="text-primary-600 hover:text-primary-700 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          단원 목록으로
        </Link>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-green-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          <div>
            <h3 className="font-semibold text-green-900">AI 선생님이 개념을 설명합니다</h3>
            <p className="text-sm text-green-700 mt-1">
              {grade}학년 수준에 맞춰 맞춤형 설명을 제공하며, 궁금한 점을 언제든 질문할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 개념 탭 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {concepts.map((concept, index) => (
              <button
                key={index}
                onClick={() => setSelectedConcept(index)}
                className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                  selectedConcept === index
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                개념 {concept.conceptNumber}
              </button>
            ))}
          </nav>
        </div>

        {/* 개념 내용 */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentConcept.title}</h2>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📖 설명</h3>
            <div className="text-gray-700 whitespace-pre-line">{currentConcept.explanation}</div>
          </div>

          {/* 예제 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">예제 문제</h3>
            {currentConcept.examples.map((example, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    예제 {index + 1}
                  </span>
                </div>
                <p className="font-medium text-gray-900 mb-3">{example.question}</p>

                <div className="bg-gray-50 rounded p-3 mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">풀이 과정:</p>
                  <ol className="space-y-1">
                    {example.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm text-gray-600">
                        {stepIndex + 1}. {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-green-50 rounded p-3">
                  <p className="text-sm">
                    <span className="font-semibold text-green-800">답:</span>
                    <span className="ml-2 text-green-700">{example.solution}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI 질문 섹션 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">💬 AI 선생님에게 질문하기</h3>
          <p className="text-sm text-gray-600 mt-1">
            개념에 대해 궁금한 점을 자유롭게 질문해보세요!
          </p>
        </div>

        <div className="p-6">
          {/* 채팅 히스토리 */}
          {chatHistory.length > 0 && (
            <div className="mb-4 space-y-3 max-h-96 overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 질문 입력 */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="예: 이 개념을 더 쉽게 설명해주세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleAskQuestion}
              disabled={!question.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              질문하기
            </button>
          </div>

          {/* 추천 질문 */}
          {chatHistory.length === 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">추천 질문:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '이 개념을 실생활 예시로 설명해주세요',
                  '이 개념이 왜 중요한가요?',
                  '이 개념과 관련된 다른 예제를 보여주세요',
                  '어떤 부분을 주의해야 하나요?'
                ].map((suggestedQ, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(suggestedQ)}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {suggestedQ}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 다음 단계 */}
      <div className="mt-6 flex justify-end">
        <Link
          to={`/problems/${grade}/${unitId}`}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
        >
          문제 풀기로 이동 →
        </Link>
      </div>
    </div>
  );
}
