import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUnits } from '../services/aiAgent';

interface Unit {
  id: string;
  grade: number;
  semester: number;
  category: string;
  unitNumber: number;
  unitName: string;
  description: string;
}

export default function UnitSelection() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = ['수와 연산', '변화와 관계', '도형과 측정', '자료와 가능성'];

  useEffect(() => {
    // AI 에이전트로부터 모든 단원 정보 가져오기
    const allUnits = getAllUnits();
    setUnits(allUnits);
  }, []);

  // 필터링된 단원
  const filteredUnits = units.filter((unit) => {
    if (selectedGrade > 0 && unit.grade !== selectedGrade) return false;
    if (selectedSemester > 0 && unit.semester !== selectedSemester) return false;
    if (selectedCategory && unit.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">학습할 단원 선택</h1>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-800">
          <strong>AI 에이전트 모드:</strong> 각 단원마다 전담 AI 선생님이 개념을 설명하고 문제를 출제합니다.
          백엔드 서버 없이 실시간으로 맞춤형 학습 콘텐츠가 생성됩니다.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={0}>전체</option>
              {[1, 2, 3, 4, 5, 6].map((grade) => (
                <option key={grade} value={grade}>
                  {grade}학년
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">학기</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={0}>전체</option>
              <option value={1}>1학기</option>
              <option value={2}>2학기</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">영역</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">전체</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUnits.map((unit) => (
          <div key={unit.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-green-500">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  {unit.grade}학년 {unit.semester}학기
                </span>
                <span className="text-xs font-medium text-gray-600">
                  {unit.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {unit.unitNumber}. {unit.unitName}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {unit.description}
              </p>
              <div className="flex items-center mb-4 text-xs text-green-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" />
                </svg>
                AI 선생님 배정됨
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/concepts/${unit.grade}/${unit.id}`}
                  className="flex-1 text-center px-4 py-2 border border-primary-600 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  개념 학습
                </Link>
                <Link
                  to={`/problems/${unit.grade}/${unit.id}`}
                  className="flex-1 text-center px-4 py-2 bg-primary-600 rounded-md text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  문제 풀기
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">선택한 조건에 맞는 단원이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
