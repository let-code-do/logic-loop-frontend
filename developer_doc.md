# LogicLoop 개발자 설계 문서 (v1.1)

## 1. 프로젝트 개요
- **이름:** LogicLoop  
- **목적:** PLC 스타일 Scan 기반 로직 시뮬레이션 엔진 개발  
- **주요 기능:**  
  1. Rung 단위 로직 평가  
  2. 입력/출력 래치 및 트리거 반영  
  3. Scan 루프 시뮬레이션  
  4. 외부 입력 반영과 내부 상태 변화 분리  
  5. 로직 블록 및 Scan 흐름 시각화  
  6. React Flow를 통한 논리 블록 및 Timer/특수 코일 시각화
  7. 외부 장치/프로그램과 통신(Read/Write)
  8. 고정 스캔 타임(Fixed Scan)
  9. 델타 타임 기반 타이머 정밀도 확보
  10.외부 요청 큐 제어 및 시각화 최적화

## 2. 시스템 아키텍처
```
외부 장치/프로그램 ↔ External Latch (FIFO Queue) ↔ Input Latch → ScanLoopManager → RungEvaluator → LogicEvaluator (Timer/Logic) → IOStateManager → Output Latch ↔ External Latch (Result/Notification)
                                        |
                                        v
                            Diff-based Sync ↔ React Flow Visualization
```
- **External Latch:** 외부 장치에서 read/write 요청 처리, `returnCode` 포함
  - read 요청 → 요청한 디바이스 값 리스트 반환 + `returnCode`
  - write 요청 → 요청 정상 처리 여부 `returnCode`
  - 동시성: read/write 요청이 동시에 들어오면 Input Latch에서 **큐로 관리**
  - Timeout: 요청 처리 지연 시 `returnCode` 오류 반환 가능
  - 프로토콜별 차이: WebSocket/TCP/IP/REST 등은 요청 payload로 처리 가능
- **Input Latch:** External Latch에서 들어온 write 요청 기록 → 내부 Scan 루프에서 읽기용
- **Output Latch:** Scan 종료 후 Internal IOState 값 반영, 외부 read/write 요청 처리 상태를 External Latch에 전달
- **React Flow Visualization:**
  - 단순 논리 로직 블록(Contact, Coil, Bit) 배치 및 연결 구성
  - **Timer/특수 코일 관리**
    - React Flow에서 Timer/특수 코일 생성 → 화면 시각화 및 설정
    - **실제 실행은 외부에서 작동하지 않고 LogicEvaluator 내부에서 Scan 루프 안에서 수행**
    - Interval, Action, Condition 등 정의 후 LogicEvaluator가 주기마다 상태 확인 및 실행
- **External Latch & FIFO Queue:** 
  - 외부의 모든 write 요청을 큐(Queue)에 수집.
  - 한 스캔 주기에 **최대 10개**의 요청을 꺼내 반영하여 엔진 부하 관리.
  - 동일 주소에 대한 중복 요청은 **Last-Write-Wins** 원칙 적용.
- **Delta Time 기반 실행:** 스캔 주기가 변동되더라도 실제 흐른 시간(`dt`)을 계산하여 타이머 정밀도 유지.
- **Diff-based Visualization:** 매 스캔 후 전체 상태가 아닌 **변경된 메모리 값(Diff)**만 추출하여 React Flow로 전송.

## 3. 주요 클래스 설계

### ScanLoopManager (고정 스캔 타임 및 델타 타임)
```ts
class ScanLoopManager {
  fixedScanTime: number = 20; // ms
  lastTimestamp: number = performance.now();

  runLoop() {
    const now = performance.now();
    const deltaTime = now - this.lastTimestamp;
    this.lastTimestamp = now;

    this.executeScan(deltaTime);

    // 고정 스캔 타임 유지 로직 (Overtime 모니터링 포함)
    const processTime = performance.now() - now;
    const delay = Math.max(0, this.fixedScanTime - processTime);
    setTimeout(() => this.runLoop(), delay);
  }

  executeScan(dt: number) {
    ioState.updateInputLatch(externalIO.getQueue(10)); // 최대 10개 처리
    for (const rung of rungs) rung.evaluate(ioState);
    LogicEvaluator.evaluate(ioState, dt); // 타이머/특수 로직에 dt 전달
    ioState.updateOutputLatch(externalIO);
    
    const diff = ioState.getChanges();
    VisualizationBridge.sendDiff(diff); // 변경된 부분만 전송
  }
}
```

