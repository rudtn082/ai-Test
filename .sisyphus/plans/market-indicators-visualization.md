# Market Indicators & Advanced Visualization

## Context

### Original Request
KRW/USD 환율 앱에 7개의 새로운 기능 추가:
1. 금 시세 (XAU/USD) - 안전자산 지표
2. 비트코인 (BTC/USD) - 디지털 자산/변동성 지표
3. 미국 국채 10년물 금리 - 달러 강세/약세 선행지표
4. 나스닥/S&P500 - 미국 증시 지표
5. 캔들스틱 차트 - OHLC 시각화
6. 상관관계 히트맵 - 환율/유가/KOSPI/금 간 상관계수
7. 멀티라인 오버레이 차트 - 다중 지표 정규화 비교

### Interview Summary
**Key Discussions**:
- 전체 7개 기능 구현 선택
- Yahoo Finance API 기존 패턴 재사용 확정
- Recharts 라이브러리만 사용 (새 라이브러리 추가 금지)

**Research Findings**:
- Yahoo Finance OHLC 데이터: `data.chart.result[0].indicators.quote[0]`에 포함
- Recharts 캔들스틱: 공식 예제 존재 (BarChart + ErrorBar 조합)
- frankfurter.app: OHLC 미지원 → Yahoo Finance `USDKRW=X` 사용

### Metis Review
**Identified Gaps** (addressed):
- 캔들스틱 데이터 소스: Yahoo Finance `USDKRW=X` OHLC 사용
- 상관관계 계산 기간: 30일 (기존 히스토리와 동일)
- 실시간 업데이트: 없음 (마운트 시 1회 fetch)
- 지표 카드 레이아웃: 카테고리별 그룹핑 (원자재/주식/채권/암호화폐)

---

## Work Objectives

### Core Objective
환율 앱에 5개의 추가 시장 지표(금, BTC, 10Y, 나스닥, S&P500)와 3개의 고급 차트(캔들스틱, 상관관계 히트맵, 멀티라인 오버레이)를 추가하여 종합적인 시장 분석 대시보드 구축

### Concrete Deliverables
- `hooks/useMarketData.ts` 확장 (5개 신규 지표)
- `types.ts` 타입 정의 추가
- `components/MarketIndicators.tsx` UI 확장
- `components/CandlestickChart.tsx` 신규 컴포넌트
- `components/CorrelationHeatmap.tsx` 신규 컴포넌트
- `components/MultiLineOverlay.tsx` 신규 컴포넌트
- `utils/correlation.ts` 상관계수 계산 유틸리티
- `hooks/useOHLCData.ts` OHLC 데이터 훅

### Definition of Done
- [ ] `npm run build` 성공
- [ ] `npm run test:run` 모든 테스트 통과
- [ ] 7개 지표 카드 모두 표시 (로딩/에러/정상 상태)
- [ ] 캔들스틱 차트 OHLC 시각화 동작
- [ ] 상관관계 히트맵 4x4 매트릭스 표시
- [ ] 멀티라인 오버레이 지표 토글 동작

### Must Have
- 5개 신규 지표 데이터 페칭 및 표시
- 개별 지표 실패 시 다른 지표 정상 표시
- 캔들스틱 양봉/음봉 색상 구분
- 상관관계 -1~+1 색상 그라데이션
- 멀티라인 차트 지표 토글 기능
- 모든 새 차트 lazy loading

### Must NOT Have (Guardrails)
- 새로운 차트 라이브러리 추가 (Recharts만 사용)
- 새로운 CORS 프록시 추가 (기존 3개 사용)
- 실시간 WebSocket 연결
- 30일 초과 데이터 범위
- 사용자 설정 저장 기능 (localStorage 등)
- 지표별 개별 페이지/라우팅
- 줌/팬 인터랙션 (기본 툴팁만)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (Vitest + Testing Library)
- **User wants tests**: TDD for hooks, basic render tests for components
- **Framework**: Vitest

