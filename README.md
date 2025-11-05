# RAPDAO Token Platform

> 🚀 **실제 블록체인 배포 가능!** ERC-20 스마트 컨트랙트로 진짜 암호화폐를 만들어보세요!

## 프로젝트 개요
- **이름**: RAPDAO Token Platform
- **목표**: 차세대 토큰 발행 및 관리 플랫폼
- **주요 기능**: 
  - 토큰 발행 (Minting)
  - 토큰 전송 (Transfer)
  - 계정 관리
  - 트랜잭션 내역 조회
  - **✨ NEW: 실제 블록체인 배포 (Sepolia/Mumbai 테스트넷)**

## 🌐 URLs
- **개발 서버**: https://3000-in1uq58h63mcoaphdbad0-5c13a017.sandbox.novita.ai
- **로컬**: http://localhost:3000

## ✨ 완료된 기능

### 1. 토큰 발행 (Mint)
- 새로운 지갑 주소에 토큰 발행
- 초기 잔액 설정 가능
- 중복 주소 검증

### 2. 토큰 전송 (Transfer)
- 계정 간 토큰 전송
- 잔액 부족 검증
- 자동 트랜잭션 해시 생성
- 수신자 계정 자동 생성

### 3. 계정 관리
- 전체 계정 목록 조회
- 개별 계정 잔액 조회
- 계정 생성 일시 추적

### 4. 트랜잭션 내역
- 전체 트랜잭션 조회
- 특정 주소별 트랜잭션 필터링
- 트랜잭션 상태 추적 (pending/confirmed)

## 🎨 디자인 특징
- **미래지향적 UI**: 글래스모피즘(Glassmorphism) 디자인
- **그라디언트 배경**: 보라색 계열의 현대적인 그라디언트
- **Space Grotesk 폰트**: 기술적이고 모던한 느낌
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **애니메이션 효과**: 호버, 펄스 애니메이션

## 📊 데이터 아키텍처

### 데이터 모델
1. **Token Info** (토큰 정보)
   - name: RAPDAO
   - symbol: RAP
   - total_supply: 1,000,000,000
   - decimals: 18

2. **Accounts** (계정)
   - id, address, balance, created_at

3. **Transactions** (트랜잭션)
   - id, from_address, to_address, amount, tx_hash, status, created_at

### 스토리지 서비스
- **Cloudflare D1**: SQLite 기반 글로벌 분산 데이터베이스
- **로컬 개발**: `.wrangler/state/v3/d1` 로컬 SQLite

### 데이터 플로우
```
사용자 입력 → API 엔드포인트 → D1 데이터베이스 → JSON 응답 → 프론트엔드 렌더링
```

## 📱 사용자 가이드

### 토큰 발행하기
1. "토큰 발행" 탭 선택
2. 지갑 주소 입력 (예: 0xABC123...)
3. 발행할 수량 입력 (예: 1000)
4. "토큰 발행하기" 버튼 클릭

### 토큰 전송하기
1. "전송" 탭 선택
2. 발신 주소 입력 (기존 계정 주소)
3. 수신 주소 입력
4. 전송할 수량 입력
5. "전송하기" 버튼 클릭

### 계정 확인하기
1. "계정" 탭 선택
2. 전체 계정 목록 및 잔액 확인
3. "새로고침" 버튼으로 최신 정보 갱신

### 트랜잭션 확인하기
1. "트랜잭션" 탭 선택
2. 전체 트랜잭션 내역 확인
3. 발신/수신 주소, 금액, 시간 정보 제공

## 🚀 배포

### 플랫폼
- **Cloudflare Pages**: 엣지 컴퓨팅 플랫폼
- **상태**: ✅ 로컬 개발 환경 활성화
- **Tech Stack**: Hono + TypeScript + TailwindCSS + Cloudflare D1

### 로컬 개발 환경 실행

