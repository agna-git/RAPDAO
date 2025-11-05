import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS 설정
app.use('/api/*', cors())

// Static files
app.use('/static/*', serveStatic({ root: './public' }))

// 블록체인 정보
const CONTRACT_ADDRESS = '0x90609291dE2433dFe1E4e553c8a1A68f94d8ab7d'
const ETHERSCAN_URL = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`

// ==================== Frontend ====================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 RAPDAO - To The Moon!</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Audiowide&display=swap');
            
            * {
                font-family: 'Orbitron', sans-serif;
            }
            
            body {
                margin: 0;
                padding: 0;
                overflow-x: hidden;
                background: #0a0e27;
                position: relative;
            }
            
            /* 별 배경 애니메이션 */
            .stars {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 0;
            }
            
            .star {
                position: absolute;
                background: white;
                border-radius: 50%;
                animation: twinkle 3s infinite;
            }
            
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            
            /* 로켓 애니메이션 */
            .rocket {
                position: fixed;
                font-size: 60px;
                animation: rocket-fly 20s linear infinite;
                z-index: 1;
            }
            
            @keyframes rocket-fly {
                0% {
                    left: -100px;
                    bottom: -100px;
                    transform: rotate(45deg);
                }
                100% {
                    left: 120%;
                    bottom: 120%;
                    transform: rotate(45deg);
                }
            }
            
            /* 네온 효과 */
            .neon-text {
                text-shadow: 
                    0 0 10px #00ff88,
                    0 0 20px #00ff88,
                    0 0 30px #00ff88,
                    0 0 40px #00ff88;
                animation: neon-pulse 2s ease-in-out infinite;
            }
            
            @keyframes neon-pulse {
                0%, 100% { text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88; }
                50% { text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88; }
            }
            
            /* 카드 효과 */
            .space-card {
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
                backdrop-filter: blur(10px);
                border: 2px solid #00ff88;
                box-shadow: 
                    0 0 20px rgba(0, 255, 136, 0.3),
                    0 0 40px rgba(0, 255, 136, 0.1);
                transition: all 0.3s ease;
            }
            
            .space-card:hover {
                transform: translateY(-10px) scale(1.02);
                box-shadow: 
                    0 0 30px rgba(0, 255, 136, 0.5),
                    0 0 60px rgba(0, 255, 136, 0.2);
            }
            
            /* 버튼 효과 */
            .space-button {
                background: linear-gradient(135deg, #00ff88, #00ccff);
                border: none;
                color: #0a0e27;
                font-weight: bold;
                padding: 15px 40px;
                border-radius: 50px;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            
            .space-button:hover {
                transform: scale(1.1);
                box-shadow: 0 0 40px rgba(0, 255, 136, 0.8);
            }
            
            /* 입력 필드 */
            .space-input {
                background: rgba(15, 23, 42, 0.6);
                border: 2px solid #00ff88;
                color: #00ff88;
                padding: 15px;
                border-radius: 10px;
                font-family: 'Orbitron', monospace;
                transition: all 0.3s ease;
            }
            
            .space-input:focus {
                outline: none;
                border-color: #00ccff;
                box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
            }
            
            /* 행성 장식 */
            .planet {
                position: fixed;
                border-radius: 50%;
                filter: blur(1px);
                z-index: 0;
            }
            
            .planet-1 {
                width: 150px;
                height: 150px;
                background: radial-gradient(circle at 30% 30%, #ff6b9d, #c44569);
                top: 10%;
                right: 10%;
                animation: float 20s ease-in-out infinite;
            }
            
            .planet-2 {
                width: 100px;
                height: 100px;
                background: radial-gradient(circle at 30% 30%, #ffa502, #ff6348);
                bottom: 20%;
                left: 15%;
                animation: float 15s ease-in-out infinite reverse;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-30px) rotate(180deg); }
            }
            
            /* 컨텐츠 레이어 */
            .content {
                position: relative;
                z-index: 10;
            }
            
            /* 카운터 애니메이션 */
            @keyframes count-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .stat-box {
                animation: count-up 0.5s ease-out;
            }
        </style>
    </head>
    <body>
        <!-- 별 배경 -->
        <div class="stars" id="stars"></div>
        
        <!-- 로켓 -->
        <div class="rocket">🚀</div>
        
        <!-- 행성 -->
        <div class="planet planet-1"></div>
        <div class="planet planet-2"></div>
        
        <!-- 메인 콘텐츠 -->
        <div class="content min-h-screen p-4 md:p-8">
            <div class="max-w-7xl mx-auto">
                
                <!-- 헤더 -->
                <header class="text-center mb-12 pt-8">
                    <h1 class="text-6xl md:text-8xl font-black mb-4 neon-text" style="font-family: 'Audiowide', cursive;">
                        🌟 RAPDAO 🌟
                    </h1>
                    <p class="text-2xl md:text-3xl text-cyan-400 font-bold mb-6">
                        TO THE MOON AND BEYOND! 🚀
                    </p>
                    <div class="flex flex-wrap justify-center gap-4 mb-6">
                        <a href="${ETHERSCAN_URL}" target="_blank" class="space-button">
                            <i class="fas fa-link mr-2"></i>View on Etherscan
                        </a>
                        <button onclick="connectWallet()" class="space-button bg-gradient-to-r from-purple-500 to-pink-500">
                            <i class="fas fa-wallet mr-2"></i>Connect Wallet
                        </button>
                    </div>
                    <div id="walletInfo" class="text-cyan-300 text-lg hidden"></div>
                </header>

                <!-- 통계 카드 -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div class="space-card rounded-2xl p-6 text-center stat-box">
                        <div class="text-5xl mb-3">💎</div>
                        <div class="text-cyan-400 text-sm mb-2">Total Supply</div>
                        <div class="text-3xl font-bold text-white">10M</div>
                    </div>
                    <div class="space-card rounded-2xl p-6 text-center stat-box">
                        <div class="text-5xl mb-3">🏷️</div>
                        <div class="text-cyan-400 text-sm mb-2">Symbol</div>
                        <div class="text-3xl font-bold text-white">RAP</div>
                    </div>
                    <div class="space-card rounded-2xl p-6 text-center stat-box">
                        <div class="text-5xl mb-3">⛓️</div>
                        <div class="text-cyan-400 text-sm mb-2">Network</div>
                        <div class="text-2xl font-bold text-white">Sepolia</div>
                    </div>
                    <div class="space-card rounded-2xl p-6 text-center stat-box">
                        <div class="text-5xl mb-3">🎯</div>
                        <div class="text-cyan-400 text-sm mb-2">Your Balance</div>
                        <div class="text-3xl font-bold text-white" id="userBalance">--</div>
                    </div>
                </div>

                <!-- 기능 섹션 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <!-- 토큰 정보 -->
                    <div class="space-card rounded-3xl p-8">
                        <h2 class="text-3xl font-bold text-white mb-6 flex items-center">
                            <i class="fas fa-info-circle text-cyan-400 mr-3"></i>
                            Token Info
                        </h2>
                        <div class="space-y-4 text-cyan-300">
                            <div class="flex justify-between p-4 bg-black/30 rounded-xl">
                                <span>Contract Address:</span>
                                <span class="font-mono text-sm text-cyan-400">${CONTRACT_ADDRESS.substring(0, 10)}...</span>
                            </div>
                            <div class="flex justify-between p-4 bg-black/30 rounded-xl">
                                <span>Decimals:</span>
                                <span class="text-white font-bold">18</span>
                            </div>
                            <div class="flex justify-between p-4 bg-black/30 rounded-xl">
                                <span>Max Supply:</span>
                                <span class="text-white font-bold">10,000,000 RAP</span>
                            </div>
                            <button onclick="addToMetaMask()" class="w-full space-button mt-4">
                                <i class="fab fa-ethereum mr-2"></i>Add to MetaMask
                            </button>
                        </div>
                    </div>

                    <!-- 전송 기능 -->
                    <div class="space-card rounded-3xl p-8">
                        <h2 class="text-3xl font-bold text-white mb-6 flex items-center">
                            <i class="fas fa-paper-plane text-cyan-400 mr-3"></i>
                            Send RAP
                        </h2>
                        <div class="space-y-4">
                            <div>
                                <label class="text-cyan-400 text-sm mb-2 block">To Address</label>
                                <input type="text" id="sendTo" class="w-full space-input" placeholder="0x...">
                            </div>
                            <div>
                                <label class="text-cyan-400 text-sm mb-2 block">Amount</label>
                                <input type="number" id="sendAmount" class="w-full space-input" placeholder="100">
                            </div>
                            <button onclick="sendTokens()" class="w-full space-button">
                                <i class="fas fa-rocket mr-2"></i>Launch Transfer! 🚀
                            </button>
                        </div>
                        <div id="sendResult" class="mt-4"></div>
                    </div>

                </div>

                <!-- 푸터 -->
                <footer class="text-center mt-16 pb-8 text-cyan-400">
                    <p class="text-lg mb-2">🌌 Powered by Ethereum Blockchain 🌌</p>
                    <p class="text-sm opacity-75">Contract: ${CONTRACT_ADDRESS}</p>
                    <p class="text-xs mt-4 opacity-50">Made with 💚 by RAPDAO Team</p>
                </footer>

            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/ethers@6.9.0/dist/ethers.umd.min.js"></script>
        <script>
            // 별 생성
            const starsContainer = document.getElementById('stars');
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.width = Math.random() * 3 + 'px';
                star.style.height = star.style.width;
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(star);
            }

            // 컨트랙트 설정
            const CONTRACT_ADDRESS = '${CONTRACT_ADDRESS}';
            const CONTRACT_ABI = [
                "function name() view returns (string)",
                "function symbol() view returns (string)",
                "function totalSupply() view returns (uint256)",
                "function balanceOf(address) view returns (uint256)",
                "function transfer(address to, uint256 amount) returns (bool)",
                "event Transfer(address indexed from, address indexed to, uint256 value)"
            ];

            let provider, signer, contract, userAddress;

            // Sepolia 네트워크 추가/전환
            async function switchToSepolia() {
                const sepoliaChainId = '0xaa36a7'; // 11155111
                
                try {
                    // 먼저 네트워크 전환 시도
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: sepoliaChainId }],
                    });
                    return true;
                } catch (switchError) {
                    // 네트워크가 없으면 추가
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: sepoliaChainId,
                                    chainName: 'Sepolia Testnet',
                                    nativeCurrency: {
                                        name: 'Sepolia ETH',
                                        symbol: 'ETH',
                                        decimals: 18
                                    },
                                    rpcUrls: ['https://rpc.sepolia.org'],
                                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                                }],
                            });
                            return true;
                        } catch (addError) {
                            console.error('네트워크 추가 실패:', addError);
                            return false;
                        }
                    } else {
                        console.error('네트워크 전환 실패:', switchError);
                        return false;
                    }
                }
            }

            // MetaMask 연결
            async function connectWallet() {
                if (typeof window.ethereum === 'undefined') {
                    alert('❌ MetaMask를 설치해주세요!\\n\\nMetaMask.io에서 다운로드하세요.');
                    window.open('https://metamask.io/', '_blank');
                    return;
                }

                try {
                    // 1. 계정 연결 요청
                    const accounts = await window.ethereum.request({ 
                        method: 'eth_requestAccounts' 
                    });
                    userAddress = accounts[0];

                    // 2. 현재 네트워크 확인
                    provider = new ethers.BrowserProvider(window.ethereum);
                    const network = await provider.getNetwork();
                    
                    // 3. Sepolia가 아니면 자동 전환
                    if (network.chainId !== 11155111n) {
                        const switched = await switchToSepolia();
                        if (!switched) {
                            alert('❌ Sepolia 네트워크로 전환할 수 없습니다.\\n\\nMetaMask에서 수동으로 Sepolia를 선택해주세요.');
                            return;
                        }
                        // 전환 후 provider 재생성
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        provider = new ethers.BrowserProvider(window.ethereum);
                    }

                    // 4. 컨트랙트 연결
                    signer = await provider.getSigner();
                    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                    // 5. UI 업데이트
                    document.getElementById('walletInfo').innerHTML = 
                        \`✅ Connected: \${userAddress.substring(0, 6)}...\${userAddress.substring(38)}\`;
                    document.getElementById('walletInfo').classList.remove('hidden');

                    // 6. 잔액 조회
                    await updateBalance();
                    
                    alert('✅ 지갑 연결 성공!\\n\\n주소: ' + userAddress.substring(0, 10) + '...');
                    
                } catch (error) {
                    console.error('연결 오류:', error);
                    alert('❌ 지갑 연결 실패\\n\\n' + error.message);
                }
            }

            // 잔액 업데이트
            async function updateBalance() {
                if (!contract || !userAddress) return;
                
                try {
                    const balance = await contract.balanceOf(userAddress);
                    const formatted = ethers.formatEther(balance);
                    document.getElementById('userBalance').textContent = 
                        parseFloat(formatted).toLocaleString() + ' RAP';
                } catch (error) {
                    console.error('잔액 조회 실패:', error);
                }
            }

            // MetaMask에 토큰 추가
            async function addToMetaMask() {
                if (typeof window.ethereum === 'undefined') {
                    alert('MetaMask를 설치해주세요!');
                    return;
                }

                try {
                    await window.ethereum.request({
                        method: 'wallet_watchAsset',
                        params: {
                            type: 'ERC20',
                            options: {
                                address: CONTRACT_ADDRESS,
                                symbol: 'RAP',
                                decimals: 18,
                                image: 'https://em-content.zobj.net/thumbs/120/apple/354/rocket_1f680.png',
                            },
                        },
                    });
                    alert('✅ MetaMask에 RAP 토큰이 추가되었습니다!');
                } catch (error) {
                    console.error(error);
                }
            }

            // 토큰 전송
            async function sendTokens() {
                if (!contract) {
                    alert('먼저 지갑을 연결해주세요!');
                    return;
                }

                const to = document.getElementById('sendTo').value;
                const amount = document.getElementById('sendAmount').value;
                const resultDiv = document.getElementById('sendResult');

                if (!to || !amount) {
                    resultDiv.innerHTML = '<div class="p-4 bg-red-500/20 border-2 border-red-500 rounded-xl text-red-300">❌ 주소와 수량을 입력해주세요</div>';
                    return;
                }

                try {
                    resultDiv.innerHTML = '<div class="p-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl text-yellow-300">🚀 전송 중...</div>';
                    
                    const tx = await contract.transfer(to, ethers.parseEther(amount));
                    resultDiv.innerHTML = '<div class="p-4 bg-blue-500/20 border-2 border-blue-500 rounded-xl text-blue-300">⏳ 블록체인 확인 중...</div>';
                    
                    await tx.wait();
                    
                    resultDiv.innerHTML = \`
                        <div class="p-4 bg-green-500/20 border-2 border-green-500 rounded-xl text-green-300">
                            ✅ 전송 성공! 🎉<br>
                            <a href="https://sepolia.etherscan.io/tx/\${tx.hash}" target="_blank" class="underline">
                                트랜잭션 보기 →
                            </a>
                        </div>
                    \`;
                    
                    document.getElementById('sendTo').value = '';
                    document.getElementById('sendAmount').value = '';
                    
                    setTimeout(() => updateBalance(), 2000);
                } catch (error) {
                    console.error(error);
                    resultDiv.innerHTML = \`<div class="p-4 bg-red-500/20 border-2 border-red-500 rounded-xl text-red-300">❌ 전송 실패: \${error.message}</div>\`;
                }
            }

            // 네트워크 변경 감지
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.on('chainChanged', (chainId) => {
                    console.log('네트워크 변경:', chainId);
                    // 페이지 새로고침
                    window.location.reload();
                });

                window.ethereum.on('accountsChanged', (accounts) => {
                    console.log('계정 변경:', accounts);
                    if (accounts.length === 0) {
                        // 연결 해제됨
                        document.getElementById('walletInfo').classList.add('hidden');
                        document.getElementById('userBalance').textContent = '--';
                    } else {
                        // 자동 재연결
                        connectWallet();
                    }
                });
            }

            // 페이지 로드시 자동 연결 시도
            window.addEventListener('load', async () => {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                        if (accounts.length > 0) {
                            // 이미 연결된 계정이 있으면 자동 연결
                            await connectWallet();
                        }
                    } catch (error) {
                        console.error('자동 연결 실패:', error);
                    }
                }
            });
        </script>
    </body>
    </html>
  `)
})

export default app