### Test Coverage Plan
- `useMarketData.ts` 확장 테스트 (신규 지표 fetch 성공/실패)
- `useOHLCData.ts` 훅 테스트
- `correlation.ts` 유틸리티 단위 테스트
- 새 컴포넌트 기본 렌더링 테스트

---

## Task Flow

```
[1] Types → [2] useMarketData 확장 → [3] MarketIndicators UI
                                           ↓
[4] useOHLCData → [5] CandlestickChart
                                           ↓
[6] Correlation Util → [7] CorrelationHeatmap
                                           ↓
                      [8] MultiLineOverlay
                                           ↓
                      [9] App.tsx Integration
                                           ↓
                      [10] Final Testing & Verification
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 4, 6 | useOHLCData와 Correlation Util은 독립적 |
| B | 5, 7, 8 | 각 차트 컴포넌트는 의존성 완료 후 병렬 가능 |

| Task | Depends On | Reason |
|------|------------|--------|
| 2 | 1 | 타입 정의 필요 |
| 3 | 2 | 데이터 훅 필요 |
| 5 | 4 | OHLC 훅 필요 |
| 7 | 6 | 상관계수 계산 필요 |
| 9 | 3, 5, 7, 8 | 모든 컴포넌트 완료 필요 |
| 10 | 9 | 통합 완료 필요 |

---

## TODOs

- [ ] 1. 타입 정의 확장

  **What to do**:
  - `types.ts`에 `ExtendedMarketData` 인터페이스 추가
  - `OHLCData` 타입 정의 (date, open, high, low, close)
  - `CorrelationMatrix` 타입 정의
  - 개별 지표 타입 (`GoldData`, `BitcoinData`, `TreasuryData`, `NasdaqData`, `SP500Data`)

  **Must NOT do**:
  - 기존 `MarketData` 타입 삭제하지 않기 (하위 호환성)

  **Parallelizable**: NO (다른 작업의 기초)

  **References**:
  - `types.ts:1-52` - 기존 타입 정의 패턴
  - `hooks/useMarketData.ts:3-17` - 현재 MarketData 인터페이스

  **Acceptance Criteria**:
  - [ ] `npm run build` 타입 에러 없음
  - [ ] 새 타입들이 `types.ts`에 정의됨

  **Commit**: YES
  - Message: `feat(types): add market indicators and chart types`
  - Files: `types.ts`

---

- [ ] 2. useMarketData 훅 확장

  **What to do**:
  - `fetchYahooData` 함수 재사용하여 5개 신규 심볼 추가:
    - Gold: `GC=F`
    - Bitcoin: `BTC-USD`
    - 10Y Treasury: `^TNX`
    - Nasdaq: `^IXIC`
    - S&P500: `^GSPC`
  - `MarketData` 인터페이스 확장 (gold, bitcoin, treasury, nasdaq, sp500)
  - 병렬 fetch로 성능 최적화 (`Promise.all`)
  - 개별 지표 실패 시 null 처리 (전체 실패 방지)

  **Must NOT do**:
  - 새로운 CORS 프록시 추가
  - 기존 WTI/KOSPI 로직 변경

  **Parallelizable**: NO (Task 1 완료 필요)

  **References**:
  - `hooks/useMarketData.ts:44-72` - `fetchYahooData` 함수 (재사용)
  - `hooks/useMarketData.ts:88-91` - `Promise.all` 병렬 fetch 패턴
  - `hooks/useMarketData.ts:99-108` - 개별 결과 처리 패턴

  **Acceptance Criteria**:
  - [ ] 7개 지표 모두 fetch 시도
  - [ ] 개별 실패 시 해당 지표만 null, 나머지 정상
  - [ ] 테스트: `test/useMarketData.test.ts` 추가
  - [ ] `npm run test:run` 통과

  **Commit**: YES
  - Message: `feat(hooks): extend useMarketData with 5 new indicators`
  - Files: `hooks/useMarketData.ts`, `test/useMarketData.test.ts`

---

- [ ] 3. MarketIndicators UI 확장

  **What to do**:
  - 7개 지표를 카테고리별 그룹으로 표시:
    - 원자재: WTI, Gold
    - 주식: KOSPI, Nasdaq, S&P500
    - 채권: 10Y Treasury
    - 암호화폐: Bitcoin
  - `indicators` 배열 확장 (기존 패턴 따름)
  - 각 카테고리별 섹션 헤더 추가
  - 그리드 레이아웃 조정 (2열 → 카테고리별 유동)

  **Must NOT do**:
  - 미니 차트 추가
  - 개별 지표 상세 페이지 링크

  **Parallelizable**: NO (Task 2 완료 필요)

  **References**:
  - `components/MarketIndicators.tsx:60-81` - `indicators` 배열 패턴
  - `components/MarketIndicators.tsx:97-150` - 지표 카드 렌더링 패턴

  **Acceptance Criteria**:
  - [ ] 7개 지표 카드 모두 표시
  - [ ] 카테고리별 그룹핑 시각적 구분
  - [ ] 로딩/에러/정상 상태 모두 처리
  - [ ] 모바일 반응형 (1열) / 데스크톱 (2-3열)

  **Commit**: YES
  - Message: `feat(ui): extend MarketIndicators with categorized display`
  - Files: `components/MarketIndicators.tsx`

---

- [ ] 4. useOHLCData 훅 생성

  **What to do**:
  - `hooks/useOHLCData.ts` 신규 생성
  - Yahoo Finance에서 OHLC 데이터 fetch (`USDKRW=X`, range=30d)
  - 응답에서 `indicators.quote[0]` 추출 (open, high, low, close 배열)
  - timestamp와 매핑하여 `OHLCData[]` 반환
  - 기존 `fetchYahooData` 패턴 참조하되 OHLC 전용 로직

  **Must NOT do**:
  - 실시간 업데이트 (마운트 시 1회만)
  - 다른 심볼 OHLC (환율만)

  **Parallelizable**: YES (Task 6과 병렬)

  **References**:
  - `hooks/useMarketData.ts:44-72` - Yahoo Finance fetch 패턴
  - `hooks/useMarketData.ts:19-34` - Yahoo 응답 타입 (indicators.quote 포함)

  **Acceptance Criteria**:
  - [ ] `OHLCData[]` 반환 (date, open, high, low, close)
  - [ ] 30일 데이터 fetch
  - [ ] 에러 시 빈 배열 반환 (앱 크래시 방지)
  - [ ] 테스트: `test/useOHLCData.test.ts`

  **Commit**: YES
  - Message: `feat(hooks): add useOHLCData hook for candlestick data`
  - Files: `hooks/useOHLCData.ts`, `test/useOHLCData.test.ts`

---

- [ ] 5. CandlestickChart 컴포넌트 생성

  **What to do**:
  - `components/CandlestickChart.tsx` 신규 생성
  - Recharts `ComposedChart` + `Bar` + `ErrorBar` 조합으로 캔들스틱 구현
  - 양봉 (close > open): 빨간색
  - 음봉 (close < open): 파란색
  - 툴팁에 OHLC 4개 값 표시
  - 7D/30D 기간 토글 버튼

  **Must NOT do**:
  - 줌/팬 기능
  - 거래량 표시
  - 이동평균선

  **Parallelizable**: YES (Task 7, 8과 병렬, Task 4 완료 후)

  **References**:
  - Recharts 캔들스틱 예제: `https://recharts.org/en-US/examples/Candlestick`
  - `components/HistoryChart.tsx:54-120` - 차트 구조 및 스타일링 패턴
  - `components/HistoryChart.tsx:27-40` - CustomTooltip 패턴

  **Acceptance Criteria**:
  - [ ] OHLC 캔들스틱 시각화 (봉 + 꼬리)
  - [ ] 양봉/음봉 색상 구분
  - [ ] 툴팁에 날짜, O, H, L, C 표시
  - [ ] 7D/30D 토글 동작
  - [ ] lazy loading 적용

  **Commit**: YES
  - Message: `feat(chart): add CandlestickChart component`
  - Files: `components/CandlestickChart.tsx`

