# 🚀 RAPDAO Token 즉시 배포 가이드

## ✅ 준비 완료!
- 토큰 총 수량: **10,000,000 RAP**
- 스마트 컨트랙트: 컴파일 완료 ✅
- 배포 스크립트: 준비됨 ✅

---

## 📋 배포 3단계 (5-10분 소요)

### Step 1: MetaMask 설치 및 테스트 ETH 받기 (3분)

#### 1-1. MetaMask 설치
1. [MetaMask.io](https://metamask.io/) 접속
2. Chrome/Firefox 확장 프로그램 설치
3. 새 지갑 생성
4. **복구 문구(12단어)를 안전하게 보관!**

#### 1-2. Sepolia 네트워크 추가
1. MetaMask 열기
2. 상단 네트워크 선택 → "네트워크 추가"
3. "네트워크를 수동으로 추가" 클릭
4. 정보 입력:
   ```
   네트워크 이름: Sepolia
   RPC URL: https://rpc.sepolia.org
   체인 ID: 11155111
   통화 기호: ETH
   블록 탐색기: https://sepolia.etherscan.io
   ```
5. 저장

#### 1-3. 무료 테스트 ETH 받기
다음 사이트 중 하나에서 MetaMask 주소를 입력하고 테스트 ETH 받기:
- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Sepolia Faucet 2](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Sepolia Faucet 3](https://faucet.quicknode.com/ethereum/sepolia)

**받는 양**: 0.1-0.5 ETH (무료, 테스트넷 전용)

---

### Step 2: 개인키 설정 (1분)

#### 2-1. MetaMask에서 개인키 내보내기
1. MetaMask 열기
2. 계정 메뉴 (3점) 클릭
3. "계정 상세정보" 클릭
4. "개인 키 내보내기" 클릭
5. 비밀번호 입력
6. 개인키 복사 (0x로 시작하는 64자리 문자열)

⚠️ **경고**: 개인키를 절대 타인과 공유하지 마세요!

#### 2-2. .env 파일 생성
프로젝트 폴더에서:

```bash
# 1. .env.example을 .env로 복사
cp .env.example .env

# 2. .env 파일 편집
# 텍스트 에디터로 .env 파일을 열고:
```

`.env` 파일 내용:
```bash
# MetaMask 개인키 (0x로 시작)
PRIVATE_KEY=0x여기에_개인키_붙여넣기

# RPC URL (기본값 사용 가능)
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

저장하고 닫기.

---

### Step 3: 배포 실행! (1분)

#### 터미널에서 실행:

```bash
# Sepolia 테스트넷에 배포
npm run blockchain:deploy:sepolia
```

또는:

```bash
npx hardhat run scripts/deploy.cjs --network sepolia
```

#### 배포 완료시 출력:

```
🚀 RAPDAO Token 배포 시작...
📝 배포 계정: 0x당신의주소...
💰 계정 잔액: 0.5 ETH

⏳ 컨트랙트 배포 중...

✅ 배포 완료!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 컨트랙트 주소: 0x1234567890abcdef...
🏷️  토큰 이름: RAPDAO Token
🔖 토큰 심볼: RAP
📊 초기 공급량: 10000000 RAP
📈 최대 공급량: 10000000 RAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 네트워크 정보:
   이름: sepolia
   Chain ID: 11155111

🔍 Sepolia Etherscan:
   https://sepolia.etherscan.io/address/0x1234...

💡 다음 단계:
   1. 컨트랙트 주소를 복사하세요
   2. MetaMask에 토큰을 추가하세요
   3. 친구에게 토큰을 전송하세요

📄 배포 정보가 deployment-info.json에 저장되었습니다.
```

**🎉 축하합니다! 이제 실제 블록체인 토큰을 소유하게 되었습니다!**

---

## 🪙 MetaMask에 토큰 추가

### 방법 1: 수동 추가
1. MetaMask 열기
2. Sepolia 네트워크 선택
3. "토큰" 탭
4. "토큰 가져오기" 클릭
5. 컨트랙트 주소 입력 (배포시 받은 주소)
6. "사용자 지정 토큰 추가" 클릭

### 방법 2: Etherscan에서 추가
1. Etherscan 링크 클릭 (배포시 출력된 링크)
2. "More" → "Add token to MetaMask" 클릭

---

## 💸 토큰 전송하기

### MetaMask로 전송:
1. MetaMask 열기
2. RAP 토큰 선택
3. "보내기" 클릭
4. 받을 주소 입력 (친구 지갑 주소)
5. 수량 입력
6. 가스비 확인 후 "확인" 클릭

**전송 완료!** 🎊

---

## 🔍 블록체인에서 확인

### Etherscan으로 확인:
1. **토큰 정보**: https://sepolia.etherscan.io/token/[컨트랙트주소]
2. **내 잔액**: https://sepolia.etherscan.io/address/[내주소]
3. **전송 내역**: 토큰 페이지에서 "Transfers" 탭

모든 거래가 **영구적으로 블록체인에 기록**됩니다!

---

## 🎁 보너스: 토큰 추가 발행 (선택사항)

나중에 더 발행하고 싶다면:

```bash
# Hardhat 콘솔 실행
npx hardhat console --network sepolia
```

콘솔에서:
```javascript
// 컨트랙트 연결
const RAPDAOToken = await ethers.getContractFactory("RAPDAOToken");
const token = await RAPDAOToken.attach("컨트랙트_주소");

// 추가 발행은 불가능 (이미 최대 수량 발행됨)
// 하지만 소각은 가능:
await token.burn(ethers.parseEther("1000")); // 1000개 소각

// 잔액 확인
const balance = await token.balanceOf("주소");
console.log(ethers.formatEther(balance));
```

---

## ❓ 문제 해결

### "Insufficient funds" 에러
→ Faucet에서 테스트 ETH를 더 받으세요.

### "Invalid private key" 에러
→ .env 파일의 PRIVATE_KEY가 0x로 시작하는지 확인하세요.

### 배포가 너무 오래 걸림
→ 최대 2-3분 정도 소요됩니다. 기다려주세요.

### MetaMask에 토큰이 안 보임
→ Sepolia 네트워크에 있는지 확인하세요.

---

## 📞 도움이 필요하면?

- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [Hardhat Discord](https://hardhat.org/discord)
- [OpenZeppelin Forum](https://forum.openzeppelin.com/)

---

## 🎉 다음 단계

### 할 수 있는 것:
- ✅ 친구에게 토큰 전송
- ✅ Etherscan에서 모든 거래 확인
- ✅ 다른 DeFi 프로젝트와 통합
- ✅ 거래소 상장 (충분한 유동성 필요)

### 메인넷 배포 (실제 가치)
⚠️ **주의**: 실제 ETH 비용 발생 ($50-200)
- 법적 검토 필요
- 보안 감사 권장
- 충분한 ETH 준비

---

**만든 이**: RAPDAO Team  
**토큰 총량**: 10,000,000 RAP  
**최종 업데이트**: 2025-11-05

🚀 **지금 바로 배포하세요!**
