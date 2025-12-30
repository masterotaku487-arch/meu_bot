const mineflayer = require('mineflayer');
const fs = require('fs');

const CONFIG = {
    host: 'bawmc.net',
    username: 'rr_player_99',
    version: '1.20.1',
    auth: 'offline'
};

const SENHA = "anime30rr";
const DONO = 'RR2086';

const bot = mineflayer.createBot(CONFIG);

function log(msg) {
    const t = new Date().toLocaleTimeString();
    const p = bot.entity ? `[${bot.entity.position.x.toFixed(0)}, ${bot.entity.position.z.toFixed(0)}]` : '[LOBBY]';
    console.log(`\x1b[35m${t}\x1b[0m ${p} \x1b[33m${msg}\x1b[0m`);
}

bot.on('spawn', () => {
    log("🚀 Tentando quebrar o bloqueio do Lobby...");
    
    let tentativas = 0;
    const loginLoop = setInterval(() => {
        tentativas++;
        
        // Verifica se saímos do lobby (Y > 0)
        if (bot.entity && bot.entity.position.y > 0) {
            log("✅ SUCESSO! Entramos no mundo principal.");
            clearInterval(loginLoop);
            
            setTimeout(() => {
                bot.chat('/rtp');
                setTimeout(() => {
                    log("🏃 Andando 10 blocos...");
                    bot.setControlState('forward', true);
                    setTimeout(() => {
                        bot.setControlState('forward', false);
                        log("📍 Parei. Coordenadas: " + bot.entity.position.toString());
                    }, 3000);
                }, 5000);
            }, 3000);
            return;
        }

        // --- AÇÕES PARA BULAR ANTI-BOT ---
        // 1. Girar a cabeça aleatoriamente
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
        
        // 2. Tentar clicar em qualquer item que esteja na mão ou no menu
        if (bot.inventory && bot.inventory.items().length > 0) {
            log("📦 Tentando clicar em itens do menu/inventário...");
            bot.activateItem(); // Clica com o item da mão
        }

        // 3. Enviar comandos de acesso
        log(`🔑 Tentativa ${tentativas}: Enviando /registrar e /logar`);
        bot.chat(`/registrar ${SENHA} ${SENHA}`);
        bot.chat(`/logar ${SENHA}`);

    }, 4000);
});

// Comandos via instrucao2.txt
setInterval(() => {
    if (fs.existsSync('instrucao2.txt')) {
        let ordem = fs.readFileSync('instrucao2.txt', 'utf8').trim();
        if (ordem) {
            log(`📥 Comando: ${ordem}`);
            bot.chat(ordem.startsWith('#') ? '/' + ordem.slice(1) : ordem);
            fs.unlinkSync('instrucao2.txt');
        }
    }
}, 500);

bot.on('kicked', (reason) => log(`❌ KICKADO: ${reason}`));
bot.on('error', (err) => log(`❌ ERRO: ${err.message}`));
bot.on('end', () => log("🔴 Bot caiu."));