---

- [ ] 6. Correlation 유틸리티 생성

  **What to do**:
  - `utils/correlation.ts` 신규 생성
  - 피어슨 상관계수 계산 함수: `calculateCorrelation(x: number[], y: number[]): number`
  - 상관관계 매트릭스 생성 함수: `buildCorrelationMatrix(data: Record<string, number[]>): CorrelationMatrix`
  - 입력: { KRW: [...], WTI: [...], KOSPI: [...], Gold: [...] }
  - 출력: 4x4 매트릭스 (대각선 = 1.0)

  **Must NOT do**:
  - 롤링 상관관계 (단일 기간만)
  - p-value 계산 (단순 상관계수만)

  **Parallelizable**: YES (Task 4와 병렬)

  **References**:
  - 피어슨 상관계수 공식: `Σ((xi - x̄)(yi - ȳ)) / √(Σ(xi - x̄)² × Σ(yi - ȳ)²)`

  **Acceptance Criteria**:
  - [ ] `calculateCorrelation([1,2,3], [1,2,3])` = 1.0
  - [ ] `calculateCorrelation([1,2,3], [3,2,1])` = -1.0
  - [ ] 결측치 처리 (NaN 방지)
  - [ ] 단위 테스트: `test/correlation.test.ts`

  **Commit**: YES
  - Message: `feat(utils): add correlation calculation utilities`
  - Files: `utils/correlation.ts`, `test/correlation.test.ts`

