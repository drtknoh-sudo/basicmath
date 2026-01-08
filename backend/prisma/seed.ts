import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1학년 1학기 단원들
  const grade1_sem1_units = [
    {
      grade: 1,
      semester: 1,
      category: '수와 연산',
      unitNumber: 1,
      unitName: '9까지의 수',
      description: '1부터 9까지의 수를 세고 읽고 쓸 수 있습니다.',
      objectives: ['1부터 9까지의 수를 세고 읽고 쓸 수 있다', '수의 순서를 알 수 있다', '수의 크기를 비교할 수 있다'],
    },
    {
      grade: 1,
      semester: 1,
      category: '수와 연산',
      unitNumber: 2,
      unitName: '여러 가지 모양',
      description: '여러 가지 물건의 모양을 관찰하고 분류할 수 있습니다.',
      objectives: ['여러 가지 물건을 모양에 따라 분류할 수 있다', '모양의 특징을 설명할 수 있다'],
    },
    {
      grade: 1,
      semester: 1,
      category: '수와 연산',
      unitNumber: 3,
      unitName: '덧셈과 뺄셈',
      description: '9까지의 수의 덧셈과 뺄셈을 할 수 있습니다.',
      objectives: ['덧셈의 의미를 이해하고 덧셈식을 쓸 수 있다', '뺄셈의 의미를 이해하고 뺄셈식을 쓸 수 있다', '덧셈과 뺄셈을 할 수 있다'],
    },
  ];

  // 3학년 1학기 단원들
  const grade3_sem1_units = [
    {
      grade: 3,
      semester: 1,
      category: '수와 연산',
      unitNumber: 1,
      unitName: '덧셈과 뺄셈',
      description: '세 자리 수의 덧셈과 뺄셈을 할 수 있습니다.',
      objectives: ['받아올림이 있는 세 자리 수의 덧셈을 할 수 있다', '받아내림이 있는 세 자리 수의 뺄셈을 할 수 있다'],
    },
    {
      grade: 3,
      semester: 1,
      category: '도형과 측정',
      unitNumber: 2,
      unitName: '평면도형',
      description: '여러 가지 평면도형의 특징을 이해할 수 있습니다.',
      objectives: ['원, 삼각형, 사각형의 특징을 알 수 있다', '여러 가지 평면도형을 분류할 수 있다'],
    },
    {
      grade: 3,
      semester: 1,
      category: '수와 연산',
      unitNumber: 3,
      unitName: '나눗셈',
      description: '나눗셈의 의미를 이해하고 나눗셈을 할 수 있습니다.',
      objectives: ['똑같이 나누는 상황을 이해할 수 있다', '나눗셈식을 쓰고 계산할 수 있다'],
    },
  ];

  const allUnits = [...grade1_sem1_units, ...grade3_sem1_units];

  for (const unitData of allUnits) {
    const unit = await prisma.unit.create({
      data: unitData,
    });

    // 각 단원에 개념 추가
    if (unitData.unitName === '9까지의 수') {
      await prisma.concept.create({
        data: {
          unitId: unit.id,
          conceptNumber: 1,
          title: '1부터 9까지의 수 세기',
          explanation: `우리 주변에는 많은 물건들이 있습니다. 물건의 개수를 셀 때 1, 2, 3, 4, 5, 6, 7, 8, 9라는 수를 사용합니다.

수를 셀 때는:
- 빠뜨리지 않고 세어야 합니다
- 중복되지 않게 세어야 합니다
- 순서대로 세어야 합니다`,
          examples: [
            {
              question: '사과가 5개 있습니다. 사과의 개수를 세어보세요.',
              solution: '5',
              steps: ['사과를 하나씩 가리키며 센다', '1, 2, 3, 4, 5', '사과는 모두 5개입니다'],
            },
          ],
        },
      });

      // 문제 추가
      await prisma.problem.createMany({
        data: [
          {
            unitId: unit.id,
            conceptId: (await prisma.concept.findFirst({ where: { unitId: unit.id } }))!.id,
            difficulty: 1,
            type: '단답형',
            question: '그림에 공이 3개 있습니다. 공의 개수는 몇 개인가요?',
            answer: '3',
            explanation: '공을 하나씩 세면 1, 2, 3으로 3개입니다.',
            steps: [{ stepNumber: 1, description: '공을 하나씩 센다', expectedValue: '1, 2, 3' }],
            verificationStatus: true,
            verifiedBy: 'system',
            verifiedAt: new Date(),
          },
          {
            unitId: unit.id,
            conceptId: (await prisma.concept.findFirst({ where: { unitId: unit.id } }))!.id,
            difficulty: 1,
            type: '객관식',
            question: '7보다 1 큰 수는 무엇인가요?',
            answer: '8',
            explanation: '7 다음 수는 8입니다. 7보다 1 크면 8이 됩니다.',
            choices: ['6', '7', '8', '9'],
            steps: [{ stepNumber: 1, description: '7 다음 수를 찾는다', expectedValue: '8' }],
            verificationStatus: true,
            verifiedBy: 'system',
            verifiedAt: new Date(),
          },
        ],
      });
    }

    if (unitData.unitName === '덧셈과 뺄셈' && unitData.grade === 3) {
      const concept = await prisma.concept.create({
        data: {
          unitId: unit.id,
          conceptNumber: 1,
          title: '세 자리 수의 덧셈',
          explanation: `세 자리 수끼리 더할 때는 일의 자리부터 차례로 계산합니다.

계산 순서:
1. 일의 자리끼리 더합니다
2. 십의 자리끼리 더합니다
3. 백의 자리끼리 더합니다

받아올림이 있을 때는:
- 일의 자리에서 10이 되면 십의 자리로 1을 올립니다
- 십의 자리에서 10이 되면 백의 자리로 1을 올립니다`,
          examples: [
            {
              question: '256 + 137을 계산하세요.',
              solution: '393',
              steps: [
                '일의 자리: 6 + 7 = 13, 3을 쓰고 1을 올림',
                '십의 자리: 5 + 3 + 1(올림) = 9',
                '백의 자리: 2 + 1 = 3',
                '답: 393',
              ],
            },
          ],
        },
      });

      await prisma.problem.createMany({
        data: [
          {
            unitId: unit.id,
            conceptId: concept.id,
            difficulty: 2,
            type: '단답형',
            question: '345 + 123을 계산하세요.',
            answer: '468',
            explanation: '일의 자리: 5+3=8, 십의 자리: 4+2=6, 백의 자리: 3+1=4이므로 답은 468입니다.',
            steps: [
              { stepNumber: 1, description: '일의 자리를 더한다', expectedValue: '8' },
              { stepNumber: 2, description: '십의 자리를 더한다', expectedValue: '6' },
              { stepNumber: 3, description: '백의 자리를 더한다', expectedValue: '4' },
            ],
            verificationStatus: true,
            verifiedBy: 'system',
            verifiedAt: new Date(),
          },
          {
            unitId: unit.id,
            conceptId: concept.id,
            difficulty: 3,
            type: '단답형',
            question: '278 + 145를 계산하세요.',
            answer: '423',
            explanation: '일의 자리: 8+5=13(3쓰고 1올림), 십의 자리: 7+4+1=12(2쓰고 1올림), 백의 자리: 2+1+1=4이므로 답은 423입니다.',
            steps: [
              { stepNumber: 1, description: '일의 자리를 더하고 받아올림', expectedValue: '13, 3쓰고 1올림' },
              { stepNumber: 2, description: '십의 자리를 더하고 받아올림', expectedValue: '12, 2쓰고 1올림' },
              { stepNumber: 3, description: '백의 자리를 더한다', expectedValue: '4' },
            ],
            verificationStatus: true,
            verifiedBy: 'system',
            verifiedAt: new Date(),
          },
        ],
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📚 Created ${allUnits.length} units`);
  console.log('💡 Created concepts and problems for sample units');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
