import crcmod

class Payload():
    def __init__(self, chavepix, txtId, valor, nome, cidade):
        self.chavepix = chavepix
        self.valor = valor
        self.txtId = txtId

        self.chavepix_tam = len(self.chavepix)
        self.txtId_tam = len(self.txtId)

        self.merchantAccount_tam = f'0014BR.GOV.BCB.PIX01{self.chavepix_tam:02}{self.chavepix}'
        self.transactionAmount_tam = f'{str(len(f"{self.valor:.2f}")).zfill(2)}{self.valor:.2f}'

        self.addDataField_tam = f'05{self.txtId_tam:02}{self.txtId}'

        # Partes do payload
        self.payloadFormat = '000201'
        self.merchantAccount = f'26{len(self.merchantAccount_tam):02}{self.merchantAccount_tam}'
        self.merchantCategCode = '52040000'
        self.transactionCurrency = '5303986'
        self.transactionAmount = f'54{self.transactionAmount_tam}'
        self.countryCode = '5802BR'
        self.merchantName = f'59{len(nome):02}{nome}'
        self.merchantCity = f'60{len(cidade):02}{cidade}'
        self.addDataField = f'62{len(self.addDataField_tam):02}{self.addDataField_tam}'
        self.crc16 = '6304'

    def gerarPayload(self):
        self.payload = f'{self.payloadFormat}{self.merchantAccount}{self.merchantCategCode}{self.transactionCurrency}{self.transactionAmount}{self.countryCode}{self.merchantName}{self.merchantCity}{self.addDataField}{self.crc16}'
        self.gerarCrc16(self.payload)
        return self.payload_completa

    def gerarCrc16(self, payload):
        crc16 = crcmod.mkCrcFun(poly=0x11021, initCrc=0xFFFF, rev=False, xorOut=0x0000)

        self.crc16Code = hex(crc16(payload.encode('utf-8')))
        self.crc16Code_formatado = str(self.crc16Code).replace('0x', '').upper()

        self.payload_completa = f'{payload}{self.crc16Code_formatado}'