### RungEvaluator
```ts
class Rung {
  contacts: Contact[];
  coil: Coil;

  evaluate(ioState: IOState) {
    const result = this.contacts.reduce((acc, contact) => acc && contact.read(ioState), true);
    this.coil.write(result, ioState);
  }
}
```

### IOStateManager
```ts
class IOState {
  inputs: Record<string, DeviceMemory> = {};
  outputs: Record<string, DeviceMemory> = {};
  internal: Record<string, DeviceMemory> = {};

  updateInputLatch(inputLatch: Record<string, DeviceMemory>) {
    for (const key in inputLatch) {
      this.inputs[key] = inputLatch[key];
    }
  }

  updateOutputLatch(outputLatch: Record<string, DeviceMemory>) {
    for (const key in outputLatch) {
      outputLatch[key] = this.outputs[key];
    }
  }
}
```

### DeviceMemory
```ts
class DeviceMemory {
  owner: string;
  station: string;
  group: string;
  name: string;
  area: 'B' | 'W';
  address: number;
  length: number; // Bit 수 또는 Word 수
  data: Uint8Array;
  compressedBits?: boolean; // 1바이트에 8비트 압축 옵션

  constructor(owner: string, station: string, group: string, name: string, area: 'B'|'W', address: number, length: number, compressedBits = false) {
    this.owner = owner;
    this.station = station;
    this.group = group;
    this.name = name;
    this.area = area;
    this.address = address;
    this.length = length;
    this.compressedBits = compressedBits;

    if (area === 'B') {
      this.data = new Uint8Array(length <= 1 ? 1 : (compressedBits ? Math.ceil(length/8) : length));
    } else {
      this.data = new Uint8Array(length*2);
    }
  }

  readBit(index: number): number { return this.data[index]; }
  writeBit(index: number, value: number) { this.data[index] = value; }
  readWord(index: number): number { const high = this.data[index*2]; const low = this.data[index*2+1]; return (high<<8)|low; }
  writeWord(index: number, value: number) { this.data[index*2]=(value>>8)&0xFF; this.data[index*2+1]=value&0xFF; }
}
```

### LogicEvaluator (타이머 상태 자동 관리)
- 타이머/특수 코일 생성 시 전용 구조체 메모리 자동 할당.
- **Timer Structure:** 
  - `EN` (Enable), `TT` (Timing), `DN` (Done) - 각 1bit
  - `ACC` (Accumulated), `PRE` (Preset) - 각 1word (16bit)
```ts
class LogicEvaluator {
  static evaluate(ioState: IOState, dt: number) {
    // React Flow 기반 Logic 노드/Edge 평가
    // Timer/특수 코일 처리: LogicEvaluator 내부에서 Scan 루프 안에서 주기적으로 실행
  }
}
```

### Logger
```ts
class Logger {
  logs: any[] = [];
  record(ioState: IOState, event?: string) {
    this.logs.push({ timestamp: Date.now(), state: JSON.parse(JSON.stringify(ioState)), event });
  }
}
```
- 이벤트 단위 로그 지원: Trigger 발생, Timer 실행, Coil 상태 변경 등 기록

### ExternalIO (통신 프로토콜별 응답 정책)
- **비동기(WebSocket):** 큐 진입 시 `Ack`(수신 확인), 스캔 반영 후 `Notification`(처리 완료) 전송.
- **동기(REST):** 요청을 큐에 담고, 해당 요청이 스캔에서 처리될 때까지 `Promise`를 대기시킨 후 응답 반환.
```ts
class ExternalIO {
  inputLatch: Record<string, DeviceMemory> = {};
  outputLatch: Record<string, DeviceMemory> = {};
  queue: any[] = [];
  timeoutMs: number = 1000;

  read(devices: string[]): { transactionId: string, returnCode: number, values?: Record<string, DeviceMemory>, errors?: string[] } {}
  write(devices: Record<string, DeviceMemory>): { transactionId: string, returnCode: number, errors?: string[] } {}
}
```
- 요청 큐로 동시성 처리  
- Timeout 지원  
- WebSocket/TCP/IP/REST 등 프로토콜별 payload 처리 가능

