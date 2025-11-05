# 🔐 RAPDAO Token - 블록체인 배포 가이드

## 📋 목차
1. [사전 준비](#사전-준비)
2. [테스트넷 배포 (권장)](#테스트넷-배포)
3. [MetaMask에 토큰 추가](#metamask에-토큰-추가)
4. [토큰 사용하기](#토큰-사용하기)
5. [문제 해결](#문제-해결)

---

## 🎯 사전 준비

### 1. MetaMask 지갑 설치
1. [MetaMask](https://metamask.io/) 설치 (Chrome/Firefox/Edge 확장 프로그램)
2. 새 지갑 생성 또는 기존 지갑 복구
3. **복구 문구(Seed Phrase)를 안전하게 보관하세요!**

### 2. 테스트넷 추가 및 테스트 ETH 받기

#### Sepolia 테스트넷 (권장)

**MetaMask에 Sepolia 추가:**
1. MetaMask 열기
2. 네트워크 선택 → "네트워크 추가" → "네트워크를 수동으로 추가"
3. 정보 입력:
   - **네트워크 이름**: Sepolia
   - **RPC URL**: https://rpc.sepolia.org
   - **체인 ID**: 11155111
   - **통화 기호**: ETH
   - **블록 탐색기**: https://sepolia.etherscan.io

**무료 테스트 ETH 받기 (Faucet):**
- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Sepolia Faucet 2](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Sepolia Faucet 3](https://faucet.quicknode.com/ethereum/sepolia)

각 사이트에서 MetaMask 주소를 입력하면 0.1-0.5 ETH를 받을 수 있습니다.

---

## 🚀 테스트넷 배포

### Step 1: 환경 변수 설정

1. `.env` 파일 생성:
```bash
cp .env.example .env
```

2. `.env` 파일 편집:
```bash
# MetaMask에서 개인키 내보내기:
# MetaMask → 계정 상세정보 → 개인 키 내보내기
PRIVATE_KEY=0x여기에_개인키_붙여넣기

# RPC URL (기본값 사용 가능)
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

⚠️ **경고**: 개인키를 절대 공유하거나 GitHub에 업로드하지 마세요!

### Step 2: 컨트랙트 배포

```bash
# Sepolia 테스트넷에 배포
npx hardhat run scripts/deploy.cjs --network sepolia
```

배포가 완료되면 다음 정보가 표시됩니다:
```
✅ 배포 완료!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 컨트랙트 주소: 0x1234...abcd
🏷️  토큰 이름: RAPDAO Token
🔖 토큰 심볼: RAP
📊 초기 공급량: 100000000 RAP
📈 최대 공급량: 1000000000 RAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Sepolia Etherscan:
   https://sepolia.etherscan.io/address/0x1234...abcd
```

**컨트랙트 주소를 복사하여 안전하게 보관하세요!**

### Step 3: 컨트랙트 검증 (선택사항)

Etherscan에서 소스 코드를 공개하려면:

1. [Etherscan API 키 발급](https://etherscan.io/myapikey)
2. `.env`에 추가:
```bash
ETHERSCAN_API_KEY=your_api_key_here
```

3. 검증 실행:
```bash
npx hardhat run scripts/verify.cjs --network sepolia
```

---

## 💰 MetaMask에 토큰 추가

### 방법 1: 수동으로 추가

1. MetaMask 열기
2. "토큰" 탭 → "토큰 가져오기"
3. 정보 입력:
   - **토큰 컨트랙트 주소**: 배포된 컨트랙트 주소 입력
   - **토큰 기호**: RAP (자동 입력됨)
   - **토큰 소수**: 18 (자동 입력됨)
4. "사용자 지정 토큰 추가" 클릭

### 방법 2: Etherscan에서 추가

1. Etherscan 링크 접속
2. "More" → "Add token to MetaMask" 클릭
3. MetaMask 팝업에서 "토큰 추가" 확인

---

## 🎮 토큰 사용하기

### 토큰 전송 (Transfer)

#### MetaMask로 전송:
1. MetaMask 열기
2. RAP 토큰 선택
3. "보내기" 클릭
4. 받을 주소와 수량 입력
5. 가스비 확인 후 전송

#### 예상 가스비:
- Sepolia: 무료 (테스트 ETH 사용)
- 일반 전송: ~50,000 gas (~$1-3 in mainnet)

### 토큰 발행 (Mint) - 오직 소유자만 가능

Hardhat 콘솔 사용:
```bash
npx hardhat console --network sepolia
```

```javascript
const RAPDAOToken = await ethers.getContractFactory("RAPDAOToken");
const token = await RAPDAOToken.attach("컨트랙트_주소");

// 토큰 발행
await token.mint("받을_주소", ethers.parseEther("1000"));

// 잔액 확인
const balance = await token.balanceOf("주소");
console.log(ethers.formatEther(balance));
```

### 토큰 소각 (Burn)

```javascript
// 자신의 토큰 소각
await token.burn(ethers.parseEther("100"));
```

---

## 🔍 블록체인에서 확인하기

### Etherscan으로 확인

1. **트랜잭션 조회**:
   - https://sepolia.etherscan.io/tx/[트랜잭션_해시]
   
2. **주소 잔액 조회**:
   - https://sepolia.etherscan.io/address/[지갑_주소]
   
3. **토큰 정보 조회**:
   - https://sepolia.etherscan.io/token/[컨트랙트_주소]

### 확인 가능한 정보:
- ✅ 총 공급량 (Total Supply)
- ✅ 보유자 수 (Holders)
- ✅ 모든 전송 기록 (Transfers)
- ✅ 컨트랙트 소스 코드 (검증 후)

---

## 🛠️ 문제 해결

### "Insufficient funds" 에러
**원인**: 가스비 지불을 위한 ETH가 부족합니다.
**해결**: Faucet에서 테스트 ETH를 더 받으세요.

### "Nonce too high" 에러
**원인**: 네트워크 동기화 문제
**해결**: MetaMask 설정 → 고급 → "계정 활동 재설정"

### 배포가 너무 오래 걸림
**원인**: 가스비를 너무 낮게 설정했거나 네트워크가 혼잡합니다.
**해결**: 
```bash
# hardhat.config.cjs에 gasPrice 추가
sepolia: {
  url: "...",
  accounts: ["..."],
  gasPrice: 20000000000 // 20 Gwei
}
```

### MetaMask에 토큰이 안 보임
**해결**:
1. 올바른 네트워크(Sepolia)에 있는지 확인
2. 컨트랙트 주소가 정확한지 확인
3. MetaMask 새로고침 또는 재시작

---

## 📚 추가 리소스

### 학습 자료
- [Solidity 공식 문서](https://docs.soliditylang.org/)
- [OpenZeppelin ERC-20](https://docs.openzeppelin.com/contracts/erc20)
- [Hardhat 가이드](https://hardhat.org/getting-started/)
- [Ethereum 개발자 문서](https://ethereum.org/developers)

### 도구
- [Remix IDE](https://remix.ethereum.org/) - 브라우저 기반 Solidity IDE
- [Tenderly](https://tenderly.co/) - 트랜잭션 디버거
- [Etherscan](https://etherscan.io/) - 블록 탐색기

### 커뮤니티
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [OpenZeppelin Forum](https://forum.openzeppelin.com/)
- [Hardhat Discord](https://hardhat.org/discord)

---

## 🎉 다음 단계

### 메인넷 배포 준비 (실제 사용)
⚠️ **주의**: 메인넷 배포는 실제 비용이 발생합니다!

1. **법적 검토**: 토큰 발행 관련 법규 확인
2. **보안 감사**: 스마트 컨트랙트 보안 감사 실시
3. **충분한 ETH 준비**: 배포 비용 $50-200 예상
4. **백업**: 개인키와 복구 문구를 안전하게 백업

### 고급 기능 추가
- 🔒 타임락 (Timelock)
- 📊 스테이킹 (Staking)
- 🗳️ 거버넌스 투표 (Governance)
- 💱 DEX 리스팅 (Uniswap 등)

---

**만든 이**: RAPDAO Team  
**라이선스**: MIT  
**최종 업데이트**: 2025-11-05

🚀 Happy Blockchain Development!