---

- [ ] 7. CorrelationHeatmap 컴포넌트 생성

  **What to do**:
  - `components/CorrelationHeatmap.tsx` 신규 생성
  - 4x4 그리드 (환율, 유가, KOSPI, 금)
  - 색상 스케일: 파랑(-1) → 흰색(0) → 빨강(+1)
  - 각 셀에 상관계수 숫자 표시 (소수점 2자리)
  - 대각선 셀 (자기 상관) = 1.00
  - 행/열 레이블 표시

  **Must NOT do**:
  - 클릭 인터랙션
  - 시계열 상관관계
  - 5개 이상 지표

  **Parallelizable**: YES (Task 5, 8과 병렬, Task 6 완료 후)

  **References**:
  - `utils/correlation.ts` - 상관계수 계산 (Task 6)
  - 색상 스케일: Tailwind gradient 또는 inline style

  **Acceptance Criteria**:
  - [ ] 4x4 매트릭스 렌더링
  - [ ] -1 ~ +1 색상 그라데이션 적용
  - [ ] 숫자 표시 (예: 0.85, -0.32)
  - [ ] 행/열 레이블 (환율, 유가, KOSPI, 금)
  - [ ] lazy loading 적용

  **Commit**: YES
  - Message: `feat(chart): add CorrelationHeatmap component`
  - Files: `components/CorrelationHeatmap.tsx`

---

- [ ] 8. MultiLineOverlay 컴포넌트 생성

  **What to do**:
  - `components/MultiLineOverlay.tsx` 신규 생성
  - 4개 이상 지표를 정규화하여 단일 차트에 표시
  - 시작일 = 100 기준 (ComparisonChart 패턴 재사용)
  - 토글 버튼으로 지표 선택/해제
  - Recharts `LineChart` + 다중 `Line` 사용

  **Must NOT do**:
  - 다중 Y축
  - 지표별 개별 스케일
  - 실시간 업데이트

  **Parallelizable**: YES (Task 5, 7과 병렬)

  **References**:
  - `components/ComparisonChart.tsx:27-47` - `normalizeData` 함수 (재사용/참조)
  - `components/ComparisonChart.tsx:49-161` - 토글 버튼 및 LineChart 패턴

  **Acceptance Criteria**:
  - [ ] 환율, 유가, KOSPI, 금 4개 라인 표시
  - [ ] 시작일 = 100 정규화
  - [ ] 토글로 지표 선택/해제
  - [ ] 범례 표시
  - [ ] lazy loading 적용

  **Commit**: YES
  - Message: `feat(chart): add MultiLineOverlay component`
  - Files: `components/MultiLineOverlay.tsx`

---

