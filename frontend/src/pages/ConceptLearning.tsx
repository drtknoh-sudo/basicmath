import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Concept } from '../types';

export default function ConceptLearning() {
  const { unitId, conceptId } = useParams();
  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConcept();
  }, [conceptId]);

  const fetchConcept = async () => {
    try {
      const response = await apiClient.get(`/concepts/${conceptId}`);
      setConcept(response.data);
    } catch (error) {
      console.error('Failed to fetch concept:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">로딩 중...</div>;
  if (!concept) return <div className="text-center py-12">개념을 찾을 수 없습니다.</div>;

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{concept.title}</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">개념 설명</h2>
        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
          {concept.explanation}
        </div>
      </div>

      {concept.examples && concept.examples.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">예제</h2>
          {concept.examples.map((example: any, index: number) => (
            <div key={index} className="mb-6 last:mb-0 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">예제 {index + 1}</h3>
              <p className="text-gray-700 mb-3">{example.question}</p>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">풀이:</p>
                {example.steps?.map((step: string, stepIndex: number) => (
                  <p key={stepIndex} className="text-sm text-gray-600 mb-1">
                    {stepIndex + 1}. {step}
                  </p>
                ))}
                <p className="text-sm font-semibold text-primary-600 mt-3">
                  답: {example.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
