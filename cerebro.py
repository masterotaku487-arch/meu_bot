import os, time, subprocess
from datetime import datetime

ORDEM_FILE = "instrucao.txt"
LOG_FILE = "aprendizado.log"

def loop_simples():
    print("=" * 40)
    print("🤖 MODO MONITORAMENTO (SEM IA)")
    print("=" * 40)
    
    # Inicia o bot
    subprocess.Popen(["node", "bot.js"])

    while True:
        try:
            # Mostra as últimas 2 linhas do log para você ver as coordenadas
            if os.path.exists(LOG_FILE):
                with open(LOG_FILE, 'r') as f:
                    linhas = f.readlines()
                    if linhas:
                        print(f"📡 LOG: {linhas[-1].strip()}")
            
            entrada = input("\n💬 Comando manual (ou Enter para atualizar): ").strip()
            
            if entrada:
                with open(ORDEM_FILE, "w") as f:
                    f.write(entrada if entrada.startswith('/') or entrada.startswith('#') else f"#{entrada}")
                print(f"✅ Enviado: {entrada}")
            
            time.sleep(2)
        except KeyboardInterrupt: break

if __name__ == "__main__":
    loop_simples()