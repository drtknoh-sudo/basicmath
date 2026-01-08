import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1학년 1학기 - 9까지의 수
const grade1_sem1_unit1_concepts = [
  {
    conceptNumber: 1,
    title: '1부터 5까지의 수',
    explanation: `1, 2, 3, 4, 5의 수를 배웁니다.

물건의 개수를 셀 때 사용하는 숫자입니다:
• 1: 하나
• 2: 둘
• 3: 셋
• 4: 넷
• 5: 다섯

수를 셀 때는:
1. 빠뜨리지 않고 센다
2. 중복하지 않고 센다
3. 순서대로 센다`,
    examples: [
      {
        question: '사과가 3개 있습니다. 개수를 세어보세요.',
        solution: '3',
        steps: ['사과를 하나씩 가리키며 센다', '1, 2, 3', '사과는 모두 3개입니다']
      },
      {
        question: '연필이 5자루 있습니다. 개수를 세어보세요.',
        solution: '5',
        steps: ['연필을 하나씩 가리키며 센다', '1, 2, 3, 4, 5', '연필은 모두 5자루입니다']
      }
    ]
  },
  {
    conceptNumber: 2,
    title: '6부터 9까지의 수',
    explanation: `6, 7, 8, 9의 수를 배웁니다.

• 6: 여섯
• 7: 일곱
• 8: 여덟
• 9: 아홉

5 다음의 수들입니다.`,
    examples: [
      {
        question: '구슬이 7개 있습니다. 개수를 세어보세요.',
        solution: '7',
        steps: ['구슬을 하나씩 센다', '1, 2, 3, 4, 5, 6, 7', '구슬은 모두 7개입니다']
      }
    ]
  }
];

const grade1_sem1_unit1_problems = [
  {
    difficulty: 1,
    type: '단답형',
    question: '그림에 사과가 2개 있습니다. 사과는 모두 몇 개인가요?',
    answer: '2',
    explanation: '사과를 하나씩 세면 1, 2입니다.',
    steps: [{ stepNumber: 1, description: '사과를 하나씩 센다', expectedValue: '1, 2' }]
  },
  {
    difficulty: 1,
    type: '객관식',
    question: '3보다 1 큰 수는 무엇인가요?',
    answer: '4',
    explanation: '3 다음 수는 4입니다.',
    choices: ['2', '3', '4', '5'],
    steps: [{ stepNumber: 1, description: '3 다음 수를 찾는다', expectedValue: '4' }]
  },
  {
    difficulty: 1,
    type: '단답형',
    question: '5개의 공이 있습니다. 공은 모두 몇 개인가요?',
    answer: '5',
    explanation: '공을 세면 1, 2, 3, 4, 5입니다.',
    steps: [{ stepNumber: 1, description: '공을 하나씩 센다', expectedValue: '1, 2, 3, 4, 5' }]
  },
  {
    difficulty: 2,
    type: '객관식',
    question: '6보다 1 작은 수는 무엇인가요?',
    answer: '5',
    explanation: '6 바로 앞의 수는 5입니다.',
    choices: ['4', '5', '6', '7'],
    steps: [{ stepNumber: 1, description: '6 앞의 수를 찾는다', expectedValue: '5' }]
  },
  {
    difficulty: 2,
    type: '단답형',
    question: '7과 9 사이의 수는 무엇인가요?',
    answer: '8',
    explanation: '7 다음이고 9 앞인 수는 8입니다.',
    steps: [{ stepNumber: 1, description: '7과 9 사이의 수를 찾는다', expectedValue: '8' }]
  }
];

// 3학년 1학기 - 덧셈과 뺄셈
const grade3_sem1_unit1_concepts = [
  {
    conceptNumber: 1,
    title: '세 자리 수의 덧셈',
    explanation: `세 자리 수끼리 더하는 방법을 배웁니다.

계산 순서:
1. 일의 자리끼리 더합니다
2. 십의 자리끼리 더합니다
3. 백의 자리끼리 더합니다

받아올림:
• 일의 자리에서 10이 되면 십의 자리로 1을 올립니다
• 십의 자리에서 10이 되면 백의 자리로 1을 올립니다`,
    examples: [
      {
        question: '256 + 137을 계산하세요.',
        solution: '393',
        steps: [
          '일의 자리: 6 + 7 = 13 → 3을 쓰고 1을 올림',
          '십의 자리: 5 + 3 + 1(올림) = 9',
          '백의 자리: 2 + 1 = 3',
          '답: 393'
        ]
      },
      {
        question: '425 + 238을 계산하세요.',
        solution: '663',
        steps: [
          '일의 자리: 5 + 8 = 13 → 3을 쓰고 1을 올림',
          '십의 자리: 2 + 3 + 1(올림) = 6',
          '백의 자리: 4 + 2 = 6',
          '답: 663'
        ]
      }
    ]
  },
  {
    conceptNumber: 2,
    title: '세 자리 수의 뺄셈',
    explanation: `세 자리 수끼리 빼는 방법을 배웁니다.

계산 순서:
1. 일의 자리끼리 뺍니다
2. 십의 자리끼리 뺍니다
3. 백의 자리끼리 뺍니다

받아내림:
• 일의 자리에서 뺄 수 없으면 십의 자리에서 10을 빌려옵니다
• 십의 자리에서 뺄 수 없으면 백의 자리에서 10을 빌려옵니다`,
    examples: [
      {
        question: '523 - 217을 계산하세요.',
        solution: '306',
        steps: [
          '일의 자리: 3 - 7은 뺄 수 없으므로 십의 자리에서 10을 빌림',
          '일의 자리: 13 - 7 = 6',
          '십의 자리: 1 - 1 = 0',
          '백의 자리: 5 - 2 = 3',
          '답: 306'
        ]
      }
    ]
  }
];

