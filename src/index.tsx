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

// ==================== API Routes ====================

// 토큰 정보 조회
app.get('/api/token/info', async (c) => {
  try {
    const { env } = c
    const result = await env.DB.prepare(
      'SELECT * FROM token_info WHERE id = 1'
    ).first()
    
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 계정 생성 (토큰 발행)
app.post('/api/account/create', async (c) => {
  try {
    const { env } = c
    const { address, amount } = await c.req.json()
    
    if (!address || !amount) {
      return c.json({ success: false, error: '주소와 수량이 필요합니다.' }, 400)
    }

    // 계정이 이미 존재하는지 확인
    const existing = await env.DB.prepare(
      'SELECT * FROM accounts WHERE address = ?'
    ).bind(address).first()

    if (existing) {
      return c.json({ success: false, error: '이미 존재하는 주소입니다.' }, 400)
    }

    // 계정 생성
    await env.DB.prepare(
      'INSERT INTO accounts (address, balance) VALUES (?, ?)'
    ).bind(address, amount).run()

    return c.json({ 
      success: true, 
      data: { address, balance: amount } 
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 잔액 조회
app.get('/api/account/:address', async (c) => {
  try {
    const { env } = c
    const address = c.req.param('address')
    
    const account = await env.DB.prepare(
      'SELECT * FROM accounts WHERE address = ?'
    ).bind(address).first()

    if (!account) {
      return c.json({ success: false, error: '계정을 찾을 수 없습니다.' }, 404)
    }

    return c.json({ success: true, data: account })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 모든 계정 조회
app.get('/api/accounts', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare(
      'SELECT * FROM accounts ORDER BY created_at DESC'
    ).all()

    return c.json({ success: true, data: results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 토큰 전송
app.post('/api/transfer', async (c) => {
  try {
    const { env } = c
    const { from, to, amount } = await c.req.json()
    
    if (!from || !to || !amount || amount <= 0) {
      return c.json({ success: false, error: '잘못된 요청입니다.' }, 400)
    }

    // 발신자 계정 확인
    const fromAccount = await env.DB.prepare(
      'SELECT * FROM accounts WHERE address = ?'
    ).bind(from).first() as any

    if (!fromAccount) {
      return c.json({ success: false, error: '발신자 계정을 찾을 수 없습니다.' }, 404)
    }

    if (fromAccount.balance < amount) {
      return c.json({ success: false, error: '잔액이 부족합니다.' }, 400)
    }

    // 수신자 계정 확인 (없으면 생성)
    let toAccount = await env.DB.prepare(
      'SELECT * FROM accounts WHERE address = ?'
    ).bind(to).first()

    if (!toAccount) {
      await env.DB.prepare(
        'INSERT INTO accounts (address, balance) VALUES (?, 0)'
      ).bind(to).run()
    }

    // 트랜잭션 해시 생성
    const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`

    // 발신자 잔액 감소
    await env.DB.prepare(
      'UPDATE accounts SET balance = balance - ? WHERE address = ?'
    ).bind(amount, from).run()

    // 수신자 잔액 증가
    await env.DB.prepare(
      'UPDATE accounts SET balance = balance + ? WHERE address = ?'
    ).bind(amount, to).run()

    // 트랜잭션 기록
    await env.DB.prepare(
      'INSERT INTO transactions (from_address, to_address, amount, tx_hash, status) VALUES (?, ?, ?, ?, ?)'
    ).bind(from, to, amount, txHash, 'confirmed').run()

    return c.json({ 
      success: true, 
      data: { from, to, amount, txHash } 
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 트랜잭션 내역 조회
app.get('/api/transactions', async (c) => {
  try {
    const { env } = c
    const { results } = await env.DB.prepare(
      'SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100'
    ).all()

    return c.json({ success: true, data: results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 특정 주소의 트랜잭션 조회
app.get('/api/transactions/:address', async (c) => {
  try {
    const { env } = c
    const address = c.req.param('address')
    
    const { results } = await env.DB.prepare(
      'SELECT * FROM transactions WHERE from_address = ? OR to_address = ? ORDER BY created_at DESC'
    ).bind(address, address).all()

    return c.json({ success: true, data: results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ==================== Frontend ====================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RAPDAO Token Platform</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            
            * {
                font-family: 'Space Grotesk', sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            
            .glass {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            }
            
            .gradient-text {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                transition: all 0.3s ease;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            }
            
            .card-hover {
                transition: all 0.3s ease;
            }
            
            .card-hover:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            }
            
            .pulse-animation {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            
            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: .7;
                }
            }
            
            .tab-active {
                background: white;
                color: #667eea;
            }
        </style>
    </head>
    <body class="p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="glass rounded-3xl p-8 mb-8 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-4xl md:text-5xl font-bold mb-2 flex items-center">
                            <i class="fas fa-coins mr-4 pulse-animation"></i>
                            RAPDAO
                        </h1>
                        <p class="text-xl opacity-90">Next Generation Token Platform</p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm opacity-75 mb-1">Total Supply</div>
                        <div class="text-3xl font-bold" id="totalSupply">-</div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="glass rounded-3xl p-2 mb-6">
                <div class="flex gap-2">
                    <button onclick="switchTab('mint')" id="tab-mint" class="tab-active flex-1 py-3 px-6 rounded-2xl font-semibold transition-all">
                        <i class="fas fa-plus-circle mr-2"></i>토큰 발행
                    </button>
                    <button onclick="switchTab('transfer')" id="tab-transfer" class="flex-1 py-3 px-6 rounded-2xl font-semibold text-white transition-all hover:bg-white/10">
                        <i class="fas fa-exchange-alt mr-2"></i>전송
                    </button>
                    <button onclick="switchTab('accounts')" id="tab-accounts" class="flex-1 py-3 px-6 rounded-2xl font-semibold text-white transition-all hover:bg-white/10">
                        <i class="fas fa-users mr-2"></i>계정
                    </button>
                    <button onclick="switchTab('transactions')" id="tab-transactions" class="flex-1 py-3 px-6 rounded-2xl font-semibold text-white transition-all hover:bg-white/10">
                        <i class="fas fa-list mr-2"></i>트랜잭션
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div id="content-area">
                <!-- Mint Section -->
                <div id="section-mint" class="content-section">
                    <div class="glass rounded-3xl p-8 text-white card-hover">
                        <h2 class="text-2xl font-bold mb-6 flex items-center">
                            <i class="fas fa-plus-circle mr-3"></i>
                            토큰 발행
                        </h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2 opacity-75">지갑 주소</label>
                                <input type="text" id="mintAddress" 
                                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
                                    placeholder="0x...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2 opacity-75">수량</label>
                                <input type="number" id="mintAmount" 
                                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
                                    placeholder="1000">
                            </div>
                            <button onclick="mintTokens()" 
                                class="w-full btn-primary text-white font-semibold py-4 px-6 rounded-xl">
                                <i class="fas fa-rocket mr-2"></i>
                                토큰 발행하기
                            </button>
                        </div>
                        <div id="mintResult" class="mt-4"></div>
                    </div>
                </div>

                <!-- Transfer Section -->
                <div id="section-transfer" class="content-section hidden">
                    <div class="glass rounded-3xl p-8 text-white card-hover">
                        <h2 class="text-2xl font-bold mb-6 flex items-center">
                            <i class="fas fa-exchange-alt mr-3"></i>
                            토큰 전송
                        </h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-2 opacity-75">발신 주소</label>
                                <input type="text" id="fromAddress" 
                                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
                                    placeholder="0x...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2 opacity-75">수신 주소</label>
                                <input type="text" id="toAddress" 
                                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
                                    placeholder="0x...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2 opacity-75">수량</label>
                                <input type="number" id="transferAmount" 
                                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
                                    placeholder="100">
                            </div>
                            <button onclick="transferTokens()" 
                                class="w-full btn-primary text-white font-semibold py-4 px-6 rounded-xl">
                                <i class="fas fa-paper-plane mr-2"></i>
                                전송하기
                            </button>
                        </div>
                        <div id="transferResult" class="mt-4"></div>
                    </div>
                </div>

                <!-- Accounts Section -->
                <div id="section-accounts" class="content-section hidden">
                    <div class="glass rounded-3xl p-8 text-white">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold flex items-center">
                                <i class="fas fa-users mr-3"></i>
                                계정 목록
                            </h2>
                            <button onclick="loadAccounts()" class="btn-primary px-4 py-2 rounded-xl text-sm">
                                <i class="fas fa-sync-alt mr-2"></i>새로고침
                            </button>
                        </div>
                        <div id="accountsList" class="space-y-3"></div>
                    </div>
                </div>

                <!-- Transactions Section -->
                <div id="section-transactions" class="content-section hidden">
                    <div class="glass rounded-3xl p-8 text-white">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold flex items-center">
                                <i class="fas fa-list mr-3"></i>
                                트랜잭션 내역
                            </h2>
                            <button onclick="loadTransactions()" class="btn-primary px-4 py-2 rounded-xl text-sm">
                                <i class="fas fa-sync-alt mr-2"></i>새로고침
                            </button>
                        </div>
                        <div id="transactionsList" class="space-y-3"></div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // Tab switching
            function switchTab(tab) {
                // Update tab buttons
                document.querySelectorAll('[id^="tab-"]').forEach(btn => {
                    btn.classList.remove('tab-active');
                    btn.classList.add('text-white', 'hover:bg-white/10');
                });
                document.getElementById('tab-' + tab).classList.add('tab-active');
                document.getElementById('tab-' + tab).classList.remove('text-white', 'hover:bg-white/10');

                // Update content
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.add('hidden');
                });
                document.getElementById('section-' + tab).classList.remove('hidden');

                // Load data if needed
                if (tab === 'accounts') loadAccounts();
                if (tab === 'transactions') loadTransactions();
            }

            // Load token info
            async function loadTokenInfo() {
                try {
                    const res = await fetch('/api/token/info');
                    const data = await res.json();
                    if (data.success && data.data) {
                        document.getElementById('totalSupply').textContent = 
                            (data.data.total_supply / 1000000).toFixed(0) + 'M ' + data.data.symbol;
                    }
                } catch (error) {
                    console.error('Failed to load token info:', error);
                }
            }

            // Mint tokens
            async function mintTokens() {
                const address = document.getElementById('mintAddress').value;
                const amount = parseInt(document.getElementById('mintAmount').value);
                const resultDiv = document.getElementById('mintResult');

                if (!address || !amount) {
                    showResult(resultDiv, '주소와 수량을 입력해주세요.', false);
                    return;
                }

                try {
                    const res = await fetch('/api/account/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address, amount })
                    });
                    const data = await res.json();
                    
                    if (data.success) {
                        showResult(resultDiv, '✅ 토큰 발행 성공!', true);
                        document.getElementById('mintAddress').value = '';
                        document.getElementById('mintAmount').value = '';
                    } else {
                        showResult(resultDiv, '❌ ' + data.error, false);
                    }
                } catch (error) {
                    showResult(resultDiv, '❌ 오류 발생: ' + error.message, false);
                }
            }

            // Transfer tokens
            async function transferTokens() {
                const from = document.getElementById('fromAddress').value;
                const to = document.getElementById('toAddress').value;
                const amount = parseInt(document.getElementById('transferAmount').value);
                const resultDiv = document.getElementById('transferResult');

                if (!from || !to || !amount) {
                    showResult(resultDiv, '모든 필드를 입력해주세요.', false);
                    return;
                }

                try {
                    const res = await fetch('/api/transfer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ from, to, amount })
                    });
                    const data = await res.json();
                    
                    if (data.success) {
                        showResult(resultDiv, '✅ 전송 성공! TX: ' + data.data.txHash, true);
                        document.getElementById('fromAddress').value = '';
                        document.getElementById('toAddress').value = '';
                        document.getElementById('transferAmount').value = '';
                    } else {
                        showResult(resultDiv, '❌ ' + data.error, false);
                    }
                } catch (error) {
                    showResult(resultDiv, '❌ 오류 발생: ' + error.message, false);
                }
            }

            // Load accounts
            async function loadAccounts() {
                try {
                    const res = await fetch('/api/accounts');
                    const data = await res.json();
                    const listDiv = document.getElementById('accountsList');

                    if (data.success && data.data.length > 0) {
                        listDiv.innerHTML = data.data.map(acc => \`
                            <div class="bg-white/10 rounded-xl p-4 border border-white/20 card-hover">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <div class="text-sm opacity-75 mb-1">Address</div>
                                        <div class="font-mono text-sm break-all">\${acc.address}</div>
                                    </div>
                                    <div class="text-right ml-4">
                                        <div class="text-sm opacity-75 mb-1">Balance</div>
                                        <div class="text-2xl font-bold">\${acc.balance.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        \`).join('');
                    } else {
                        listDiv.innerHTML = '<div class="text-center py-8 opacity-75">계정이 없습니다.</div>';
                    }
                } catch (error) {
                    console.error('Failed to load accounts:', error);
                }
            }

            // Load transactions
            async function loadTransactions() {
                try {
                    const res = await fetch('/api/transactions');
                    const data = await res.json();
                    const listDiv = document.getElementById('transactionsList');

                    if (data.success && data.data.length > 0) {
                        listDiv.innerHTML = data.data.map(tx => \`
                            <div class="bg-white/10 rounded-xl p-4 border border-white/20 card-hover">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center">
                                        <i class="fas fa-arrow-right mr-2"></i>
                                        <span class="text-sm opacity-75">\${new Date(tx.created_at).toLocaleString()}</span>
                                    </div>
                                    <div class="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                                        \${tx.status}
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div class="opacity-75 mb-1">From</div>
                                        <div class="font-mono text-xs break-all">\${tx.from_address}</div>
                                    </div>
                                    <div>
                                        <div class="opacity-75 mb-1">To</div>
                                        <div class="font-mono text-xs break-all">\${tx.to_address}</div>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
                                    <div class="text-sm opacity-75">Amount</div>
                                    <div class="text-xl font-bold">\${tx.amount.toLocaleString()}</div>
                                </div>
                            </div>
                        \`).join('');
                    } else {
                        listDiv.innerHTML = '<div class="text-center py-8 opacity-75">트랜잭션이 없습니다.</div>';
                    }
                } catch (error) {
                    console.error('Failed to load transactions:', error);
                }
            }

            // Show result message
            function showResult(div, message, success) {
                div.innerHTML = \`
                    <div class="p-4 rounded-xl \${success ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'}">
                        \${message}
                    </div>
                \`;
                setTimeout(() => div.innerHTML = '', 5000);
            }

            // Initialize
            loadTokenInfo();
        </script>
    </body>
    </html>
  `)
})

export default app
