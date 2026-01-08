import { useState } from 'react';
import { Link } from 'react-router-dom';

// 샘플 단원 데이터
const SAMPLE_UNITS = [
  {
    id: '1',
    grade: 1,
    semester: 1,
    category: '수와 연산',
    unitNumber: 1,
    unitName: '9까지의 수',
    description: '1부터 9까지의 수를 세고 읽고 쓸 수 있습니다.',
  },
  {
    id: '2',
    grade: 1,
    semester: 1,
    category: '도형과 측정',
    unitNumber: 2,
    unitName: '여러 가지 모양',
    description: '여러 가지 물건의 모양을 관찰하고 분류할 수 있습니다.',
  },
  {
    id: '3',
    grade: 3,
    semester: 1,
    category: '수와 연산',
    unitNumber: 1,
    unitName: '덧셈과 뺄셈',
    description: '세 자리 수의 덧셈과 뺄셈을 할 수 있습니다.',
  },
  {
    id: '4',
    grade: 3,
    semester: 1,
    category: '도형과 측정',
    unitNumber: 2,
    unitName: '평면도형',
    description: '여러 가지 평면도형의 특징을 이해할 수 있습니다.',
  },
];

export default function UnitSelection() {
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = ['수와 연산', '변화와 관계', '도형과 측정', '자료와 가능성'];

  // 필터링된 단원
  const filteredUnits = SAMPLE_UNITS.filter((unit) => {
    if (selectedGrade > 0 && unit.grade !== selectedGrade) return false;
    if (selectedSemester > 0 && unit.semester !== selectedSemester) return false;
    if (selectedCategory && unit.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">학습할 단원 선택</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>데모 버전:</strong> 현재 샘플 단원만 표시됩니다.
          백엔드 연결 시 전체 단원이 표시됩니다.
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
          <div key={unit.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
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
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {unit.description}
              </p>
              <div className="flex space-x-2">
                <Link
                  to={`/units/${unit.id}/concepts/${unit.id}`}
                  className="flex-1 text-center px-4 py-2 border border-primary-600 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50"
                >
                  개념 학습
                </Link>
                <Link
                  to={`/problems/${unit.id}`}
                  className="flex-1 text-center px-4 py-2 bg-primary-600 rounded-md text-sm font-medium text-white hover:bg-primary-700"
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
