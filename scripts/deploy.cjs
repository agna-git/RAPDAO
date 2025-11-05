const hre = require("hardhat");

async function main() {
  console.log("🚀 RAPDAO Token 배포 시작...");
  
  // 배포자 계정 정보 가져오기
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 배포 계정:", deployer.address);
  
  // 잔액 확인
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 계정 잔액:", hre.ethers.formatEther(balance), "ETH");
  
  // 컨트랙트 배포
  console.log("\n⏳ 컨트랙트 배포 중...");
  const RAPDAOToken = await hre.ethers.getContractFactory("RAPDAOToken");
  const token = await RAPDAOToken.deploy(deployer.address);
  
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  
  console.log("\n✅ 배포 완료!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 컨트랙트 주소:", tokenAddress);
  console.log("🏷️  토큰 이름:", await token.name());
  console.log("🔖 토큰 심볼:", await token.symbol());
  console.log("📊 초기 공급량:", hre.ethers.formatEther(await token.totalSupply()), "RAP");
  console.log("📈 최대 공급량:", hre.ethers.formatEther(await token.maxSupply()), "RAP");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // 네트워크 정보
  const network = await hre.ethers.provider.getNetwork();
  console.log("\n🌐 네트워크 정보:");
  console.log("   이름:", network.name);
  console.log("   Chain ID:", network.chainId);
  
  // Etherscan 링크
  if (network.chainId === 11155111n) {
    console.log("\n🔍 Sepolia Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${tokenAddress}`);
  } else if (network.chainId === 80001n) {
    console.log("\n🔍 Mumbai PolygonScan:");
    console.log(`   https://mumbai.polygonscan.com/address/${tokenAddress}`);
  }
  
  console.log("\n💡 다음 단계:");
  console.log("   1. 컨트랙트 주소를 복사하세요");
  console.log("   2. MetaMask에 토큰을 추가하세요");
  console.log("   3. 프론트엔드에서 컨트랙트 주소를 사용하세요");
  
  // 배포 정보를 파일로 저장
  const fs = require('fs');
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contractAddress: tokenAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n📄 배포 정보가 deployment-info.json에 저장되었습니다.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 실패:", error);
    process.exit(1);
  });
