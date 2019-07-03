#!/usr/bin/env python
# coding: utf-8

# In[1]:


import json
import pika
import uuid
import threading 
import datetime
import time
import logging
import random
import requests
import os
from enum import Enum
from flask import Flask, request
from pymessenger import Element, Button
from requests_toolbelt import MultipartEncoder
from pymessenger import utils


# In[2]:


class NotificationType(Enum):
    regular = "REGULAR"
    silent_push = "SILENT_PUSH"
    no_push = "NO_PUSH"


# In[3]:


def verify_fb_token(token_sent):
    if token_sent == VERIFY_TOKEN:
        return request.args.get("hub.challenge")
    return 'Verificacion de token invalida'


# In[4]:


def enviarNucleo(recipient_id, id_face, mensaje):
    global connection
    global channel
    global result
    global callback_queue
    global response
    global corr_id
        
    cont=0
    content=' '
    type_resp=' '
    if "postback" in mensaje[0]:
        content=mensaje[0]["postback"]["payload"]
        type_resp="postback"
    elif "message" in mensaje[0]:
        content=mensaje[0]["message"]["text"]
        type_resp="message"

    
    entidad={}
    estado = "none"
    tipo="none"
    opciones="none"            
        
    n=  {"payload": [{"robot":" ","id_face":" ","recipient_id":" ","access_token":" ","content":" ","type_resp":" ","state":" ", "blocktype":" ", "opciones":" ", "entitites":" "}]}
    data=json.dumps(n)
    decoded=json.loads(data)
    decoded["payload"][0]["robot"]="none"
    decoded["payload"][0]["id_face"]=id_face
    decoded["payload"][0]["access_token"]="none"
    decoded["payload"][0]["recipient_id"]=recipient_id
    decoded["payload"][0]["content"]=content
    decoded["payload"][0]["type_resp"]=type_resp
    decoded["payload"][0]["state"]=estado
    decoded["payload"][0]["blocktype"]=tipo
    decoded["payload"][0]["opciones"]=opciones
    decoded["payload"][0]["entities"]= entidad
    data_string=json.dumps(decoded)
    print('\n_________________________________________________________________________________________________________________________')
    print('Mensaje enviado al Nucleo Logico-> ',data_string)
    corr_id = str(uuid.uuid4())
    channel.basic_publish(exchange='',
                                routing_key='chatbotVB101',
                                properties=pika.BasicProperties(
                                        reply_to = callback_queue,
                                        correlation_id = corr_id,
                                        ),
                                body=str(data_string))


# In[5]:


def send_message(payload,access_token):
    api_version = 2.6
    graph_url = 'https://graph.facebook.com/v{0}'.format(api_version)
    request_endpoint = '{0}/me/messages'.format(graph_url)
    auth = {'access_token': access_token}
    print('\n_________________________________________________________________________________________________________________________')
    print('Mensaje enviado a la API de  Facebook')
    print('request_endpoint-> ',request_endpoint)
    print('ruta->',auth)
    print('payload-> ',payload)        
    response = requests.post(
        request_endpoint,
        params=auth,
        json=payload
    )
    result = response.json()
    return result


# In[6]:


def text_message(recipient_id, response,access_token):
    payload={'message': {'text': response}, 'recipient': {'id': recipient_id}, 'notification_type': 'REGULAR'}
    respuesta=send_message(payload,access_token)
    return "success"


# In[7]:


def button_message(recipient_id,content,options,access_token):
    buttons = []
    cont=0
    for opc in options:
        button = Button(title=opc, type='postback', payload=opc)
        buttons.append(button)
        cont=cont+1
        if cont>2:
            break
    
    payload={'message': {'attachment': {'type': 'template', 'payload': {'template_type': 'button', 'text': content, 'buttons': buttons}}}, 'recipient': {'id': recipient_id}, 'notification_type': 'REGULAR'}
    
    result=send_message(payload,access_token)
    assert type(result) is dict
    assert result.get('message_id') is not None
    assert result.get('recipient_id') is not None


# In[8]:


