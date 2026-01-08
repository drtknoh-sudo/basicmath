import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { unitsApi } from '../api/units';
import { Unit } from '../types';
import { useAuthStore } from '../store/authStore';

export default function UnitSelection() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const user = useAuthStore((state) => state.user);

  const categories = ['수와 연산', '변화와 관계', '도형과 측정', '자료와 가능성'];

  useEffect(() => {
    if (user) {
      setSelectedGrade(user.grade);
    }
  }, [user]);

  useEffect(() => {
    fetchUnits();
  }, [selectedGrade, selectedSemester, selectedCategory]);

  const fetchUnits = async () => {
    try {
      const params: any = {};
      if (selectedGrade > 0) params.grade = selectedGrade;
      if (selectedSemester > 0) params.semester = selectedSemester;
      if (selectedCategory) params.category = selectedCategory;

      const data = await unitsApi.getAll(params);
      setUnits(data);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">학습할 단원 선택</h1>

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

      {loading ? (
        <div className="text-center py-12">로딩 중...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
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
      )}

      {!loading && units.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">선택한 조건에 맞는 단원이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
