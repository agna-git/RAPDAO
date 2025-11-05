const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // deployment-info.json 읽기
  if (!fs.existsSync('./deployment-info.json')) {
    console.error("❌ deployment-info.json 파일을 찾을 수 없습니다.");
    console.log("먼저 deploy.js를 실행하세요.");
    return;
  }
  
  const deploymentInfo = JSON.parse(fs.readFileSync('./deployment-info.json', 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;
  const deployer = deploymentInfo.deployer;
  
  console.log("🔍 컨트랙트 검증 시작...");
  console.log("📍 주소:", contractAddress);
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [deployer],
    });
    
    console.log("✅ 검증 완료!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  이미 검증된 컨트랙트입니다.");
    } else {
      console.error("❌ 검증 실패:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