```bash
# 1. 의존성 설치
npm install

# 2. 프로젝트 빌드
npm run build

# 3. D1 데이터베이스 마이그레이션
npm run db:migrate:local

# 4. 개발 서버 시작
pm2 start ecosystem.config.cjs

# 5. 서버 테스트
npm run test
# 또는
curl http://localhost:3000
```

### 유용한 명령어

```bash
# 포트 3000 정리
npm run clean-port

# D1 데이터베이스 초기화
npm run db:reset

# PM2 로그 확인
pm2 logs webapp --nostream

# PM2 서비스 재시작
pm2 restart webapp

# PM2 서비스 중지
pm2 stop webapp
```

## 🔧 API 엔드포인트

### 토큰 정보
- `GET /api/token/info` - 토큰 기본 정보 조회

### 계정 관리
- `POST /api/account/create` - 계정 생성 (토큰 발행)
  ```json
  { "address": "0x...", "amount": 1000 }
  ```
- `GET /api/account/:address` - 특정 계정 조회
- `GET /api/accounts` - 전체 계정 목록

### 전송
- `POST /api/transfer` - 토큰 전송
  ```json
  { "from": "0x...", "to": "0x...", "amount": 100 }
  ```

### 트랜잭션
- `GET /api/transactions` - 전체 트랜잭션 내역 (최근 100개)
- `GET /api/transactions/:address` - 특정 주소의 트랜잭션

## 🔗 실제 블록체인 토큰 배포

### 🎯 지금 바로 실제 블록체인에 토큰을 배포할 수 있습니다!

**📖 상세 가이드**: [BLOCKCHAIN-GUIDE.md](./BLOCKCHAIN-GUIDE.md) 파일을 참고하세요.

### 빠른 시작

```bash
# 1. 환경 변수 설정
cp .env.example .env
# .env 파일에 MetaMask 개인키 입력

# 2. Sepolia 테스트넷에 배포
npx hardhat run scripts/deploy.cjs --network sepolia

# 3. MetaMask에 토큰 추가
# 배포된 컨트랙트 주소를 MetaMask에 추가
```

### 스마트 컨트랙트 기능
- ✅ **ERC-20 표준 준수**: 모든 지갑/거래소 호환
- ✅ **토큰 발행 (Mint)**: 오직 소유자만 가능
- ✅ **토큰 소각 (Burn)**: 누구나 자신의 토큰 소각 가능
- ✅ **최대 공급량 제한**: 1,000,000,000 RAP
- ✅ **OpenZeppelin 라이브러리**: 검증된 보안

### 필요한 것
1. MetaMask 지갑
2. 테스트 ETH (무료 Faucet에서 받기)
3. 5분의 시간

**자세한 내용은 [BLOCKCHAIN-GUIDE.md](./BLOCKCHAIN-GUIDE.md)를 확인하세요!**

---

## 🔮 향후 개발 계획

### 추가 고급 기능
1. **Web3 프론트엔드 통합**
   - MetaMask 직접 연동
   - 실시간 블록체인 데이터
   - 트랜잭션 서명 UI

2. **고급 기능**
   - 토큰 소각(Burn) 기능
   - 스테이킹 시스템
   - 거버넌스 투표
   - NFT 통합

3. **보안 강화**
   - 서명 검증
   - 다중 서명 지갑
   - Rate limiting
   - CSRF 보호

4. **UX 개선**
   - QR 코드 지갑 주소
   - 트랜잭션 상태 알림
   - 차트 및 통계
   - 다국어 지원

### 권장 다음 단계
1. Cloudflare Pages 프로덕션 배포
2. 커스텀 도메인 연결
3. 환경 변수 설정 (API 키 등)
4. GitHub 저장소 연동
5. CI/CD 파이프라인 구축

## 📄 라이선스
MIT License

## 🤝 기여
이슈 및 풀 리퀘스트는 언제나 환영합니다!

---

**Last Updated**: 2025-11-05

Made with ❤️ using Hono, Cloudflare, and TailwindCSS
