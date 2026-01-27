# Sisyphus Work Plans

## Active Plan

### market-indicators-visualization.md

**Description**: 7개의 시장 지표 및 고급 차트 기능 추가
- 5개 신규 시장 지표 (금, BTC, 10Y 국채, 나스닥, S&P500)
- 3개 고급 차트 (캔들스틱, 상관관계 히트맵, 멀티라인 오버레이)

**Tasks**: 10개 TODO 항목
**Estimated Commits**: 9개

---

## How to Execute

### Option 1: Interactive Mode (Recommended)
```
/start-work
```
이 명령어는 플랜을 로드하고 순차적으로 작업을 실행합니다.

### Option 2: Manual Execution
플랜 파일(`.sisyphus/plans/market-indicators-visualization.md`)을 읽고 각 TODO를 순서대로 수동으로 실행합니다.

### Option 3: Claude에게 직접 요청
```
.sisyphus/plans/market-indicators-visualization.md 플랜을 실행해줘
```

---

## Plan Files

| File | Status | Description |
|------|--------|-------------|
| `market-indicators-visualization.md` | Ready | 시장 지표 + 고급 차트 |

---

## Execution Notes

1. **순서 중요**: Task 1(타입 정의)부터 순서대로 실행
2. **병렬 가능**: Task 4 & 6은 독립적으로 병렬 실행 가능
3. **테스트**: 각 Task 완료 후 `npm run test:run` 확인
4. **빌드**: 최종 `npm run build` 성공 필수

---

## Quick Reference

```bash
# 테스트 실행
npm run test:run

# 빌드
npm run build

# 개발 서버
npm run dev

# Vercel 배포
npx vercel --prod
```