def slide_message(recipient_id,content,access_token):
    buttons =[]
    elements=[]
    element={'title':'', 'image_url':'', 'subtitle':'', 'buttons':[]}
    cont=0
    
    for data in content: 
        buttons =[]
        for btn in data['buttons']:
            if btn['typeButton']=='web_url':
                button = Button(title=btn['titleButton'], type='web_url', url=btn['urlButton'])                
            elif btn['typeButton']=='postback':
                button = Button(title=btn['titleButton'], type='postback', payload=btn['payloadButton'])
            buttons.append(button)
            cont=cont+1
            if cont>2:
                break
        element={'title':data['title'], 'image_url':data['image_url'], 'subtitle':data['subtitle'], 'buttons':buttons}
        elements.append(element)   
    
    payload={"recipient": {"id":recipient_id}, "message":{"attachment": {"type":"template", "payload": {"template_type":"generic", "elements":elements}}}, 'notification_type': 'REGULAR'}
    
    result=send_message(payload,access_token)
    assert type(result) is dict
    assert result.get('message_id') is not None
    assert result.get('recipient_id') is not None


# In[ ]:


def ticket_message(recipient_id,content,access_token):
    payload={"recipient":{"id":recipient_id},"message":{"attachment":{"type":"template","payload":content}}}
    
    result=send_message(payload,access_token)
    assert type(result) is dict
    assert result.get('message_id') is not None
    assert result.get('recipient_id') is not None


# In[ ]:


def conv(msj):
    ans=' '
    contenido=msj["Respuesta"][0]["content"]
    estado=msj["Respuesta"][0]["payload"][0]["state"]
    entidad= msj["Respuesta"][0]["payload"][0]["entities"]
    tipo= msj["Respuesta"][0]["blockType"]
    recipient_id=msj['Respuesta'][0]['payload'][0]['recipient_id']
    access_token=msj['Respuesta'][0]['payload'][0]['access_token']
    #print(str(contenido))
       
    if(tipo=="quickReply" or tipo=="quickReplyDinamico"):
        button_message(recipient_id, contenido, msj["Respuesta"][0]["options"],access_token)
        return entidad, ans, estado, tipo, msj["Respuesta"][0]["options"]
        
    elif(tipo=="input" or tipo=="inputDinamico"):
        text_message(recipient_id, contenido,access_token)
        return entidad, ans, estado, tipo, 'vacio'
        
    elif(tipo=="informativo" or tipo=="informativoDinamico"):
        text_message(recipient_id, contenido,access_token)
        return entidad, str('next'), estado, tipo, 'vacio'
    
    elif(tipo=="slide" or tipo=="slideBuy" or tipo=="slideDinamico"):
        slide_message(recipient_id, contenido,access_token)
        return entidad, str('next'), estado, tipo, 'vacio'
    elif(tipo=="ticket"):
        ticket_message(recipient_id, contenido,access_token)
        return entidad, str('next'), estado, tipo, 'vacio'
    else:
        return entidad, str('hey'), estado, tipo, 'vacio'


# In[ ]:


class Nucleo_Cliente(threading.Thread):
    def __init__(self, nombreHilo):        
        threading.Thread.__init__(self, name=nombreHilo, target=Nucleo_Cliente.run)
        self.nombrehilo=nombreHilo
        
    def run(self):
        response = self.call()
        print(" [.] Got %r", response)              
        
    def on_response(self, ch, method, props, body):
        global response
        global corr_id
        if corr_id == props.correlation_id:
            response = body
            
    def call(self):
        global connection
        global channel
        global result
        global callback_queue
        global response
        
        cont=0
        while(cont>=0):
            response = None
            while response is None:
                connection.process_data_events()
            
            if len(response)>10:
                data = json.loads(response)
                print('\n_________________________________________________________________________________________________________________________')
                print('Respuesta del Nucleo Logico-> ',data)
                entidad, resp, estado, tipo, opciones= conv(data)


# In[ ]:


N_C=Nucleo_Cliente("Hilo_2")
response=None
corr_id=' '
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
result = channel.queue_declare(exclusive=True)
callback_queue = result.method.queue
channel.basic_consume(N_C.on_response, no_ack=True, queue=callback_queue)
N_C.start()

app = Flask(__name__)
VERIFY_TOKEN = 'CadenaDeVerificacion10'

@app.route("/", methods=['GET', 'POST'])
def receive_message():
    if request.method == 'GET':
        token_sent = request.args.get("hub.verify_token")
        return verify_fb_token(token_sent)
    else:
        output = request.get_json()
        print('\n_________________________________________________________________________________________________________________________')
        print("Mesaje de la API de Facebook-> ",output)
        for event in output['entry']:
            messaging = event['messaging']
            id_face = event['id']
            for message in messaging:
                if message.get('message') or message.get('postback'):
                    recipient_id = message['sender']['id']                 
                    enviarNucleo(recipient_id, id_face, messaging)
    
    return "Message Processed"
        

if __name__ == "__main__":
    app.run()


# In[ ]:




