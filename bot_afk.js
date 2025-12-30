const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const goals = require('mineflayer-pathfinder').goals;
const fs = require('fs');

// CONFIGURAÇÃO FIXA PARA TESTE
const CONFIG = {
    host: 'bawmc.net',
    username: 'deusafk975', 
    version: '1.20.1',
    auth: 'offline'
};
const MINHA_SENHA = "anime30rr";

function registrarComPos(bot, msg) {
    const pos = bot.entity ? bot.entity.position : { x: 0, y: 0, z: 0 };
    const coordStr = `XYZ: ${pos.x.toFixed(0)}, ${pos.y.toFixed(0)}, ${pos.z.toFixed(0)}`;
    console.log(`[${CONFIG.username}] [${coordStr}] ${msg}`);
}

let bot;

function createBot() {
    bot = mineflayer.createBot(CONFIG);
    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        registrarComPos(bot, "🟢 Spawnado! Tentando REGISTRAR primeiro...");
        
        setTimeout(() => {
            // Tenta registrar primeiro para garantir
            bot.chat(`/registrar ${MINHA_SENHA} ${MINHA_SENHA}`);
            
            setTimeout(() => {
                // Tenta logar logo em seguida
                bot.chat(`/logar ${MINHA_SENHA}`);
                registrarComPos(bot, "🔐 Comandos de auth enviados.");

                // Checagem de saída do Limbo (Y: -7)
                setTimeout(() => {
                    if (bot.entity.position.y < 0) {
                        registrarComPos(bot, "❌ Ainda preso no Limbo. Tentando /logar de novo...");
                        bot.chat(`/logar ${MINHA_SENHA}`);
                    } else {
                        registrarComPos(bot, "✅ SUCESSO! Indo para o NPC...");
                        bot.pathfinder.setGoal(new goals.GoalBlock(-1, 63, 14));
                        
                        // Sequência AFK
                        setTimeout(() => {
                            const npc = bot.nearestEntity(e => e.name === 'player' || e.name === 'npc');
                            if (npc) bot.activateEntity(npc);

                            setTimeout(() => {
                                bot.chat('/afk');
                                registrarComPos(bot, "💤 AFK Ativo.");
                                setInterval(() => { bot.chat('/money'); }, 300000);
                            }, 5000);
                        }, 10000);
                    }
                }, 6000);
            }, 3000);
        }, 2000);
    });

    bot.on('end', (reason) => {
        console.log(`🔴 Desconectado: ${reason}. Reiniciando...`);
        setTimeout(createBot, 10000);
    });

    bot.on('error', err => console.log(`❌ Erro: ${err.message}`));
}

createBot();