const grade3_sem1_unit1_problems = [
  {
    difficulty: 2,
    type: '단답형',
    question: '345 + 123을 계산하세요.',
    answer: '468',
    explanation: '일의 자리: 5+3=8, 십의 자리: 4+2=6, 백의 자리: 3+1=4',
    steps: [
      { stepNumber: 1, description: '일의 자리를 더한다', expectedValue: '8' },
      { stepNumber: 2, description: '십의 자리를 더한다', expectedValue: '6' },
      { stepNumber: 3, description: '백의 자리를 더한다', expectedValue: '4' }
    ]
  },
  {
    difficulty: 3,
    type: '단답형',
    question: '278 + 145를 계산하세요.',
    answer: '423',
    explanation: '일의 자리: 8+5=13(3쓰고 1올림), 십의 자리: 7+4+1=12(2쓰고 1올림), 백의 자리: 2+1+1=4',
    steps: [
      { stepNumber: 1, description: '일의 자리를 더하고 받아올림', expectedValue: '3, 1올림' },
      { stepNumber: 2, description: '십의 자리를 더하고 받아올림', expectedValue: '2, 1올림' },
      { stepNumber: 3, description: '백의 자리를 더한다', expectedValue: '4' }
    ]
  },
  {
    difficulty: 3,
    type: '단답형',
    question: '523 - 217을 계산하세요.',
    answer: '306',
    explanation: '일의 자리: 13-7=6(10을 빌림), 십의 자리: 1-1=0, 백의 자리: 5-2=3',
    steps: [
      { stepNumber: 1, description: '일의 자리에서 10을 빌려 뺀다', expectedValue: '6' },
      { stepNumber: 2, description: '십의 자리를 뺀다', expectedValue: '0' },
      { stepNumber: 3, description: '백의 자리를 뺀다', expectedValue: '3' }
    ]
  },
  {
    difficulty: 2,
    type: '객관식',
    question: '456 + 321은 얼마인가요?',
    answer: '777',
    explanation: '각 자리를 더하면 6+1=7, 5+2=7, 4+3=7입니다.',
    choices: ['677', '777', '877', '767'],
    steps: [
      { stepNumber: 1, description: '각 자리를 더한다', expectedValue: '777' }
    ]
  },
  {
    difficulty: 4,
    type: '서술형',
    question: '어떤 수에 256을 더했더니 489가 되었습니다. 어떤 수를 구하세요.',
    answer: '233',
    explanation: '489 - 256 = 233입니다. 역산을 이용합니다.',
    steps: [
      { stepNumber: 1, description: '뺄셈으로 바꾸기', expectedValue: '489 - 256' },
      { stepNumber: 2, description: '계산하기', expectedValue: '233' }
    ]
  }
];

// 2학년 1학기 - 세 자리 수
const grade2_sem1_unit1_concepts = [
  {
    conceptNumber: 1,
    title: '몇백 알아보기',
    explanation: `100씩 묶어서 세는 방법을 배웁니다.

• 100: 백
• 200: 이백
• 300: 삼백
• 400: 사백

100이 2개면 200이고, 100이 3개면 300입니다.`,
    examples: [
      {
        question: '100이 5개 있습니다. 얼마인가요?',
        solution: '500',
        steps: ['100을 5번 센다', '100, 200, 300, 400, 500', '답은 500입니다']
      }
    ]
  },
  {
    conceptNumber: 2,
    title: '세 자리 수 읽고 쓰기',
    explanation: `세 자리 수는 백의 자리, 십의 자리, 일의 자리로 이루어집니다.

예: 235
• 백의 자리: 2 (200)
• 십의 자리: 3 (30)
• 일의 자리: 5 (5)

235는 "이백삼십오"라고 읽습니다.`,
    examples: [
      {
        question: '417은 어떻게 읽나요?',
        solution: '사백십칠',
        steps: ['백의 자리: 4 → 사백', '십의 자리: 1 → 십', '일의 자리: 7 → 칠', '답: 사백십칠']
      }
    ]
  }
];