- [ ] 9. App.tsx 통합

  **What to do**:
  - 새 컴포넌트들 lazy import 추가
  - 레이아웃에 새 차트 섹션 배치:
    - 캔들스틱: 환율 추이 차트 아래
    - 상관관계 히트맵: 통화 비교 아래
    - 멀티라인 오버레이: 상관관계 히트맵 옆
  - Suspense fallback 스켈레톤 추가
  - 새 훅 호출 및 데이터 전달

  **Must NOT do**:
  - 라우팅 추가
  - 페이지 분리

  **Parallelizable**: NO (모든 컴포넌트 완료 필요)

  **References**:
  - `App.tsx:12-15` - lazy loading 패턴
  - `App.tsx:191-201` - 차트 섹션 배치 패턴

  **Acceptance Criteria**:
  - [ ] 모든 새 컴포넌트 렌더링
  - [ ] lazy loading 적용 확인 (Network 탭)
  - [ ] 반응형 레이아웃 동작
  - [ ] 에러 바운더리 정상 동작

  **Commit**: YES
  - Message: `feat(app): integrate new market charts and indicators`
  - Files: `App.tsx`, `components/Skeleton.tsx` (필요시)

---

- [ ] 10. 최종 테스트 및 검증

  **What to do**:
  - 전체 테스트 실행 및 통과 확인
  - 빌드 성공 확인
  - 브라우저에서 수동 검증:
    - 7개 지표 카드 표시
    - 캔들스틱 차트 양봉/음봉
    - 히트맵 색상 및 숫자
    - 멀티라인 토글 동작
  - 다크모드 테스트
  - 모바일 반응형 테스트

  **Must NOT do**:
  - E2E 테스트 추가 (수동 검증만)

  **Parallelizable**: NO (통합 완료 필요)

  **References**:
  - `package.json` - 테스트/빌드 스크립트

  **Acceptance Criteria**:
  - [ ] `npm run test:run` 모든 테스트 통과
  - [ ] `npm run build` 성공
  - [ ] `npm run dev` 후 브라우저 검증 완료
  - [ ] 콘솔 에러 없음

  **Commit**: NO (검증만)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(types): add market indicators and chart types` | types.ts | npm run build |
| 2 | `feat(hooks): extend useMarketData with 5 new indicators` | hooks/useMarketData.ts, test/useMarketData.test.ts | npm run test:run |
| 3 | `feat(ui): extend MarketIndicators with categorized display` | components/MarketIndicators.tsx | npm run build |
| 4 | `feat(hooks): add useOHLCData hook for candlestick data` | hooks/useOHLCData.ts, test/useOHLCData.test.ts | npm run test:run |
| 5 | `feat(chart): add CandlestickChart component` | components/CandlestickChart.tsx | npm run build |
| 6 | `feat(utils): add correlation calculation utilities` | utils/correlation.ts, test/correlation.test.ts | npm run test:run |
| 7 | `feat(chart): add CorrelationHeatmap component` | components/CorrelationHeatmap.tsx | npm run build |
| 8 | `feat(chart): add MultiLineOverlay component` | components/MultiLineOverlay.tsx | npm run build |
| 9 | `feat(app): integrate new market charts and indicators` | App.tsx | npm run build |

---

## Success Criteria

### Verification Commands
```bash
npm run test:run  # Expected: All tests pass
npm run build     # Expected: Build successful, no errors
npm run dev       # Expected: App runs on localhost:3000
```

### Final Checklist
- [ ] 7개 시장 지표 카드 표시 (WTI, KOSPI, Gold, BTC, 10Y, Nasdaq, S&P500)
- [ ] 캔들스틱 차트 OHLC 시각화 (양봉 빨강, 음봉 파랑)
- [ ] 상관관계 히트맵 4x4 매트릭스 (색상 + 숫자)
- [ ] 멀티라인 오버레이 지표 토글 동작
- [ ] 모든 새 컴포넌트 lazy loading 적용
- [ ] 다크모드 지원
- [ ] 모바일 반응형
- [ ] 개별 API 실패 시 다른 기능 정상 동작