## 4. Logic JSON 스펙
- **Timer/Counter 정의:** `id`, `type(TON/TOF/RTO)`, `preset`, `address_mapping`
- **Validation:** 자동 할당된 내부 주소와 유저 정의 주소 간의 충돌 검증.
- 조건(`op: and/or/not`) 및 Device reference(`Owner/Station/Group/Name/Mode/Equals`) 정의
- Action 타입: `setRegisters`, `delay`, `customAction`
- Delay 단위: `ms`
- Validation 필요: Device 존재 여부, Type(B/W) 일치, Length 범위 검증
- 예시:
```json
{
  "name": "Logic_Example",
  "trigger": { ... },
  "actions": [ ... ]
}
```

## 5. 엔진 동작 시퀀스
1. **Scan 시작:** 현재 시간 측정 및 `deltaTime` 계산.
2. **Input Latch:** `ExternalIO` 큐에서 최대 10개 요청을 `IOState`에 반영.
3. **Logic 평가:** Rung 및 LogicEvaluator(타이머 포함) 순차 실행.
4. **Output Latch:** 변경된 값을 `ExternalIO` 응답 큐 및 REST 대기 객체에 전달.
5. **Diff 전송:** 이전 스캔 대비 바뀐 메모리 값만 추출하여 UI로 전송.
6. **Wait:** 남은 고정 스캔 시간만큼 대기 후 다음 사이클 시작.
```
Scan 시작 → IOState.updateInputLatch(externalIO.inputLatch)
각 Rung 순차 평가 → Rung.evaluate()
Logic 처리 → LogicEvaluator.evaluate (React Flow Timer/특수 코일 포함)
Scan 종료 → IOState.updateOutputLatch(externalIO.outputLatch)
로그 기록 → Logger.record()
```

## 6. 기술 스택
- TypeScript / Node.js / React / React Flow / Jest / Mocha / Vite / Webpack / Git

## 7. LogicLoop 메모리 구조 및 최적화
- **자동 메모리 관리:** 타이머 등 특수 블록용 내부 메모리 자동 할당 및 관리.
- **Diff Map:** `Map<string, Uint8Array>` 형태로 변경된 주소와 데이터만 관리하여 전송 비용 최소화.
- **React Flow Sync:** `React.memo`를 사용하여 프론트엔드에서 변경된 노드만 리렌더링.
- 주소 기반 접근 + Owner/Station/Group/Name 조회 가능 HashMap/Dictionary
- Trigger / DataField / 특수 Device Memory 타입 구분
- 모든 디바이스 값 byte[] 관리, B/W 타입 구분, compressedBits 옵션 가능
- React Flow Timer/특수 코일은 LogicEvaluator 내부에서 Scan 루프 안에서 관리

## 8. 테스트/시뮬레이션
- 단위 테스트: DeviceMemory, Rung, Coil, Contact
- 통합 테스트: ScanLoop + LogicEvaluator + ExternalIO
- 시뮬레이션 환경: WebSocket/TCP 서버 Mockup + REST API 요청 시나리오
- 다양한 동시성, Timeout, Batch 처리 케이스 검증

## 9. 향후 확장 계획
- 기본 로직 및 타이머/코일 구현 완료 후 React Flow 시각화 안정성 검토.
- 시각화 피드백에 따라 카운터(Counter), 비교(Compare), 산술 연산(Math) 블록 순차 추가.


### 업데이트 요약
1.  **스캔 주기:** 고정 스캔 타임 적용 및 델타 타임 기반 타이머 계산 로직 추가.
2.  **동시성:** 외부 요청 큐(FIFO) 도입 및 스캔당 최대 10개 처리 제한으로 안정성 확보.
3.  **통신 정책:** REST(대기 후 응답)와 비동기(수신/완료 분리) 정책 구체화.
4.  **시각화 최적화:** 전체 상태 전송 대신 Diff(변경분) 전송 방식으로 프론트엔드 성능 최적화.