const grade2_sem1_unit1_problems = [
  {
    difficulty: 1,
    type: '단답형',
    question: '100이 3개 있습니다. 얼마인가요?',
    answer: '300',
    explanation: '100이 3개면 300입니다.',
    steps: [{ stepNumber: 1, description: '100을 3번 센다', expectedValue: '300' }]
  },
  {
    difficulty: 2,
    type: '객관식',
    question: '526을 올바르게 읽은 것은 무엇인가요?',
    answer: '오백이십육',
    explanation: '5는 백의 자리, 2는 십의 자리, 6은 일의 자리입니다.',
    choices: ['오이육', '오백이십육', '오십이십육', '오백육십이'],
    steps: [{ stepNumber: 1, description: '각 자리를 읽는다', expectedValue: '오백이십육' }]
  },
  {
    difficulty: 2,
    type: '단답형',
    question: '팔백삼십사를 숫자로 쓰세요.',
    answer: '834',
    explanation: '팔백(800) + 삼십(30) + 사(4) = 834',
    steps: [
      { stepNumber: 1, description: '백의 자리: 팔백', expectedValue: '8' },
      { stepNumber: 2, description: '십의 자리: 삼십', expectedValue: '3' },
      { stepNumber: 3, description: '일의 자리: 사', expectedValue: '4' }
    ]
  },
  {
    difficulty: 3,
    type: '객관식',
    question: '364에서 십의 자리 숫자는 무엇인가요?',
    answer: '6',
    explanation: '364에서 6은 십의 자리에 있습니다.',
    choices: ['3', '6', '4', '60'],
    steps: [{ stepNumber: 1, description: '십의 자리를 찾는다', expectedValue: '6' }]
  },
  {
    difficulty: 3,
    type: '단답형',
    question: '600과 700 사이의 백의 자리가 6인 수 중 가장 큰 수는 무엇인가요?',
    answer: '699',
    explanation: '백의 자리가 6이면서 가장 큰 수는 699입니다.',
    steps: [
      { stepNumber: 1, description: '백의 자리를 6으로 정한다', expectedValue: '6__' },
      { stepNumber: 2, description: '나머지 자리를 가장 크게', expectedValue: '699' }
    ]
  }
];

// 4학년 1학기 - 큰 수
const grade4_sem1_unit1_concepts = [
  {
    conceptNumber: 1,
    title: '다섯 자리 수와 여섯 자리 수',
    explanation: `10000(만) 이상의 큰 수를 배웁니다.

자리 이름:
• 만의 자리: 10000
• 십만의 자리: 100000

예: 45,237
• 만의 자리: 4 (40000)
• 천의 자리: 5 (5000)
• 백의 자리: 2 (200)
• 십의 자리: 3 (30)
• 일의 자리: 7 (7)`,
    examples: [
      {
        question: '37254를 읽어보세요.',
        solution: '삼만 칠천이백오십사',
        steps: ['만 자리: 3 → 삼만', '천 자리: 7 → 칠천', '백 자리: 2 → 이백', '십 자리: 5 → 오십', '일 자리: 4 → 사']
      }
    ]
  },
  {
    conceptNumber: 2,
    title: '큰 수의 크기 비교',
    explanation: `큰 수의 크기를 비교하는 방법:

1. 자리수가 많은 수가 크다
2. 자리수가 같으면 큰 자리부터 비교한다

예: 45,832와 45,729 비교
→ 만의 자리: 4 = 4
→ 천의 자리: 5 = 5
→ 백의 자리: 8 > 7
→ 45,832가 더 크다`,
    examples: [
      {
        question: '62,458과 62,541 중 어느 것이 더 큰가요?',
        solution: '62,541',
        steps: ['만의 자리 비교: 6 = 6', '천의 자리 비교: 2 = 2', '백의 자리 비교: 4 < 5', '62,541이 더 크다']
      }
    ]
  }
];

