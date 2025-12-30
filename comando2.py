import os

def enviar_comando():
    print("--- CONTROLE REMOTO BOT 2 ---")
    print("Digite o comando (ex: #registrar senha senha ou #logar senha)")
    print("Digite 'sair' para fechar.")
    
    while True:
        ordem = input("Comando > ")
        
        if ordem.lower() == 'sair':
            break
            
        # Escreve no ficheiro que o bot2.js está a ler
        with open("instrucao2.txt", "w") as f:
            f.write(ordem)
            
        print(f"✅ Enviado: {ordem}")

if __name__ == "__main__":
    enviar_comando()