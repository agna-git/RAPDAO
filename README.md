# 🚀 RAPDAO Token Platform

> **실제 블록체인에 배포된 ERC-20 토큰!** 우주 테마의 멋진 웹 인터페이스로 토큰을 관리하세요!

![Network](https://img.shields.io/badge/Network-Sepolia-blue)
![Token](https://img.shields.io/badge/Token-RAP-green)
![Supply](https://img.shields.io/badge/Supply-10M-yellow)
![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-purple)

---

## 🌟 프로젝트 개요

**RAPDAO**는 실제 Ethereum Sepolia 테스트넷에 배포된 ERC-20 토큰입니다. 우주를 테마로 한 멋진 웹 인터페이스를 통해 토큰을 쉽게 관리할 수 있습니다.

### ✨ 주요 기능

- 🪙 **실제 블록체인 토큰** - Sepolia 테스트넷에 배포
- 🎨 **우주 테마 UI** - 별, 로켓, 행성 애니메이션
- 🔗 **MetaMask 연동** - 원클릭 지갑 연결
- 💸 **토큰 전송** - 친구에게 RAP 전송
- 📊 **실시간 잔액** - 블록체인에서 직접 조회
- 🔄 **자동 네트워크 전환** - Sepolia로 자동 전환

---

## 📊 토큰 정보

| 항목 | 값 |
|------|-----|
| **이름** | RAPDAO Token |
| **심볼** | RAP |
| **총 공급량** | 10,000,000 RAP |
| **Decimals** | 18 |
| **네트워크** | Sepolia Testnet |
| **컨트랙트 주소** | `0x90609291dE2433dFe1E4e553c8a1A68f94d8ab7d` |

### 🔍 Etherscan

**컨트랙트 확인**: https://sepolia.etherscan.io/address/0x90609291dE2433dFe1E4e553c8a1A68f94d8ab7d

---

## 🌐 웹사이트

**Live Demo**: https://3000-in1uq58h63mcoaphdbad0-5c13a017.sandbox.novita.ai

### 🎮 사용 방법

1. **웹사이트 접속**
2. **"Connect Wallet" 클릭**
3. MetaMask 자동 연결 (Sepolia로 자동 전환)
4. 잔액 확인 및 토큰 전송!

---

## 🛠️ 기술 스택

### Backend
- **Hono** - 경량 웹 프레임워크
- **TypeScript** - 타입 안정성
- **Cloudflare Pages** - 엣지 배포

### Blockchain
- **Solidity 0.8.20** - 스마트 컨트랙트
- **OpenZeppelin** - 보안 라이브러리
- **Hardhat** - 개발 환경
- **ethers.js v6** - Web3 연동

### Frontend
- **TailwindCSS** - 스타일링
- **Orbitron 폰트** - 우주 느낌
- **애니메이션** - 별, 로켓, 행성

---

## 🚀 로컬 개발 환경 설정

### 1️⃣ 저장소 클론

\`\`\`bash
git clone https://github.com/agna-git/RAPDAO.git
cd RAPDAO
\`\`\`

### 2️⃣ 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3️⃣ 환경 변수 설정

\`\`\`bash
cp .env.example .env
\`\`\`

\`.env\` 파일 편집:
\`\`\`bash
PRIVATE_KEY=0x여기에_개인키
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
\`\`\`

### 4️⃣ 프로젝트 빌드

\`\`\`bash
npm run build
\`\`\`

### 5️⃣ 개발 서버 실행

\`\`\`bash
npm run dev:sandbox
# 또는
pm2 start ecosystem.config.cjs
\`\`\`

### 6️⃣ 브라우저에서 확인

http://localhost:3000

---

## 🔐 블록체인 배포

### 스마트 컨트랙트 컴파일

\`\`\`bash
npm run blockchain:compile
\`\`\`

### Sepolia 테스트넷 배포

\`\`\`bash
npm run blockchain:deploy:sepolia
\`\`\`

### 컨트랙트 검증 (선택)

\`\`\`bash
npm run blockchain:verify
\`\`\`

---

## 📁 프로젝트 구조

\`\`\`
RAPDAO/
├── src/
│   └── index.tsx          # 메인 애플리케이션
├── contracts/
│   └── RAPDAOToken.sol    # ERC-20 스마트 컨트랙트
├── scripts/
│   ├── deploy.cjs         # 배포 스크립트
│   └── verify.cjs         # 검증 스크립트
├── migrations/
│   └── 0001_initial_schema.sql  # D1 마이그레이션
├── public/
│   └── static/            # 정적 파일
├── hardhat.config.cjs     # Hardhat 설정
├── wrangler.jsonc         # Cloudflare 설정
├── ecosystem.config.cjs   # PM2 설정
├── package.json           # NPM 설정
├── deployment-info.json   # 배포 정보
├── BLOCKCHAIN-GUIDE.md    # 블록체인 상세 가이드
└── DEPLOY-NOW.md          # 배포 가이드
\`\`\`

---

## 📜 사용 가능한 명령어

### 개발
\`\`\`bash
npm run dev              # Vite 개발 서버
npm run dev:sandbox      # Wrangler 개발 서버
npm run build            # 프로젝트 빌드
npm run preview          # 빌드 미리보기
\`\`\`

### 블록체인
\`\`\`bash
npm run blockchain:compile           # 컨트랙트 컴파일
npm run blockchain:deploy:sepolia    # Sepolia 배포
npm run blockchain:deploy:mumbai     # Mumbai 배포
npm run blockchain:verify            # 컨트랙트 검증
npm run blockchain:console           # Hardhat 콘솔
\`\`\`

### 데이터베이스
\`\`\`bash
npm run db:migrate:local   # 로컬 마이그레이션
npm run db:migrate:prod    # 프로덕션 마이그레이션
npm run db:reset           # DB 초기화
\`\`\`

### 유틸리티
\`\`\`bash
npm run clean-port         # 포트 3000 정리
npm run test               # 서버 테스트
\`\`\`

---

## 🎨 디자인 특징

### 우주 테마
- ⭐ **200개의 반짝이는 별** - 무작위 위치와 타이밍
- 🚀 **날아다니는 로켓** - 대각선 비행 애니메이션
- 🪐 **떠다니는 행성** - 부드러운 float 효과
- 💚 **네온 글로우** - 사이버펑크 스타일
- 🎯 **인터랙티브 카드** - 호버시 확대 효과

### 색상 팔레트
- **배경**: `#0a0e27` (딥 스페이스)
- **메인**: `#00ff88` (네온 그린)
- **보조**: `#00ccff` (사이버 블루)
- **강조**: 그라디언트 (보라-핑크)

---

## 🔒 보안 주의사항

⚠️ **중요**: 

1. **개인키 보호**
   - `.env` 파일을 절대 공유하지 마세요
   - GitHub에 업로드하지 마세요
   - 테스트넷 전용 지갑을 사용하세요

2. **테스트넷 사용**
   - 이 프로젝트는 Sepolia 테스트넷용입니다
   - 실제 ETH를 사용하지 마세요
   - 메인넷 배포는 보안 감사 후 진행하세요

3. **스마트 컨트랙트**
   - OpenZeppelin 검증된 코드 사용
   - 추가 기능 구현시 감사 필요

---

## 📚 추가 문서

- **[BLOCKCHAIN-GUIDE.md](./BLOCKCHAIN-GUIDE.md)** - 블록체인 배포 상세 가이드
- **[DEPLOY-NOW.md](./DEPLOY-NOW.md)** - 즉시 배포 가이드
- **[.env.example](./.env.example)** - 환경 변수 템플릿

---

## 🌟 주요 기능 상세

### MetaMask 연동
- 자동 네트워크 감지
- Sepolia로 원클릭 전환
- 네트워크 자동 추가
- 계정 변경 감지

### 토큰 관리
- 실시간 잔액 조회
- 토큰 전송 기능
- 트랜잭션 추적
- Etherscan 연동

### UI/UX
- 반응형 디자인
- 다크 모드 (우주 테마)
- 부드러운 애니메이션
- 직관적인 인터페이스

---

## 🐛 문제 해결

### MetaMask 연결 안됨
→ MetaMask 설치 확인 및 브라우저 새로고침

### 네트워크 오류
→ 자동으로 Sepolia로 전환됩니다. "승인" 클릭

### 잔액이 0으로 표시
→ 올바른 계정과 네트워크 확인

### 전송 실패
→ 가스비용 테스트 ETH 필요 (Faucet에서 받기)

---

## 🎯 향후 계획

- [ ] 메인넷 배포 (보안 감사 후)
- [ ] 스테이킹 기능
- [ ] DAO 거버넌스
- [ ] NFT 통합
- [ ] 모바일 앱
- [ ] 다국어 지원

---

## 🤝 기여하기

Pull Request를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

---

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

---

## 👨‍💻 개발자

**RAPDAO Team**

- GitHub: [@agna-git](https://github.com/agna-git)
- 프로젝트: [RAPDAO](https://github.com/agna-git/RAPDAO)

---

## 🙏 감사의 말

- **OpenZeppelin** - 보안 스마트 컨트랙트 라이브러리
- **Hono** - 빠르고 가벼운 웹 프레임워크
- **Cloudflare** - 엣지 컴퓨팅 플랫폼
- **Ethereum** - 블록체인 인프라

---

## 📞 지원

문제가 있으시면 [Issues](https://github.com/agna-git/RAPDAO/issues)에 등록해주세요!

---

**Made with 💚 in 2025**

🚀 **TO THE MOON AND BEYOND!** 🌙✨