const grade4_sem1_unit1_problems = [
  {
    difficulty: 2,
    type: '단답형',
    question: '10000이 5개, 1000이 3개, 100이 2개인 수를 쓰세요.',
    answer: '53200',
    explanation: '50000 + 3000 + 200 = 53200',
    steps: [
      { stepNumber: 1, description: '10000이 5개', expectedValue: '50000' },
      { stepNumber: 2, description: '1000이 3개', expectedValue: '3000' },
      { stepNumber: 3, description: '100이 2개', expectedValue: '200' },
      { stepNumber: 4, description: '모두 더한다', expectedValue: '53200' }
    ]
  },
  {
    difficulty: 3,
    type: '객관식',
    question: '78,542를 올바르게 읽은 것은?',
    answer: '칠만 팔천오백사십이',
    explanation: '만 단위부터 순서대로 읽습니다.',
    choices: ['칠팔오사이', '칠만 팔천오백사십이', '칠십팔만 오천사백이십', '칠만 팔십오백사십이'],
    steps: [{ stepNumber: 1, description: '각 자리를 읽는다', expectedValue: '칠만 팔천오백사십이' }]
  },
  {
    difficulty: 3,
    type: '단답형',
    question: '56,789에서 천의 자리 숫자는 무엇인가요?',
    answer: '6',
    explanation: '56,789에서 6은 천의 자리 숫자입니다.',
    steps: [{ stepNumber: 1, description: '천의 자리를 찾는다', expectedValue: '6' }]
  },
  {
    difficulty: 4,
    type: '객관식',
    question: '85,432와 85,398 중 어느 수가 더 큰가요?',
    answer: '85,432',
    explanation: '백의 자리를 비교하면 4 > 3이므로 85,432가 더 큽니다.',
    choices: ['85,432', '85,398', '같다', '알 수 없다'],
    steps: [
      { stepNumber: 1, description: '만의 자리 비교', expectedValue: '8 = 8' },
      { stepNumber: 2, description: '천의 자리 비교', expectedValue: '5 = 5' },
      { stepNumber: 3, description: '백의 자리 비교', expectedValue: '4 > 3' }
    ]
  },
  {
    difficulty: 4,
    type: '서술형',
    question: '만의 자리가 7이고 백의 자리가 3인 다섯 자리 수 중 가장 작은 수를 구하세요.',
    answer: '70300',
    explanation: '만의 자리는 7, 백의 자리는 3, 나머지는 가능한 작게 0으로 채웁니다.',
    steps: [
      { stepNumber: 1, description: '만의 자리: 7', expectedValue: '7____' },
      { stepNumber: 2, description: '천의 자리: 가장 작게', expectedValue: '70___' },
      { stepNumber: 3, description: '백의 자리: 3', expectedValue: '703__' },
      { stepNumber: 4, description: '십과 일의 자리: 00', expectedValue: '70300' }
    ]
  }
];

// 5학년 1학기 - 약수와 배수
const grade5_sem1_unit1_concepts = [
  {
    conceptNumber: 1,
    title: '약수와 배수',
    explanation: `약수: 어떤 수를 나누어떨어지게 하는 수
배수: 어떤 수를 1배, 2배, 3배... 한 수

예: 12의 약수와 배수
• 약수: 1, 2, 3, 4, 6, 12
• 배수: 12, 24, 36, 48, 60...

약수는 개수가 정해져 있고, 배수는 무한히 많습니다.`,
    examples: [
      {
        question: '18의 약수를 모두 구하세요.',
        solution: '1, 2, 3, 6, 9, 18',
        steps: ['18을 나누어떨어지게 하는 수를 찾는다', '1×18, 2×9, 3×6', '약수: 1, 2, 3, 6, 9, 18']
      }
    ]
  },
  {
    conceptNumber: 2,
    title: '최대공약수와 최소공배수',
    explanation: `최대공약수: 두 수의 공통된 약수 중 가장 큰 수
최소공배수: 두 수의 공통된 배수 중 가장 작은 수

예: 12와 18의 최대공약수와 최소공배수
• 12의 약수: 1, 2, 3, 4, 6, 12
• 18의 약수: 1, 2, 3, 6, 9, 18
• 공약수: 1, 2, 3, 6
• 최대공약수: 6

• 12의 배수: 12, 24, 36, 48...
• 18의 배수: 18, 36, 54, 72...
• 공배수: 36, 72...
• 최소공배수: 36`,
    examples: [
      {
        question: '8과 12의 최대공약수를 구하세요.',
        solution: '4',
        steps: ['8의 약수: 1, 2, 4, 8', '12의 약수: 1, 2, 3, 4, 6, 12', '공약수: 1, 2, 4', '최대공약수: 4']
      }
    ]
  }
];

