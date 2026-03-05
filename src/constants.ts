import {
  ToggleRight,
  ToggleLeft,
  ArrowUpRight,
  ArrowDownRight,
  Equal,
  ChevronRight,
  ChevronLeft,
  ChevronRightSquare,
  ChevronLeftSquare,
  Binary,
  Timer,
  Hash,
  Circle,
  CircleOff,
  Lock,
  Unlock,
  RefreshCw,
  Zap,
  Activity,
  Calculator,
  ArrowRightLeft,
  Plus,
  Minus,
  X,
  Divide,
  Percent,
  Columns,
  Box
} from 'lucide-react';

export interface NodeMetadata {
  name: string;
  type: string;
  operation: string;
  description: string;
  icon: any;
  iconName: string;
  category: string;
  shape: 'logic-node' | 'timer-node' | 'block-node';
  ports: [];
}

export const NODE_CATEGORIES = [
  {
    title: 'Contacts (접점)',
    items: [
      {
        name: 'NO Contact',
        type: '접점',
        operation: '대상 비트가 true이면 통과',
        description: 'A접점. 가장 기본 조건',
        icon: ToggleRight,
        iconName: 'ToggleRight',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In', tooltip: '입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'NC Contact',
        type: '접점',
        operation: '대상 비트가 false이면 통과',
        description: 'B접점. 인터락에 사용',
        icon: ToggleLeft,
        iconName: 'ToggleLeft',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In', tooltip: '입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'Rising Edge Contact',
        type: '엣지 접점',
        operation: 'prev=false → curr=true일 때 한 Scan만 true',
        description: '원샷(P접점). 버튼 1회 동작',
        icon: ArrowUpRight,
        iconName: 'ArrowUpRight',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In', tooltip: '입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'Falling Edge Contact',
        type: '엣지 접점',
        operation: 'prev=true → curr=false일 때 한 Scan만 true',
        description: '하강 원샷(N접점)',
        icon: ArrowDownRight,
        iconName: 'ArrowDownRight',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In', tooltip: '입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'Equal Compare Contact',
        type: '비교 접점',
        operation: 'A == B 이면 통과',
        description: '수치 제어 조건',
        icon: Equal,
        iconName: 'Equal',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In_A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'In_B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'Greater Compare Contact',
        type: '비교 접점',
        operation: 'A > B 이면 통과',
        description: '임계치 판단',
        icon: ChevronRight,
        iconName: 'ChevronRight',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In_A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'In_B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'Less Compare Contact',
        type: '비교 접점',
        operation: 'A < B 이면 통과',
        description: '하한 감시',
        icon: ChevronLeft,
        iconName: 'ChevronLeft',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In_A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'In_B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'GreaterEqual Contact',
        type: '비교 접점',
        operation: 'A ≥ B 이면 통과',
        description: '상한 및 일치 감시',
        icon: ChevronRightSquare,
        iconName: 'ChevronRightSquare',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In_A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'In_B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'LessEqual Contact',
        type: '비교 접점',
        operation: 'A ≤ B 이면 통과',
        description: '하한 및 일치 감시',
        icon: ChevronLeftSquare,
        iconName: 'ChevronLeftSquare',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In_A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'In_B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'BitMask Contact',
        type: '비트 조건',
        operation: '(Value & Mask) != 0 이면 통과',
        description: '상태 워드 분석',
        icon: Binary,
        iconName: 'Binary',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'In_A', tooltip: 'Value', isReadOnly: true },
            { group: 'in', id: 'In_B', tooltip: 'Mask', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: 'Out', isReadOnly: true },
          ]
        },
      },
      {
        name: 'Timer Done Contact',
        type: '상태 접점',
        operation: 'Timer.DN true 시 통과',
        description: 'TON/TOF 완료 감지',
        icon: Timer,
        iconName: 'Timer',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'TimerDone', tooltip: '타이머 완료 입력', isReadOnly: true },
            { group: 'out', id: 'ContactOut', tooltip: '접점 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'Counter Done Contact',
        type: '상태 접점',
        operation: 'Counter.Q true 시 통과',
        description: '목표 카운트 도달',
        icon: Hash,
        iconName: 'Hash',
        category: 'Contact',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'TimerDone', tooltip: '카운터 완료 입력', isReadOnly: true },
            { group: 'out', id: 'ContactOut', tooltip: '접점 출력', isReadOnly: true },
          ]
        },
      }
    ]
  },
  {
    title: 'Coils / Outputs (출력)',
    items: [
      {
        name: 'Coil',
        type: '일반 출력',
        operation: 'Rung true → Bit = true',
        description: '가장 기본 코일',
        icon: Circle,
        iconName: 'Circle',
        category: 'Output',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'CoilIn', tooltip: '접점 신호 입력', isReadOnly: true }, // 코일 동작 조건
          ]
        },
      },
      {
        name: 'Inverted Coil',
        type: '반전 출력',
        operation: 'Rung true → Bit = false',
        description: '논리 반전',
        icon: CircleOff,
        iconName: 'CircleOff',
        category: 'Output',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'CoilIn', tooltip: '접점 신호 입력', isReadOnly: true }, // 코일 동작 조건
          ]
        },
      },
      {
        name: 'Set Coil (Latch)',
        type: '래치',
        operation: 'Rung true → Bit = true (유지)',
        description: '자기 유지 회로',
        icon: Lock,
        iconName: 'Lock',
        category: 'Output',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'CoilIn', tooltip: '접점 신호 입력', isReadOnly: true }, // 코일 동작 조건
          ]
        },
      },
      {
        name: 'Reset Coil',
        type: '리셋',
        operation: 'Rung true → Bit = false',
        description: '래치 해제',
        icon: Unlock,
        iconName: 'Unlock',
        category: 'Output',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'CoilIn', tooltip: '접점 신호 입력', isReadOnly: true }, // 코일 동작 조건
          ]
        },
      },
      {
        name: 'Toggle Coil',
        type: '토글',
        operation: 'Rung true 순간 Bit 반전',
        description: '버튼형 동작',
        icon: RefreshCw,
        iconName: 'RefreshCw',
        category: 'Output',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'CoilIn', tooltip: '접점 신호 입력', isReadOnly: true }, // 코일 동작 조건
          ]
        },
      },
      {
        name: 'Pulse Coil',
        type: '펄스 출력',
        operation: 'Rung true 시 지정 Scan 수만 true',
        description: '순간 출력',
        icon: Zap,
        iconName: 'Zap',
        category: 'Output',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'CoilIn', tooltip: '접점 신호 입력', isReadOnly: true }, // 코일 동작 조건
          ]
        },
      }
    ]
  },
  {
    title: 'Timers (타이머)',
    items: [
      {
        name: 'TON (On Delay)',
        type: '타이머',
        operation: 'IN true 유지 시간 ≥ PT → Q true',
        description: 'On Delay 타이머. 설정 시간 후 출력',
        icon: Timer,
        iconName: 'Timer',
        category: 'Timer',
        shape: 'timer-node',
        ports: {
          items: [
            { group: 'in', id: 'Start', tooltip: '타이머 시작 입력', isReadOnly: true },
            { group: 'in', id: 'Reset', tooltip: '타이머 리셋 입력', isReadOnly: true },
            { group: 'out', id: 'Done', tooltip: '타이머 완료 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'TOF (Off Delay)',
        type: '타이머',
        operation: 'IN false 후 PT 경과 → Q false',
        description: 'Off Delay 타이머. 입력 차단 후 지연 출력',
        icon: Timer,
        iconName: 'Timer',
        category: 'Timer',
        shape: 'timer-node',
        ports: {
          items: [
            { group: 'in', id: 'Start', tooltip: '타이머 시작 입력', isReadOnly: true },
            { group: 'in', id: 'Reset', tooltip: '타이머 리셋 입력', isReadOnly: true },
            { group: 'out', id: 'Done', tooltip: '타이머 완료 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'TP (Pulse Timer)',
        type: '펄스 타이머',
        operation: '상승엣지 입력 시 PT 시간 동안 Q true',
        description: '일정 시간 동안 펄스 출력',
        icon: Zap,
        iconName: 'Zap',
        category: 'Timer',
        shape: 'timer-node',
        ports: {
          items: [
            { group: 'in', id: 'Start', tooltip: '타이머 시작 입력', isReadOnly: true },
            { group: 'in', id: 'Reset', tooltip: '타이머 리셋 입력', isReadOnly: true },
            { group: 'out', id: 'Done', tooltip: '타이머 완료 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      }
    ]
  },
  {
    title: 'Counters (카운터)',
    items: [
      {
        name: 'CTU (Up Counter)',
        type: '카운터',
        operation: '상승엣지마다 CV++, CV ≥ PV → Q',
        description: '상향 카운터',
        icon: Activity,
        iconName: 'Activity',
        category: 'Counter',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'Start', tooltip: '카운터 시작 입력', isReadOnly: true },
            { group: 'in', id: 'Reset', tooltip: '카운터 리셋 입력', isReadOnly: true },
            { group: 'out', id: 'Done', tooltip: '카운터 완료 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'CTD (Down Counter)',
        type: '카운터',
        operation: '상승엣지마다 CV--',
        description: '하향 카운터',
        icon: Activity,
        iconName: 'Activity',
        category: 'Counter',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'Start', tooltip: '카운터 시작 입력', isReadOnly: true },
            { group: 'in', id: 'Reset', tooltip: '카운터 리셋 입력', isReadOnly: true },
            { group: 'out', id: 'Done', tooltip: '카운터 완료 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'CTUD',
        type: '복합 카운터',
        operation: '상승엣지마다 CU(증가) 또는 CD(감소)',
        description: '증감 가능 카운터',
        icon: Activity,
        iconName: 'Activity',
        category: 'Counter',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'Start', tooltip: '카운터 시작 입력', isReadOnly: true },
            { group: 'in', id: 'Reset', tooltip: '카운터 리셋 입력', isReadOnly: true },
            { group: 'out', id: 'Done', tooltip: '카운터 완료 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      }
    ]
  },
  {
    title: 'Data Processing (데이터 처리)',
    items: [
      {
        name: 'MOVE',
        type: '데이터 이동',
        operation: 'IN → OUT 값 복사',
        description: '데이터 전송 및 복사',
        icon: ArrowRightLeft,
        iconName: 'ArrowRightLeft',
        category: 'Data',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'Source', tooltip: '복사할 값 입력', isReadOnly: true },
            { group: 'out', id: 'Destination', tooltip: '복사된 값 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'ADD',
        type: '산술',
        operation: 'A + B → OUT',
        description: '덧셈 연산',
        icon: Plus,
        iconName: 'Plus',
        category: 'Data',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '연산 결과 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'SUB',
        type: '산술',
        operation: 'A - B → OUT',
        description: '뺄셈 연산',
        icon: Minus,
        iconName: 'Minus',
        category: 'Data',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '연산 결과 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'MUL',
        type: '산술',
        operation: 'A × B → OUT',
        description: '곱셈 연산',
        icon: X,
        iconName: 'X',
        category: 'Data',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '연산 결과 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'DIV',
        type: '산술',
        operation: 'A ÷ B → OUT',
        description: '나눗셈 연산',
        icon: Divide,
        iconName: 'Divide',
        category: 'Data',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '연산 결과 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'MOD',
        type: '산술',
        operation: 'A % B → OUT',
        description: '나머지 연산',
        icon: Percent,
        iconName: 'Percent',
        category: 'Data',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '연산 결과 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      },
      {
        name: 'Comparator Block',
        type: '비교 블록',
        operation: 'A, B 비교 → EQ, GT, LT 출력',
        description: '비교 결과 다중 출력 블록',
        icon: Columns,
        iconName: 'Columns',
        category: 'Data',
        shape: 'logic-node',
        ports: {
          items: [
            { group: 'in', id: 'A', tooltip: 'A 입력', isReadOnly: true },
            { group: 'in', id: 'B', tooltip: 'B 입력', isReadOnly: true },
            { group: 'out', id: 'Out', tooltip: '연산 결과 출력', isReadOnly: true },
            { group: 'error', id: 'Error', tooltip: '오류 출력', isReadOnly: true },
          ]
        },
      }
    ]
  },
  {
    title: 'Custom Blocks',
    items: []
  }
];
