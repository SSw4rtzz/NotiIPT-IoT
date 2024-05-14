from flask import Flask, jsonify
import random
import time
import threading

app = Flask(__name__)

# Função para gerar valores aleatórios
def generate_random_values():
    while True:
        temperatura = random.uniform(10, 40)  # Temperatura entre 10°C e 40°C
        humidade = random.uniform(30, 70)      # Humidade entre 30% e 70%
        luminosidade = random.uniform(0, 100)  # Luminosidade entre 0% e 100%
        
        # Atualiza os valores a cada 10 segundos
        time.sleep(10)
        
        # Mostra os valores gerados
        print("Temperatura:", temperatura, "°C")
        print("Humidade:", humidade, "%")
        print("Luminosidade:", luminosidade, "%")
        print("-------------------------")

# Rota para obter os valores atuais
@app.route('/')
def get_values():
    # Aqui poderia retornar os valores gerados em formato JSON
    return jsonify({
        "temperatura": random.uniform(10, 40),
        "humidade": random.uniform(30, 70),
        "luminosidade": random.uniform(0, 100)
    })

# Configuração do CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    # Inicia a thread para gerar os valores aleatórios
    threading.Thread(target=generate_random_values).start()
    
    # Inicia o servidor Flask
    app.run()
