import subprocess
import time

# Lista de bots: [NICK, SENHA]
BOTS = [
    ["deusafk975", "anime30rr"],
    ["olouco_afk_2", "anime30rr"],
    ["olouco_afk_3", "anime30rr"]
]

def iniciar_bots():
    for bot in BOTS:
        print(f"🚀 Iniciando {bot[0]}...")
        # O comando abaixo envia o NICK e a SENHA para o bot_afk.js
        subprocess.Popen(["node", "bot_afk.js", bot[0], bot[1]])
        time.sleep(15) 

if __name__ == "__main__":
    iniciar_bots()