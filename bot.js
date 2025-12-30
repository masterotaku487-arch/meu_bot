const http = require('http');

// Servidor obrigatório para o Koyeb não desligar o bot
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot vivo e operando 24/7');
}).listen(8080);

const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalBlock } = require('mineflayer-pathfinder').goals;
const fs = require('fs');

const CONFIG = {
    host: 'bawmc.net',
    username: 'olouco_afk_8890',
    version: '1.20.1',
    auth: 'offline'
};

const LOG_FILE = 'aprendizado.log';
const ORDEM_FILE = 'instrucao.txt';
const SENHA = "anime30rr";
const DONO_PAGAMENTO = '.R_R2086'; // Nick do dono

const bot = mineflayer.createBot(CONFIG);
bot.loadPlugin(pathfinder);

let saldoAtual = "Aguardando checagem...";

function registrar(msg) {
    const timestamp = new Date().toLocaleTimeString();
    const pos = bot.entity ? `[${bot.entity.position.x.toFixed(0)}, ${bot.entity.position.y.toFixed(0)}, ${bot.entity.position.z.toFixed(0)}]` : '[Lobby]';
    const linha = `[${timestamp}] ${pos} ${msg}`;
    if (fs.existsSync(LOG_FILE)) fs.appendFileSync(LOG_FILE, linha + '\n');
    console.log(linha);
}

function falar(msg) {
    if (bot && bot._client && bot._client.state === 'play') {
        bot.chat(msg);
    } else {
        registrar(`⚠️ Não foi possível enviar: ${msg} (Bot desconectado)`);
    }
}

// === ESCUTA CHAT DO MINECRAFT ===
bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();
    
    if ((msg === '#moneyatual' || msg === '!moneyatual') && username === DONO_PAGAMENTO.replace('.', '')) {
        falar(`Meu saldo atual é: ${saldoAtual}`);
    }
});

bot.on('spawn', () => {
    registrar("🌍 Spawnado! Iniciando protocolos...");
    
    setTimeout(() => {
        falar(`/registrar ${SENHA} ${SENHA}`);
        falar(`/logar ${SENHA}`);
        
        setTimeout(() => {
            if (bot.entity && bot.entity.position.y < 0) {
                registrar("⚠️ No Limbo. Tentando logar...");
                falar(`/logar ${SENHA}`);
            } else {
                registrar("✅ No Lobby! Indo ao NPC...");
                bot.pathfinder.setGoal(new GoalBlock(-1, 63, 14)); 

                setTimeout(() => {
                    const npc = bot.nearestEntity(e => e.name === 'player' || e.name === 'npc');
                    if (npc) {
                        bot.activateEntity(npc);
                        registrar("⚔️ Entrou no Semi-Anarquia.");
                    }

                    setTimeout(() => {
                        registrar("🏃 Andando 10 blocos...");
                        const yaw = bot.entity.yaw;
                        const goalX = bot.entity.position.x - Math.sin(yaw) * 10;
                        const goalZ = bot.entity.position.z - Math.cos(yaw) * 10;
                        bot.pathfinder.setGoal(new GoalBlock(goalX, bot.entity.position.y, goalZ));

                        setTimeout(() => {
                            falar('/afk');
                            registrar("💤 AFK ATIVADO.");
                            
                            // Pulo Anti-AFK
                            setInterval(() => {
                                bot.setControlState('jump', true);
                                setTimeout(() => bot.setControlState('jump', false), 100);
                            }, 45000);

                            // Checagem de saldo a cada 5 min
                            setInterval(() => { falar('/money'); }, 300000);
                        }, 6000);
                    }, 5000);
                }, 8000);
            }
        }, 5000);
    }, 2000);
});

bot.on('messagestr', (message) => {
    const msgLower = message.toLowerCase();
    if (msgLower.includes('saldo:') || msgLower.includes('money:')) {
        const numeros = message.match(/\d+/g);
        if (numeros) {
            saldoAtual = numeros.join('.'); 
            const saldoInt = parseInt(numeros.join(''));
            registrar(`💰 Saldo Atualizado: ${saldoAtual}`);
            
            if (saldoInt >= 1000) {
                falar(`/pay ${DONO_PAGAMENTO} 1000`);
                registrar("💸 1k enviado!");
            }
        }
    }
});

// === ESCUTA O TERMINAL (instrucao.txt) ===
setInterval(() => {
    if (fs.existsSync(ORDEM_FILE)) {
        let ordem = fs.readFileSync(ORDEM_FILE, 'utf8').trim();
        if (ordem) {
            if (ordem === '#moneyatual' || ordem === '!moneyatual') {
                falar(`Meu saldo atual é: ${saldoAtual}`);
            } else if (ordem.startsWith('#') || ordem.startsWith('!')) {
                falar(ordem.slice(1));
            } else if (ordem.startsWith('/')) {
                falar(ordem);
            }
            fs.unlinkSync(ORDEM_FILE);
        }
    }
}, 500);

// === SISTEMA DE RECONEXÃO AUTOMÁTICA (KOYEB SAFE) ===
bot.on('error', (err) => registrar(`❌ Erro: ${err.message}`));

bot.on('end', () => {
    registrar("🔴 Bot desconectado. Reiniciando processo em 15 segundos para evitar erro de porta...");
    setTimeout(() => {
        process.exit(1); // O Koyeb reiniciará o bot automaticamente
    }, 15000);
});

// Impede que o bot morra por erros inesperados
process.on('uncaughtException', (err) => {
    registrar(`💥 Erro Crítico: ${err.message}`);
    setTimeout(() => process.exit(1), 5000);
});
