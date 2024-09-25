import os
from fastapi import HTTPException, status
from email.message import EmailMessage
import aiosmtplib

from models.pedidos import PedidoResponse

EMAIL_USERNAME = os.environ.get("EMAIL_USERNAME")
EMAIL_SENHA = os.environ.get("EMAIL_SENHA")
EMAIL_HOSTNAME = os.environ.get("EMAIL_HOSTNAME")

def criar_email(pedido: PedidoResponse, chave_pix: str):
    return f'''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmação de Pedido</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
            <style>
                body {{
                    font-family: 'Poppins', Arial, sans-serif;
                    background-color: #e5e7eb;
                    color: #111827;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 20px auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }}
                .header {{
                    background-color: #E7191F;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }}
                .content {{
                    padding: 20px;
                }}
                .content h2 {{
                    color: #E7191F;
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }}
                .product {{
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }}
                .product p {{
                    margin: 5px 0;
                    color: #111827;
                }}
                .adicionais {{
                    color: #fb923c;
                }}
                .pix-info {{
                    margin-top: 20px;
                    padding: 10px;
                    background-color: #facc15;
                    border-radius: 8px;
                    text-align: center;
                }}
                .pix-info p {{
                    margin: 10px 0;
                    color: #111827;
                    font-size: 16px;
                    font-weight: 600;
                    word-break: break-all;
                }}
                .pix-info .total {{
                    font-size: 18px;
                    color: #22c55e;
                }}
                .pix-info img {{
                    margin-top: 10px;
                    width: 150px;
                    height: 150px;
                    border: 1px solid #111827;
                    border-radius: 4px;
                }}
                .footer {{
                    background-color: #facc15;
                    padding: 10px;
                    text-align: center;
                    font-size: 14px;
                    color: #111827;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Pedido Confirmado!</h1>
                </div>
                <div class="content">
                    <h2>Olá, {pedido.nome_usuario}</h2>
                    <p>Seu pedido n°<strong>{pedido.id}</strong> foi confirmado em {pedido.horario_pedido.strftime('%d/%m/%Y %H:%M')}.</p>
                    <div>
                        {''.join([f'''
                            <div class="product">
                                <p><strong>Produto:</strong> {produto.nome_produto} {f"({produto.tamanho})" if produto.tamanho else ""}</p>
                                <p><strong>Quantidade:</strong> {produto.quantidade}</p>
                                <p><strong>Preço:</strong> R$ {produto.preco:.2f}</p>
                                {'<p class="adicionais"><strong>Adicionais:</strong></p><ul>' + ''.join([f'<li>{adicional}</li>' for adicional in produto.adicionais]) + '</ul>' if produto.adicionais else ''}
                            </div>
                        ''' for produto in pedido.produtos])}
                    </div>
                    <div class="pix-info">
                        <p>Valor total: <span class="total">R$ {pedido.total:.2f}</span></p>
                        <p>Chave PIX: <strong>{chave_pix.payload}</strong></p>
                    </div>
                </div>
                <div class="footer">
                    <p>Esta pizzaria é fictícia. O pagamento não terá efeito.</p>
                </div>
            </div>
        </body>
        </html>
    '''



async def send_email(subject: str, body: str, to: str, fallback: str):
    # Criação da mensagem de e-mail
    message = EmailMessage()
    message["From"] = f"Pizzaria Borcelle<{EMAIL_USERNAME}>"
    message["To"] = to
    message["Subject"] = subject
    message.set_content(fallback)
    message.add_alternative(body, subtype="html")
    
    # Envio do e-mail
    
    try:
        response = await aiosmtplib.send(
            message,
            hostname=EMAIL_HOSTNAME,  # Coloque o servidor SMTP
            port=587,
            username=EMAIL_USERNAME,
            password=EMAIL_SENHA,
            start_tls=True,
        )
        return response

    except aiosmtplib.SMTPException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Falha no envio do e-mail: {str(e)}")