const grade5_sem1_unit1_problems = [
  {
    difficulty: 2,
    type: '단답형',
    question: '24의 약수를 모두 구하세요.',
    answer: '1, 2, 3, 4, 6, 8, 12, 24',
    explanation: '24를 나누어떨어지게 하는 모든 수입니다.',
    steps: [
      { stepNumber: 1, description: '1×24, 2×12, 3×8, 4×6', expectedValue: '약수 찾기' },
      { stepNumber: 2, description: '약수 나열', expectedValue: '1, 2, 3, 4, 6, 8, 12, 24' }
    ]
  },
  {
    difficulty: 3,
    type: '객관식',
    question: '6의 배수가 아닌 것은?',
    answer: '25',
    explanation: '6의 배수는 6, 12, 18, 24, 30... 입니다.',
    choices: ['12', '18', '25', '30'],
    steps: [{ stepNumber: 1, description: '각 수를 6으로 나누어본다', expectedValue: '25는 나누어떨어지지 않음' }]
  },
  {
    difficulty: 3,
    type: '단답형',
    question: '4와 6의 최대공약수를 구하세요.',
    answer: '2',
    explanation: '4의 약수: 1, 2, 4 / 6의 약수: 1, 2, 3, 6 / 공약수 중 가장 큰 수는 2',
    steps: [
      { stepNumber: 1, description: '4의 약수', expectedValue: '1, 2, 4' },
      { stepNumber: 2, description: '6의 약수', expectedValue: '1, 2, 3, 6' },
      { stepNumber: 3, description: '최대공약수', expectedValue: '2' }
    ]
  },
  {
    difficulty: 4,
    type: '단답형',
    question: '4와 6의 최소공배수를 구하세요.',
    answer: '12',
    explanation: '4의 배수: 4, 8, 12... / 6의 배수: 6, 12, 18... / 공배수 중 가장 작은 수는 12',
    steps: [
      { stepNumber: 1, description: '4의 배수', expectedValue: '4, 8, 12, 16...' },
      { stepNumber: 2, description: '6의 배수', expectedValue: '6, 12, 18...' },
      { stepNumber: 3, description: '최소공배수', expectedValue: '12' }
    ]
  },
  {
    difficulty: 4,
    type: '서술형',
    question: '12와 18의 최대공약수와 최소공배수를 각각 구하세요.',
    answer: '최대공약수: 6, 최소공배수: 36',
    explanation: '공약수 중 가장 큰 수는 6, 공배수 중 가장 작은 수는 36입니다.',
    steps: [
      { stepNumber: 1, description: '12의 약수', expectedValue: '1, 2, 3, 4, 6, 12' },
      { stepNumber: 2, description: '18의 약수', expectedValue: '1, 2, 3, 6, 9, 18' },
      { stepNumber: 3, description: '최대공약수', expectedValue: '6' },
      { stepNumber: 4, description: '최소공배수 구하기', expectedValue: '36' }
    ]
  }
];

// 6학년 1학기 - 분수의 나눗셈
const grade6_sem1_unit1_concepts = [
  {
    conceptNumber: 1,
    title: '(분수) ÷ (자연수)',
    explanation: `분수를 자연수로 나누는 방법:

방법 1: 분자를 나눈다
• 2/5 ÷ 2 = 1/5

방법 2: 분모에 곱한다
• 2/5 ÷ 2 = 2/(5×2) = 2/10 = 1/5

두 방법 모두 같은 답이 나옵니다.`,
    examples: [
      {
        question: '3/4 ÷ 3을 계산하세요.',
        solution: '1/4',
        steps: ['분자를 3으로 나눈다', '3 ÷ 3 = 1', '답: 1/4']
      }
    ]
  },
  {
    conceptNumber: 2,
    title: '(자연수) ÷ (분수)',
    explanation: `자연수를 분수로 나누는 방법:

나누는 분수의 역수를 곱합니다.

예: 6 ÷ 2/3
= 6 × 3/2
= 18/2
= 9

역수란? 분자와 분모를 바꾼 것
• 2/3의 역수 = 3/2`,
    examples: [
      {
        question: '4 ÷ 2/5를 계산하세요.',
        solution: '10',
        steps: ['2/5의 역수는 5/2', '4 × 5/2 = 20/2 = 10', '답: 10']
      }
    ]
  }
];

