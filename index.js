const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalBlock } = require('mineflayer-pathfinder').goals;
const http = require('http');

// Porta necessária para o Koyeb aceitar o bot
http.createServer((req, res) => {
    res.write("Bot AFK Online");
    res.end();
}).listen(8080);

const CONFIG = {
    host: 'bawmc.net',
    username: 'olouco_afk_8890',
    version: '1.20.1',
    auth: 'offline'
};

const SENHA = "anime30rr";

function registrar(msg) {
    const timestamp = new Date().toLocaleTimeString();
    const pos = (bot && bot.entity) ? `[${bot.entity.position.x.toFixed(0)}, ${bot.entity.position.y.toFixed(0)}, ${bot.entity.position.z.toFixed(0)}]` : '[Lobby]';
    console.log(`[${timestamp}] ${pos} ${msg}`);
}

let bot;
function createBot() {
    bot = mineflayer.createBot(CONFIG);
    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        registrar("✅ Conectado! Logando...");
        setTimeout(() => {
            bot.chat(`/login ${SENHA}`);
            setTimeout(() => {
                registrar("🏃 Indo para o NPC...");
                bot.pathfinder.setGoal(new GoalBlock(-1, 63, 14));
            }, 5000);
        }, 2000);
    });

    bot.on('end', () => {
        registrar("🔴 Caiu! Reconectando em 10s...");
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => registrar(`❌ Erro: ${err.message}`));
}

createBot();