const grade6_sem1_unit1_problems = [
  {
    difficulty: 2,
    type: '단답형',
    question: '4/5 ÷ 2를 계산하세요.',
    answer: '2/5',
    explanation: '분자를 2로 나눕니다: 4 ÷ 2 = 2',
    steps: [
      { stepNumber: 1, description: '분자를 나눈다', expectedValue: '4 ÷ 2 = 2' },
      { stepNumber: 2, description: '답을 쓴다', expectedValue: '2/5' }
    ]
  },
  {
    difficulty: 3,
    type: '객관식',
    question: '6/7 ÷ 3을 계산하면?',
    answer: '2/7',
    explanation: '분자 6을 3으로 나누면 2입니다.',
    choices: ['2/7', '3/7', '6/21', '18/7'],
    steps: [{ stepNumber: 1, description: '분자를 나눈다', expectedValue: '2/7' }]
  },
  {
    difficulty: 3,
    type: '단답형',
    question: '3 ÷ 1/2를 계산하세요.',
    answer: '6',
    explanation: '1/2의 역수는 2/1입니다. 3 × 2 = 6',
    steps: [
      { stepNumber: 1, description: '역수를 구한다', expectedValue: '2/1' },
      { stepNumber: 2, description: '곱셈으로 바꾼다', expectedValue: '3 × 2' },
      { stepNumber: 3, description: '계산한다', expectedValue: '6' }
    ]
  },
  {
    difficulty: 4,
    type: '단답형',
    question: '5 ÷ 2/3을 계산하세요.',
    answer: '15/2',
    explanation: '2/3의 역수는 3/2입니다. 5 × 3/2 = 15/2',
    steps: [
      { stepNumber: 1, description: '역수를 구한다', expectedValue: '3/2' },
      { stepNumber: 2, description: '곱셈으로 바꾼다', expectedValue: '5 × 3/2' },
      { stepNumber: 3, description: '계산한다', expectedValue: '15/2' }
    ]
  },
  {
    difficulty: 5,
    type: '서술형',
    question: '길이가 6m인 끈을 2/3m씩 자르면 몇 도막이 되는지 구하세요.',
    answer: '9',
    explanation: '6 ÷ 2/3 = 6 × 3/2 = 18/2 = 9입니다.',
    steps: [
      { stepNumber: 1, description: '나눗셈 식을 세운다', expectedValue: '6 ÷ 2/3' },
      { stepNumber: 2, description: '역수를 곱한다', expectedValue: '6 × 3/2' },
      { stepNumber: 3, description: '계산한다', expectedValue: '18/2 = 9' }
    ]
  }
];

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // 1학년 1학기 단원들
  console.log('📚 Creating Grade 1, Semester 1 units...');

  const grade1_unit1 = await prisma.unit.create({
    data: {
      grade: 1,
      semester: 1,
      category: '수와 연산',
      unitNumber: 1,
      unitName: '9까지의 수',
      description: '1부터 9까지의 수를 세고 읽고 쓸 수 있습니다.',
      objectives: [
        '1부터 9까지의 수를 세고 읽고 쓸 수 있다',
        '수의 순서를 알 수 있다',
        '수의 크기를 비교할 수 있다'
      ],
    },
  });

  // 1학년 개념 추가
  console.log('💡 Adding Grade 1 concepts...');
  for (const conceptData of grade1_sem1_unit1_concepts) {
    await prisma.concept.create({
      data: {
        unitId: grade1_unit1.id,
        ...conceptData,
      },
    });
  }

  // 1학년 문제 추가
  console.log('📝 Adding Grade 1 problems...');
  const grade1_concepts = await prisma.concept.findMany({
    where: { unitId: grade1_unit1.id },
  });

  for (const problem of grade1_sem1_unit1_problems) {
    await prisma.problem.create({
      data: {
        unitId: grade1_unit1.id,
        conceptId: grade1_concepts[0].id,
        ...problem,
        verificationStatus: true,
        verifiedBy: 'system',
        verifiedAt: new Date(),
      },
    });
  }

  // 2학년 1학기 단원
  console.log('📚 Creating Grade 2, Semester 1 units...');

  const grade2_unit1 = await prisma.unit.create({
    data: {
      grade: 2,
      semester: 1,
      category: '수와 연산',
      unitNumber: 1,
      unitName: '세 자리 수',
      description: '세 자리 수를 이해하고 읽고 쓸 수 있습니다.',
      objectives: [
        '몇백을 알고 쓸 수 있다',
        '세 자리 수를 읽고 쓸 수 있다',
        '자릿값을 이해할 수 있다'
      ],
    },
  });

  console.log('💡 Adding Grade 2 concepts...');
  for (const conceptData of grade2_sem1_unit1_concepts) {
    await prisma.concept.create({
      data: {
        unitId: grade2_unit1.id,
        ...conceptData,
      },
    });
  }

  console.log('📝 Adding Grade 2 problems...');
  const grade2_concepts = await prisma.concept.findMany({
    where: { unitId: grade2_unit1.id },
  });

  for (const problem of grade2_sem1_unit1_problems) {
    await prisma.problem.create({
      data: {
        unitId: grade2_unit1.id,
        conceptId: grade2_concepts[0].id,
        ...problem,
        verificationStatus: true,
        verifiedBy: 'system',
        verifiedAt: new Date(),
      },
    });
  }

  // 3학년 1학기 단원
  console.log('📚 Creating Grade 3, Semester 1 units...');

  const grade3_unit1 = await prisma.unit.create({
    data: {
      grade: 3,
      semester: 1,
      category: '수와 연산',
      unitNumber: 1,
      unitName: '덧셈과 뺄셈',
      description: '세 자리 수의 덧셈과 뺄셈을 할 수 있습니다.',
      objectives: [
        '받아올림이 있는 세 자리 수의 덧셈을 할 수 있다',
        '받아내림이 있는 세 자리 수의 뺄셈을 할 수 있다',
        '덧셈과 뺄셈의 관계를 이해할 수 있다'
      ],
    },
  });

  console.log('💡 Adding Grade 3 concepts...');
  for (const conceptData of grade3_sem1_unit1_concepts) {
    await prisma.concept.create({
      data: {
        unitId: grade3_unit1.id,
        ...conceptData,
      },
    });
  }

  console.log('📝 Adding Grade 3 problems...');
  const grade3_concepts = await prisma.concept.findMany({
    where: { unitId: grade3_unit1.id },
  });

  for (const problem of grade3_sem1_unit1_problems) {
    await prisma.problem.create({
      data: {
        unitId: grade3_unit1.id,
        conceptId: grade3_concepts[0].id,
        ...problem,
        verificationStatus: true,
        verifiedBy: 'system',
        verifiedAt: new Date(),
      },
    });
  }

  // 4학년 1학기 단원
  console.log('📚 Creating Grade 4, Semester 1 units...');

  const grade4_unit1 = await prisma.unit.create({
    data: {
      grade: 4,
      semester: 1,
      category: '수와 연산',
      unitNumber: 1,
      unitName: '큰 수',
      description: '다섯 자리 이상의 큰 수를 이해하고 활용할 수 있습니다.',
      objectives: [
        '만 단위를 알고 큰 수를 읽고 쓸 수 있다',
        '큰 수의 크기를 비교할 수 있다',
        '큰 수의 자릿값을 이해할 수 있다'
      ],
    },
  });

  console.log('💡 Adding Grade 4 concepts...');
  for (const conceptData of grade4_sem1_unit1_concepts) {
    await prisma.concept.create({
      data: {
        unitId: grade4_unit1.id,
        ...conceptData,
      },
    });
  }

  console.log('📝 Adding Grade 4 problems...');
  const grade4_concepts = await prisma.concept.findMany({
    where: { unitId: grade4_unit1.id },
  });

  for (const problem of grade4_sem1_unit1_problems) {
    await prisma.problem.create({
      data: {
        unitId: grade4_unit1.id,
        conceptId: grade4_concepts[0].id,
        ...problem,
        verificationStatus: true,
        verifiedBy: 'system',
        verifiedAt: new Date(),
      },
    });
  }

  // 5학년 1학기 단원
  console.log('📚 Creating Grade 5, Semester 1 units...');

  const grade5_unit1 = await prisma.unit.create({
    data: {
      grade: 5,
      semester: 1,
      category: '수와 연산',
      unitNumber: 1,
      unitName: '약수와 배수',
      description: '약수와 배수의 개념을 이해하고 활용할 수 있습니다.',
      objectives: [
        '약수와 배수의 개념을 이해할 수 있다',
        '최대공약수와 최소공배수를 구할 수 있다',
        '약수와 배수를 실생활에 활용할 수 있다'
      ],
    },
  });

  console.log('💡 Adding Grade 5 concepts...');
  for (const conceptData of grade5_sem1_unit1_concepts) {
    await prisma.concept.create({
      data: {
        unitId: grade5_unit1.id,
        ...conceptData,
      },
    });
  }

  console.log('📝 Adding Grade 5 problems...');
  const grade5_concepts = await prisma.concept.findMany({
    where: { unitId: grade5_unit1.id },
  });

  for (const problem of grade5_sem1_unit1_problems) {
    await prisma.problem.create({
      data: {
        unitId: grade5_unit1.id,
        conceptId: grade5_concepts[0].id,
        ...problem,
        verificationStatus: true,
        verifiedBy: 'system',
        verifiedAt: new Date(),
      },
    });
  }

  // 6학년 1학기 단원
  console.log('📚 Creating Grade 6, Semester 1 units...');

  const grade6_unit1 = await prisma.unit.create({
    data: {
      grade: 6,
      semester: 1,
      category: '수와 연산',
      unitNumber: 1,
      unitName: '분수의 나눗셈',
      description: '분수의 나눗셈을 이해하고 계산할 수 있습니다.',
      objectives: [
        '(분수)÷(자연수)를 계산할 수 있다',
        '(자연수)÷(분수)를 계산할 수 있다',
        '분수의 나눗셈을 실생활에 활용할 수 있다'
      ],
    },
  });

  console.log('💡 Adding Grade 6 concepts...');
  for (const conceptData of grade6_sem1_unit1_concepts) {
    await prisma.concept.create({
      data: {
        unitId: grade6_unit1.id,
        ...conceptData,
      },
    });
  }

  console.log('📝 Adding Grade 6 problems...');
  const grade6_concepts = await prisma.concept.findMany({
    where: { unitId: grade6_unit1.id },
  });

  for (const problem of grade6_sem1_unit1_problems) {
    await prisma.problem.create({
      data: {
        unitId: grade6_unit1.id,
        conceptId: grade6_concepts[0].id,
        ...problem,
        verificationStatus: true,
        verifiedBy: 'system',
        verifiedAt: new Date(),
      },
    });
  }

  // 추가 단원 생성 (샘플)
  const additionalUnits = [
    {
      grade: 1,
      semester: 1,
      category: '도형과 측정',
      unitNumber: 2,
      unitName: '여러 가지 모양',
      description: '여러 가지 물건의 모양을 관찰하고 분류할 수 있습니다.',
      objectives: ['여러 가지 물건을 모양에 따라 분류할 수 있다', '모양의 특징을 설명할 수 있다'],
    },
    {
      grade: 2,
      semester: 1,
      category: '수와 연산',
      unitNumber: 2,
      unitName: '덧셈과 뺄셈',
      description: '두 자리 수의 덧셈과 뺄셈을 할 수 있습니다.',
      objectives: ['받아올림이 있는 덧셈을 할 수 있다', '받아내림이 있는 뺄셈을 할 수 있다'],
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
      grade: 4,
      semester: 1,
      category: '수와 연산',
      unitNumber: 2,
      unitName: '곱셈과 나눗셈',
      description: '세 자리 수의 곱셈과 나눗셈을 할 수 있습니다.',
      objectives: ['(세 자리 수)×(한 자리 수)를 계산할 수 있다', '(두 자리 수)÷(한 자리 수)를 계산할 수 있다'],
    },
    {
      grade: 5,
      semester: 1,
      category: '수와 연산',
      unitNumber: 2,
      unitName: '분수의 덧셈과 뺄셈',
      description: '이분모 분수의 덧셈과 뺄셈을 할 수 있습니다.',
      objectives: ['통분의 개념을 이해할 수 있다', '이분모 분수의 덧셈과 뺄셈을 할 수 있다'],
    },
    {
      grade: 6,
      semester: 1,
      category: '변화와 관계',
      unitNumber: 2,
      unitName: '비와 비율',
      description: '비와 비율의 개념을 이해하고 활용할 수 있습니다.',
      objectives: ['비의 개념을 이해할 수 있다', '비율을 구할 수 있다', '비와 비율을 실생활에 활용할 수 있다'],
    },
  ];

  console.log('📚 Creating additional units...');
  for (const unitData of additionalUnits) {
    await prisma.unit.create({ data: unitData });
  }

  const totalConcepts =
    grade1_sem1_unit1_concepts.length +
    grade2_sem1_unit1_concepts.length +
    grade3_sem1_unit1_concepts.length +
    grade4_sem1_unit1_concepts.length +
    grade5_sem1_unit1_concepts.length +
    grade6_sem1_unit1_concepts.length;

  const totalProblems =
    grade1_sem1_unit1_problems.length +
    grade2_sem1_unit1_problems.length +
    grade3_sem1_unit1_problems.length +
    grade4_sem1_unit1_problems.length +
    grade5_sem1_unit1_problems.length +
    grade6_sem1_unit1_problems.length;

  console.log('✅ Comprehensive database seeding completed!');
  console.log('📊 Summary:');
  console.log(`   - Created 12 units (6 with full content + 6 additional)`);
  console.log(`   - Created ${totalConcepts} concepts`);
  console.log(`   - Created ${totalProblems} verified problems`);
  console.log('');
  console.log('📚 Content by Grade:');
  console.log(`   - Grade 1: 2 concepts, ${grade1_sem1_unit1_problems.length} problems`);
  console.log(`   - Grade 2: 2 concepts, ${grade2_sem1_unit1_problems.length} problems`);
  console.log(`   - Grade 3: 2 concepts, ${grade3_sem1_unit1_problems.length} problems`);
  console.log(`   - Grade 4: 2 concepts, ${grade4_sem1_unit1_problems.length} problems`);
  console.log(`   - Grade 5: 2 concepts, ${grade5_sem1_unit1_problems.length} problems`);
  console.log(`   - Grade 6: 2 concepts, ${grade6_sem1_unit1_problems.length} problems`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
