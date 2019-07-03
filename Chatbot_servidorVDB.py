#!/usr/bin/env python
# coding: utf-8

# In[1]:


import json
import pika
import uuid
import sys
import pybars
import requests
import psycopg2


# In[2]:


#-------------------Conexión con la base de datos de Chatblocks -------------------
DNS="host='localhost' dbname='ChatBlocksVF' user='postgres' password='2011080606'"
con=psycopg2.connect(DNS)
cur=con.cursor()


# In[3]:


def consulta(query):
    global cur
    cur.execute(query)
    dato=cur.fetchone()
    return dato


# In[4]:


def consulta2(query):
    global cur
    cur.execute(query)
    dato=cur.fetchall()
    return dato


# In[5]:


def insertar(query):
    global cur
    global con
    cur.execute(query)
    con.commit()


# In[6]:


def cerrarConexionDB():
    global cur
    global con
    cur.close()
    con.close()


# In[7]:


#-----PASO 9. Variante 1: Creación de la respuesta que pertenece a un bloque simple: Informativo-----
def mensInf(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
    
    #-------PASO 9. Variante 1: Consultas a la base de datos para la creación de la respuesta--------        
    decoded["Respuesta"][0]["content"] = str(consulta("select contenido from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["next_id"] = str(consulta("select next_id from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["blockType"]= str(consulta("select blockType from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["contentType"]= str(consulta("select contentType from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["typingTime"]= str(consulta("select typingTime from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='informativo' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #----------------------PASO 10. Inicio: Retorno de la respuesta generada----------------------
    return decoded


# In[8]:



def mensInfDatosU(mensaje,content):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
    
    decoded["Respuesta"][0]["content"] = str(content)
    decoded["Respuesta"][0]["blockType"]= 'informativo'
    decoded["Respuesta"][0]["contentType"]= 'text'
    decoded["Respuesta"][0]["typingTime"]= 1
    
    payload={"content":"","recipient_id":mensaje["payload"][0]["recipient_id"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    return decoded


# In[9]:


#-----PASO 9. Variante 1: Creación de la respuesta que pertenece a un bloque simple: QuickReply-----
def mensQr(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
    
    #-------PASO 9. Variante 1: Consultas a la base de datos para la creación de la respuesta--------
    opc=(consulta2("select opciones from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    opciones=opc[0].split(",")
        
    decoded["Respuesta"][0]["content"] = str(consulta("select contenido from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["options"] = opciones
    decoded["Respuesta"][0]["next_id"] = str(consulta("select next_id from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["blockType"]= str(consulta("select blockType from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["typingTime"]= str(consulta("select typingTime from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["default_id"] = str(consulta("select default_id from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["save_var"] = str(consulta("select save_var from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='quickReply' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #----------------------PASO 10. Inicio: Retorno de la respuesta generada----------------------
    return decoded


# In[10]:


#-----PASO 9. Variante 1: Creación de la respuesta que pertenece a un bloque simple: Input-----
def mensInp(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
    
    #-------PASO 9. Variante 1: Consultas a la base de datos para la creación de la respuesta--------
    decoded["Respuesta"][0]["content"] = str(consulta("select contenido from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["next_id"] = str(consulta("select next_id from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["blockType"]= str(consulta("select blockType from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["contentType"]= str(consulta("select contentType from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["typingTime"]= str(consulta("select typingTime from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["validacion"]= str(consulta("select validacion from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["Default_id"] = str(consulta("select default_id from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["save_var"] = str(consulta("select save_var from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='input' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #----------------------PASO 10. Inicio: Retorno de la respuesta generada----------------------
    return decoded


# In[11]:


#-----PASO 9. Variante 1: Creación de la respuesta que pertenece a un bloque simple: Slide-----
def mensSlide(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
    
    #-------PASO 9. Variante 1: Consultas a la base de datos para la creación de la respuesta--------
    id_block,next_id,blocktype,typingtime,default_id,save_var=consulta("select id_block,next_id,blocktype,typingtime,default_id,save_var from bloqueslide where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")
    data_elements=consulta2("select * from elementos where id_block='"+str(id_block)+"' and blocktype='slide'")
    
    
    elements=[]
    
    for element in data_elements:
        for elm in element:
            print('Elemento-> ',elm)
        
        buttons =[]    
        data_buttons=consulta2("select * from botones where id_elemento='"+str(element[5])+"'")
        for btn in data_buttons:
            if btn[2]=='postback':
                button={'titleButton':btn[1],'typeButton':'postback','payloadButton':btn[3]}
            if btn[2]=='web_url':
                button={'titleButton':btn[1],'typeButton':'web_url','urlButton':btn[3]}
            buttons.append(button)                
        data={'title':element[1], 'image_url':element[2], 'subtitle':element[3], 'buttons':buttons}
        elements.append(data)
    
    opciones=next_id.split(",")
        
    decoded["Respuesta"][0]["content"] = elements
    decoded["Respuesta"][0]["next_id"] = opciones
    decoded["Respuesta"][0]["blockType"]= str(blocktype)    
    decoded["Respuesta"][0]["typingTime"]= str(typingtime)
    decoded["Respuesta"][0]["default_id"] = str(default_id)
    decoded["Respuesta"][0]["save_var"] = str(save_var)
    
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='slide' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #----------------------PASO 10. Inicio: Retorno de la respuesta generada----------------------
    return decoded


# In[12]:


#-----PASO 9. Variante 1: Creación de la respuesta que pertenece a un bloque simple: SlideBuy-----
def mensSlideBuy(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
    
    #-------PASO 9. Variante 1: Consultas a la base de datos para la creación de la respuesta--------
    id_block,next_id,blocktype,typingtime,default_id,save_var=consulta("select id_block,next_id,blocktype,typingtime,default_id,save_var from bloqueslidebuy where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")
    data_elements=consulta2("select * from elementosbuy where id_block='"+str(id_block)+"'")
    elements=[]
    
    for element in data_elements:
        buttons =[]
        button={'titleButton':'Comprar','typeButton':'postback','payloadButton':element[0]}
        buttons.append(button)       
        subT=element[6]+'.  Precio: $'+element[7]
        data={'title':element[4], 'image_url':element[5], 'subtitle':subT, 'buttons':buttons}
        elements.append(data)
    
    decoded["Respuesta"][0]["content"] = elements
    decoded["Respuesta"][0]["next_id"] = str(next_id)
    decoded["Respuesta"][0]["blockType"]= str(blocktype)    
    decoded["Respuesta"][0]["typingTime"]= str(typingtime)
    decoded["Respuesta"][0]["default_id"] = str(default_id)
    decoded["Respuesta"][0]["save_var"] = str(save_var)
    
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='slideBuy' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #----------------------PASO 10. Inicio: Retorno de la respuesta generada----------------------
    return decoded


# In[13]:


#-----PASO 9. Variante 1: Creación de la respuesta que pertenece a un bloque simple: Ticket-----
def mensTicket(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
    
    #-------PASO 9. Variante 1: Consultas a la base de datos para la creación de la respuesta--------
    dataTicket=consulta2("select * from bloqueticket where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    rescue_var=dataTicket[7].split(",")
    id_blockT=consulta("select id_block from bloqueslidebuy where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+rescue_var[1]+"'")[0]
    
    elements=[]
    subtotal=0
    for obj in mensaje["payload"][0]["entities"][rescue_var[0]]:
        data_elements=consulta2("select * from elementosbuy where id_busqueda='"+obj+"' and id_block='"+id_blockT+"'")[0]
        subtotal=subtotal+float(data_elements[7])*int(mensaje["payload"][0]["entities"][rescue_var[0]][obj])
        data={'title':data_elements[4],'subtitle':data_elements[6],'quantity':mensaje["payload"][0]["entities"][rescue_var[0]][obj],'price':data_elements[7],'currency':dataTicket[6],'image_url':data_elements[5]}
        elements.append(data)
        
    total=subtotal+float(dataTicket[8])+float(dataTicket[9])        
    summary={"subtotal":subtotal,"shipping_cost":float(dataTicket[8]),"total_tax":float(dataTicket[9]),"total_cost":total}
    address={"street_1":mensaje["payload"][0]["entities"][dataTicket[10]],"street_2":mensaje["payload"][0]["entities"][dataTicket[11]],"city":mensaje["payload"][0]["entities"][dataTicket[12]],"postal_code":mensaje["payload"][0]["entities"][dataTicket[13]],"state":mensaje["payload"][0]["entities"][dataTicket[14]],"country":mensaje["payload"][0]["entities"][dataTicket[15]]}
    content={"template_type":"receipt","recipient_name":mensaje["payload"][0]["entities"][dataTicket[17]],"order_number":"12345678902","currency":dataTicket[6],"payment_method":mensaje["payload"][0]["entities"][dataTicket[16]],"address":address,"summary":summary,"elements":elements}
    
    decoded["Respuesta"][0]["content"] = content
    decoded["Respuesta"][0]["next_id"] = str(dataTicket[3])
    decoded["Respuesta"][0]["blockType"]= str(dataTicket[4])    
    decoded["Respuesta"][0]["typingTime"]= str(dataTicket[5])
    
    mensaje["payload"][0]["entities"]={}
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='ticket' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #----------------------PASO 10. Inicio: Retorno de la respuesta generada----------------------
    return decoded


# In[14]:


#-----PASO 9. Variante 2: Creación de la respuesta que pertenece a un bloque dinámico: Informativo-----
def mensInfDin(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    
    id_bloque=consulta("select id_block from bloqueinfodinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    links=consulta2("select links from linksapis where id_block='"+str(id_bloque)+"' and blocktype='informativoDinamico'")
    name=consulta2("select namecredencial from credencialesapis where id_block='"+str(id_bloque)+"' and blocktype='informativoDinamico'")
    cr=consulta2("select credencial from credencialesapis where id_block='"+str(id_bloque)+"' and blocktype='informativoDinamico'")
    contenido=consulta("select contenido from bloqueinfodinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    credenciales={}
    cont=0
    for nm in name:
        credenciales[nm[0]]=cr[cont][0]        
        cont=cont+1
    #----------------PASO 9. Variante 2: Consulta a una API para obtener su información----------------
    respAPI=consultarAPIs(links, credenciales, mensaje["payload"][0]["entities"])
    output=ingresarVar(contenido, "",mensaje["payload"][0]["entities"])
    #---PASO 9. Variante 2: Aplica handlebars para el procesamiento y la creacion del contenido de la respuesta---
    content=crearRespuesta(output, respAPI, mensaje["payload"][0]["entities"])
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
        
    decoded["Respuesta"][0]["content"] = content   
    decoded["Respuesta"][0]["next_id"] = str(consulta("select next_id from bloqueinfodinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["blockType"]= str(consulta("select blockType from bloqueinfodinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["contentType"]= str(consulta("select contentType from bloqueinfodinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["typingTime"]= str(consulta("select typingTime from bloqueinfodinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='informativoDinamico' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #-----------------------PASO 10. Inicio: Retorno de la respuesta generada-----------------------
    return decoded


# In[15]:


#-----PASO 9. Variante 2: Creación de la respuesta que pertenece a un bloque dinámico: Input-----
def mensInpDin(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    
    id_bloque=consulta("select id_block from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    save_var=consulta("select save_var from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    links=consulta2("select links from linksapis where id_block='"+str(id_bloque)+"' and blocktype='inputDinamico'")
    name=consulta2("select namecredencial from credencialesapis where id_block='"+str(id_bloque)+"' and blocktype='inputDinamico'")
    cr=consulta2("select credencial from credencialesapis where id_block='"+str(id_bloque)+"' and blocktype='inputDinamico'")
    contenido=consulta("select contenido from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    credenciales={}
    cont=0
    for nm in name:
        credenciales[nm[0]]=cr[cont][0]        
        cont=cont+1
    #----------------PASO 9. Variante 2: Consulta a una API para obtener su información----------------
    respAPI=consultarAPIs(links, credenciales, mensaje["payload"][0]["entities"])
    output=ingresarVar(contenido, save_var, mensaje["payload"][0]["entities"])
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
        
    decoded["Respuesta"][0]["content"] = output   
    decoded["Respuesta"][0]["next_id"] = str(consulta("select next_id from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["blockType"]= str(consulta("select blockType from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["contentType"]= str(consulta("select contentType from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["typingTime"]= str(consulta("select typingTime from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["validacion"]= str(consulta("select validacion from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["Default_id"] = str(consulta("select default_id from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["save_var"] = str(consulta("select save_var from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='inputDinamico' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #-----------------------PASO 10. Inicio: Retorno de la respuesta generada-----------------------
    return decoded


# In[16]:


#-----PASO 9. Variante 2: Creación de la respuesta que pertenece a un bloque dinámico: QuickReply-----
def mensQRDin(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    
    id_bloque=consulta("select id_block from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    links=consulta2("select links from linksapis where id_block='"+str(id_bloque)+"' and blocktype='quickReplyDinamico'")
    name=consulta2("select namecredencial from credencialesapis where id_block='"+str(id_bloque)+"' and blocktype='quickReplyDinamico'")
    cr=consulta2("select credencial from credencialesapis where id_block='"+str(id_bloque)+"' and blocktype='quickReplyDinamico'")    
    credenciales={}
    cont=0
    for nm in name:
        credenciales[nm[0]]=cr[cont][0]        
        cont=cont+1
        
    print("Datos bloque QR Dinamico=>")
    print("id_bloque-> ",id_bloque)
    print("links-> ",links)
    print("credenciales-> ",credenciales)
    #----------------PASO 9. Variante 2: Consulta a una API para obtener su información----------------
    respAPI=consultarAPIs(links, credenciales, mensaje["payload"][0]["entities"])
    #---PASO 9. Variante 2: Aplica handlebars para el procesamiento y la creacion del contenido de la respuesta---
    options=generarOpc(respAPI)
    options2=(((str(options).replace("'", "")).replace("[", "")).replace("]","")).replace(" ","")
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
        
    decoded["Respuesta"][0]["content"] = str(consulta("select contenido from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["options"] = options
    decoded["Respuesta"][0]["next_id"] = str(consulta("select next_id from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["blockType"]= str(consulta("select blockType from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])        
    decoded["Respuesta"][0]["typingTime"]= str(consulta("select typingTime from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["Default_id"] = str(consulta("select default_id from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["save_var"] = str(consulta("select save_var from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='quickReplyDinamico' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    insertar("update bloqueqrdinamico set opciones='"+options2+"' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #-----------------------PASO 10. Inicio: Retorno de la respuesta generada-----------------------
    return decoded


# In[17]:


#-----PASO 9. Variante 2: Creación de la respuesta que pertenece a un bloque dinámico: Slide-----
def mensSlideDin(state,mensaje):
    n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
    
    data_string = json.dumps(n)
    decoded = json.loads(data_string)
    
    id_bloque=consulta("select id_block from bloqueslidedinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    links=consulta2("select links from linksapis where id_block='"+str(id_bloque)+"' and blocktype='slideDinamico'")
    
    nameC=consulta2("select namecredencial from credencialesapis where id_block='"+str(id_bloque)+"' and blocktype='slideDinamico'")
    cr=consulta2("select credencial from credencialesapis where id_block='"+str(id_bloque)+"' and blocktype='slideDinamico'")
    contenido=consulta("select contenido from bloqueslidedinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0]
    #contenido='[{{#each stations}} {"title": "Estacion con id {{id}}", "image_url": "https://www.ecobici.cdmx.gob.mx/sites/default/files/u14/en_bicicletas-2.png", "subtitle": "Direccion = {{address}}" }, {{/each}}{"Fin":" "}]'
    credenciales={}
    cont=0
    for nm in nameC:
        credenciales[nm[0]]=cr[cont][0]     
        print(credenciales[nm[0]])
        cont=cont+1
    #----------------PASO 9. Variante 2: Consulta a una API para obtener su información----------------
    respAPI=consultarAPIs(links, credenciales, mensaje["payload"][0]["entities"])
    output=ingresarVar(contenido, "",mensaje["payload"][0]["entities"])
    #---PASO 9. Variante 2: Aplica handlebars para el procesamiento y la creacion del contenido de la respuesta---
    resp=crearRespuesta2(output, respAPI, mensaje["payload"][0]["entities"])
    options = json.loads(resp)

    content=[]
    if 'actual_pos' in mensaje["payload"][0]["entities"]:
        cont=mensaje["payload"][0]["entities"]['actual_pos']
    else:
        cont=0
        
    contAux=0
    while contAux<10:
        if cont<len(options):
            content.append(options[cont])
        else:
            cont=0
            content.append(options[cont])
        contAux=contAux+1
        cont=cont+1
        
    decoded["Respuesta"][0]["content"] = content
    decoded["Respuesta"][0]["next_id"] = str(consulta("select next_id from bloqueslidedinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])
    decoded["Respuesta"][0]["blockType"]= str(consulta("select blockType from bloqueslidedinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])    
    #decoded["Respuesta"][0]["contentType"]= str(consulta("select contentType from bloqueslidedinamico where id_robot='"+mensaje["payload"][0]["robot"]+"' and namestate='"+state+"'")[0])    
    decoded["Respuesta"][0]["typingTime"]= str(consulta("select typingTime from bloqueslidedinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'")[0])

    mensaje["payload"][0]["entities"]['actual_pos']=cont
    mensajeAct=str(mensaje["payload"][0]["entities"])
    insertar("update ticket set entities='"+mensajeAct.replace("'", '"')+"', estado_actual='"+state+"', block_type='slideDinamico' where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
    payload={"content":"","state":state,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
    pay=json.dumps(payload)
    decoded["Respuesta"][0]["payload"].append(json.loads(pay))
    #-----------------------PASO 10. Inicio: Retorno de la respuesta generada-----------------------
    return decoded


# In[18]:


#-------se generan las opciones para un QuickReply-------
def generarOpc(re):
    key=""
    if(len(re)>1):
        print("Mayor a 1")   
    else:
        for raiz in re:
            key=raiz
        opciones=list(re[key][0].keys())
    
    return opciones


# In[19]:


#-------Se busca y se ingresa las bariables contenidas en las "entities" en una cadena-------
def ingresarVar(content, nameVar, entities):
    prueba1={}
    prueba2={}
    principal=""    
    
    output, var=completarURLs(content, prueba1, prueba2, entities)
    if(nameVar!=""):
        entities[nameVar]=var        
    
    return output


# In[20]:


#-------Se genera el contenido de la respuesta mediante handlebars-------
def crearRespuesta2(content, re, entities):
    nameVar='vacio'
    cont=0
    cont2=0
    
    source = content
    #print('Source-> ',source)
    compiler = pybars.Compiler()
    template = compiler.compile(source)
    output = template(re)
    return output


# In[21]:


#-------Consulta a las APIs mediante operaciones de tipo GET-------
def consultarAPIs(links, tockens, entities):
    print("consultarAPIs-> ")
    print("links-> ", links)
    print("tockens-> ", tockens)
    print("entities-> ", entities)
    re={}
    prueba1={}
    prueba2={}
    if(len(links)>0): 
        for link in links:      
            #print("\n\nDatos enviados de consultarAPIs a completarURLs")
            #print("\n\nURl 1= ",links[link])
            #print("\n\nTockens = ",tockens)
            #print("\n\nConsulta 1= ",re)
            #print("\n\nEtidades 1= ",entities)
            urlF, var=completarURLs(link[0], tockens, re, entities)           
            r = requests.get(urlF)
            print(r);
            #print(urlF)
            re=r.json()  
    return re            


# In[22]:


#-------Se genera el contenido de la respuesta mediante handlebars-------
def crearRespuesta(content, re, entities):
    nameVar='vacio'
    cont=0
    cont2=0
    key=''
    if(len(re)>1):
        print('crearRespuesta-> if')
        source = content
        print('Source-> ',source)
        compiler = pybars.Compiler()
        template = compiler.compile(source)
        output = template(re)    
    else:
        print('crearRespuesta-> else')
        for raiz in re:
            key=raiz
        general=re[key]
        for var in entities:
            nameVar=var  
            cont=cont+1;
        for var in entities:
            cont2=cont2+1;
            if cont2<cont:
                nameVar2=var
        #print("general= ",general)
        print("nameVar= ",nameVar2)
        print("entities[nameVar]= ",entities[nameVar])
        #posicion=buscarDatos(general, nameVar2, entities[nameVar])
        posicion=buscarDatos(general, entities[nameVar2], entities[nameVar])
        print('template',re[key][posicion])
        source = content
        compiler = pybars.Compiler()
        template = compiler.compile(source)
        output = template(re[key][posicion]) 
    print('crearRespuesta-> ',output)
    return output


# In[23]:


#------------Función que completa los links mediante variables o credenciales-----------------------
def completarURLs(url, tockens, consulta, entities):
    pos1=1
    pos2=0
    posAux=0
    cadAux=url
    
    var=" "
    while(pos1>-1):
        if(posAux<len(url)):
            pos1=cadAux.find('{')
            pos2=cadAux.find('}')
            if(url[posAux+pos1+1]=='{' and pos1>-1): 
                cadAux=url[pos2+posAux+2:]
                token=url[posAux+pos1+2:pos2+posAux]
                if token in entities:
                    res=len(entities[token])-len(token)
                    url=url[:posAux+pos1+2]+entities[token]+url[pos2+posAux:]
                    posAux=pos1+posAux+res+2
                else:
                    posAux=pos2+posAux+2
            elif(pos1>-1):                                
                cadAux=url[pos2+posAux+1:]                
                token2=url[pos1+posAux+1:pos2+posAux]
                token=token2
                if token.lower() in tockens:
                    url=url[:pos1+posAux]+tockens[token.lower()]+url[pos2+1+posAux:]
                    cadAux=url[pos1+posAux:]
                    posAux=pos1+posAux
                if token.upper() in tockens:
                    url=url[:pos1+posAux]+tockens[token.upper()]+url[pos2+1+posAux:]
                    cadAux=url[pos1+posAux:]
                    posAux=pos1+posAux
                elif token.lower() in consulta:
                    url=url[:pos1+posAux]+consulta[token.lower()]+url[pos2+1+posAux:]
                    cadAux=url[pos1+posAux:]
                    posAux=pos1+posAux
                elif token.upper() in consulta:
                    url=url[:pos1+posAux]+consulta[token.upper()]+url[pos2+1+posAux:]
                    cadAux=url[pos1+posAux:]
                    posAux=pos1+posAux
                elif token2 in entities:
                    url=url[:pos1+posAux]+entities[token2]+url[pos2+1+posAux:]
                    cadAux=url[pos1+posAux:]
                    posAux=pos1+posAux
                else:
                    posAux=pos2+posAux+1
        else:
            pos1=-1
    print(url)
    return url, var


# In[ ]:


#-------Busqueda de datos en el JSON de la respuesta de las APIs-------
def buscarDatos(general, nameVar, dataVar): 
    cont=0    
    if nameVar in 'vacio' or dataVar in 'vacio':
        print("vacio")
    else:
        for dato in general:           
            if(type(dato[nameVar])==int):
                dataVar=int(dataVar)
            if(dato[nameVar]==dataVar):
                break       
            cont+=1
    return cont
        


# In[ ]:


#----------PASO 11. Se encola el mensaje de respuesta en RabbitMQ----------
def envia(ch,props, method, data_string):  
    ch.basic_publish(exchange='',
                 routing_key=props.reply_to,
                 properties=pika.BasicProperties(correlation_id = \
                                                     props.correlation_id),
                 body=str(data_string))
    ch.basic_ack(delivery_tag = method.delivery_tag)


# In[ ]:


#-----PASO 9. Función que verifica el tipo de bloque al que pertenece el siguiente estado-----
def confirma(ch,props, method, state, mensaje):
    cont=1
    data_string=' '
    print("Siguiente estado...", state)
    #-------PASO 9. Valdaciones del tipo de bloque al que pertenece el siguiente estado-------
    if((str(consulta("select blocktype from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        if(state=="Salida"):
            print("Terminando conversación...")
            cont=-100
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque informativo-------
        resp=mensInf(state,mensaje)
        #-------PASO 10. Bloque informativo como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)        

    elif((str(consulta("select blocktype from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque QuickReply-------
        resp=mensQr(state,mensaje)
        #-------PASO 10. Bloque QuickReply como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
    
    elif((str(consulta("select blocktype from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque Input-------
        resp=mensInp(state,mensaje)
        #-------PASO 10. Bloque Input como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
        
    elif((str(consulta("select blocktype from bloqueinfodinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque Informativo Dinámico-------
        resp=mensInfDin(state,mensaje)
        #-------PASO 10. Bloque informativo dinámico como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
        
    elif((str(consulta("select blocktype from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque Input Dinámico-------
        resp=mensInpDin(state,mensaje)
        #-------PASO 10. Bloque input dinámico como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
        
    elif((str(consulta("select blocktype from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque QuickReply Dinámico-------
        resp=mensQRDin(state,mensaje)
        #-------PASO 10. Bloque QuickReply dinámico como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
    
    elif((str(consulta("select blocktype from bloqueslide where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque Slide-------
        resp=mensSlide(state,mensaje)
        #-------PASO 10. Bloque Carrusel como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
    
    elif((str(consulta("select blocktype from bloqueslidebuy where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque Slide Buy-------
        resp=mensSlideBuy(state,mensaje)
        #-------PASO 10. Bloque Carrusel de compras dinámico como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
    
    elif((str(consulta("select blocktype from bloqueticket where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque Ticket-------
        resp=mensTicket(state,mensaje)
        #-------PASO 10. Bloque Ticket como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
        
    elif((str(consulta("select blocktype from bloqueslidedinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+state+"'"))) not in "None"):
        #-------PASO 9. Llamada a la funcion que genera la respuesta del tipo bloque Slide Dinámico-------
        resp=mensSlideDin(state,mensaje)
        #-------PASO 10. Bloque Carrusel dinámico como respuesta al mensaje del usuario-------
        data_string = json.dumps(resp)
    
    print('\n_________________________________________________________________________________________________________________________')
    print(" [x] Enviando... ", str(data_string))
    #-------PASO 11. Inicio: Llamada a la función encargada de encolar el mensaje de respuesta-------
    envia(ch,props, method, data_string)
    #print("llegó esto: ",mensaje["payload"])
    return cont #,mensaje;


# In[ ]:


#---------------------PASO 7. Función que realiza las llamadas a APIs de NLP------------------------
def NLP(id_robot,cadena):
    URL=consulta("select api_nlp from robots where id_robot='"+str(id_robot)+"'")
    #---------PASO 7. Validacion que determina si el chatbot cuenta con una API de NLP o no---------
    if URL[0] not in "Sin API":
        mensaje={"mensaje": cadena}
        URL_API_NLP=URL[0]+str(mensaje)
        print('Operacion get-> ',URL_API_NLP)
        #---------------------PASO 7. Operacion de tipo GET sobre la API de NLP---------------------
        respuesta = requests.get(URL_API_NLP)
        estado = json.loads(respuesta.text)
        print('Salto en la maquina de estados->',estado['salto_estado'])
        #---------------------PASO 7. Retorno de la respuesta de la API de NLP----------------------
        return estado['salto_estado']
    #---------------PASO 7. Retorno que indica que el chatbot no cuenta con API de NLP--------------
    return "Sin estado"


# In[ ]:


#-----PASO 4. Función que valida que el mensaje introducido por el usuario sea o no un comando------
def comandos(mensaje):
    content='false'
    #------------PASO 4. Validacion del comando para eliminar el registro de un usuario--------------
    if mensaje['payload'][0]['content']=='#DLTU':
        print('Comando #DLTU')
        insertar("delete from ticket where id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
        content='Se elinaron los datos del usuario con id='+mensaje["payload"][0]["recipient_id"]
    #-----PASO 4. Validacion del comando para obtener la informacion del registro de un usuario------
    elif mensaje['payload'][0]['content']=='#QRYU':
        print('Comando #QRYU')
        data_usuario=consulta2("select * from ticket where id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
        if len(data_usuario)>0:
            content='Datos usuario-> id_robot '+str(data_usuario[0][1])+', id_usuario='+str(data_usuario[0][2])+', estado_actual='+str(data_usuario[0][3])+', entities='+str(data_usuario[0][5])+', ult_actividad= '+str(data_usuario[0][6])
        else:
            content='El usuario no tiene datos almacenados aun'
    #--------------PASO 4. Retorna la cadena que indica el resultado de la validacion----------------
    return content


# In[ ]:


#-------------Conexión con RabbitMQ----------------------------
connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))

channel = connection.channel()

channel.queue_declare(queue='chatbotVB101')


#-------------------PASO 1. Función que se ejecuta cuando se desencola un mensaje.----------------------------
def on_request(ch, method, props, body):
    mensaje= json.loads(body)
    print('\n_________________________________________________________________________________________________________________________')
    print("Mensaje User=> ",mensaje)
    #---------------PASO 2. Consulta para obtener los datos "robot" y "access_token"--------------------------
    mensaje["payload"][0]["robot"],mensaje["payload"][0]["access_token"]=consulta("select id_robot,access_token from robots where id_face='"+mensaje["payload"][0]["id_face"]+"'")
    print("Robot-> ",mensaje["payload"][0]["robot"],", recipient_id-> "+mensaje["payload"][0]["recipient_id"])
    #----------------------PASO 3. Consulta para obtener el dato "block_type"---------------------------------
    block_type=(consulta("select block_type from ticket where id_robot="+str(mensaje["payload"][0]["robot"])+" and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'"))    
    #-----PASO 4. Inicio: Se llama a la función comandos, para la validación de los comandos del sistema------
    resp_comand=comandos(mensaje)
    #-----------------------PASO 4. Validación de la respuesta de la función "comandos"-----------------------
    if  resp_comand not in 'false':
        #------PASO 4. Generación y envío de la respuesta para indicar que se llevó acabo la ejecución del comando-------
        resp=mensInfDatosU(mensaje,resp_comand)
        data_string = json.dumps(resp)
        print('\n_________________________________________________________________________________________________________________________')
        print(" [x] Enviando... ", str(data_string))
        #---------------------------PASO 11. Inicio: envío del mensaje de respuesta generado-----------------------------
        envia(ch,props, method, data_string)
    #-------------------------------PASO 5. Inicio: Validación de estado inicial------------------------------
    elif(str(block_type) in "None"):
        #--------------------PASO 5. Generacion de la respuesta mediante el bloque inicial del chatbot-------------------
        n=  {"Respuesta": [{"content":" ","next_id":" ", "blockType":" ", "contentType":" ",
                         "typingTime":" ","payload":[]}]}
        data_string = json.dumps(n)
        decoded = json.loads(data_string)
        print('id_robot: ',mensaje["payload"][0]["robot"])
        bloque_inicial,type_blocki=consulta("select block_ini, type_blocki from robots where id_robot='"+str(mensaje["payload"][0]["robot"])+"'")
        insertar("insert into ticket (id_robot, id_usuario, estado_actual, block_type ,entities,fecha_mod) values ('"+str(mensaje["payload"][0]["robot"])+"','"+mensaje["payload"][0]["recipient_id"]+"','"+bloque_inicial+"','"+type_blocki+"','{}','2019/02/06')")
        
        decoded["Respuesta"][0]["content"] = str(consulta("select contenido from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+bloque_inicial+"'")[0])
        decoded["Respuesta"][0]["next_id"] = str(consulta("select next_id from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+bloque_inicial+"'")[0])
        decoded["Respuesta"][0]["blockType"]= str(consulta("select blockType from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+bloque_inicial+"'")[0])
        decoded["Respuesta"][0]["contentType"]= str(consulta("select contentType from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+bloque_inicial+"'")[0])
        decoded["Respuesta"][0]["typingTime"]= str(consulta("select typingTime from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+bloque_inicial+"'")[0])
        
        payload={"content":"","state":bloque_inicial,"recipient_id":mensaje["payload"][0]["recipient_id"],"entities":mensaje["payload"][0]["entities"],"access_token":mensaje["payload"][0]["access_token"]}
        pay=json.dumps(payload)
        decoded["Respuesta"][0]["payload"].append(json.loads(pay))
        data_string = json.dumps(decoded)

        print(" [x] Enviando... ", str(data_string))
        #---------------------------PASO 11. Inicio: envío del mensaje de respuesta generado-----------------------------
        envia(ch, props, method,data_string)
    else:
        #----------------------PASO 6. Consulta para obtener los datos "estado_actual" y "entities"----------------------
        estado_actual,entitiesConsulta=consulta("select estado_actual,entities from ticket where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and id_usuario='"+mensaje["payload"][0]["recipient_id"]+"'")
        entitiesDB = json.loads(entitiesConsulta)
        mensaje["payload"][0]["entities"]=entitiesDB
        #----------------PASO 7. Inicio: Validación del tipo de bloque al que pertenece el estado actual-----------------
        #----------------PASO 7. Acciones y validaciones que se realizan para los bloques "informativo"------------------
        if(block_type[0]=="informativo"):
            #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
            state=str(consulta("select next_id from bloqueinfo where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0])
            #-----PASO 9. Inicio: Llamada a la función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch, props, method, state, mensaje)
        
        #-----------------PASO 7. Acciones y validaciones que se realizan para los bloques "quickReply"------------------
        if(block_type[0]=="quickReply"):
            opciones=consulta("select opciones from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0].split(",")
            cont=0
            for opcion in opciones:
                if opcion in mensaje["payload"][0]["content"]:
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
                    next_id=consulta("select next_id from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0].split(",")
                    if len(next_id)>1:
                        state=str(next_id[cont])
                    else:
                        save_var=consulta("select save_var from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0]
                        mensaje["payload"][0]["entities"][save_var]=mensaje["payload"][0]["content"]
                        state=str(next_id[0])
                    break
                cont=cont+1
            else:
                #-------------PASO 7. Llamada a la función que realiza las llamadas a APIS de NLP---------------
                resp=NLP(mensaje['payload'][0]['robot'],mensaje['payload'][0]['content'])
                if resp not in "Sin estado":
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 2.-------------------
                    state=resp
                else:
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 3.-------------------
                    state=str(consulta("select default_id from bloqueqr where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0])
            #-----PASO 9. Inicio: Llamada a la función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)
        
        #-------------------PASO 7. Acciones y validaciones que se realizan para los bloques "input"---------------------
        elif(block_type[0]=="input"):
            dataVar=mensaje["payload"][0]["content"]
            nameVar=str(consulta("select save_var from bloqueinput where id_robot='"+str(+mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0])
            mensaje["payload"][0]["entities"][nameVar]=dataVar
            #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
            state=str(consulta("select next_id from bloqueinput where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0])
            #-----PASO 9. Inicio: Llamada a la función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)
            
        
        #------------PASO 7. Acciones y validaciones que se realizan para los bloques "informativoDinamico"--------------
        elif(block_type[0]=="informativoDinamico"):
            #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
            state=str(consulta("select next_id from bloqueinfodinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0])
            #-----PASO 9. Inicio: Llamada a la función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)
            
        
        #---------------PASO 7. Acciones y validaciones que se realizan para los bloques "inputDinamico"-----------------
        elif(block_type[0]=="inputDinamico"):
            dataVar=mensaje["payload"][0]["content"]
            save_var=consulta("select save_var from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0]
            if(mensaje["payload"][0]["entities"][save_var]==" "):
                nameVar=save_var
            else:
                nameVar=mensaje["payload"][0]["entities"][save_var]
            mensaje["payload"][0]["entities"][nameVar]=dataVar
            #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
            state=str(consulta("select next_id from bloqueinputdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0])
            #-----PASO 9. Inicio: Llamada a la función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)
            
        #-------------PASO 7. Acciones y validaciones que se realizan para los bloques "quickReplyDinamico"--------------
        elif(block_type[0]=="quickReplyDinamico"):
            opciones=consulta("select opciones from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0].split(",")
            cont=0
            for opcion in opciones:
                if opcion in mensaje["payload"][0]["content"]:
                    dataVar=mensaje["payload"][0]["content"]
                    nameVar=consulta("select save_var from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0]
                    mensaje["payload"][0]["entities"][nameVar]=dataVar
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
                    next_id=consulta("select next_id from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0].split(",")
                    state=str(next_id[cont])
                    break
                cont=cont+1
            else:
                #-------------PASO 7. Llamada a la función que realiza las llamadas a APIS de NLP---------------
                resp=NLP(mensaje['payload'][0]['robot'],mensaje['payload'][0]['content'])
                if resp not in "Sin estado":
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 2.-------------------
                    state=resp
                else:
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 3.-------------------
                    state=str(consulta("select default_id from bloqueqrdinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0])
            #-----PASO 9. Inicio: Llamada a la función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)
        
        #-------------------PASO 7. Acciones y validaciones que se realizan para los bloques "slide"---------------------
        elif(block_type[0]=="slide"):
            opciones,default_id,s_v=consulta("select next_id, default_id, save_var from bloqueslide where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")
            save_var=s_v.split(",")
            if mensaje["payload"][0]["type_resp"]=="postback": 
                for opcion in opciones.split(","):
                    if opcion in mensaje["payload"][0]["content"]:
                        #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
                        state=opcion
                        break
                else:
                    if len(save_var)>1:
                        #En este caso se almacena en el campo save_var de la DB el nombre de la variable y el next_id, esto cuando en el slide se retorne un dato que se tiene que almacenar y no represente un next_id
                        mensaje["payload"][0]["entities"][save_var[0]]=mensaje["payload"][0]["content"]
                        state=save_var[1]
                    else:
                        mensaje["payload"][0]["entities"][save_var[0]]=mensaje["payload"][0]["content"]
                        state=opciones
            else:
                #-------------PASO 7. Llamada a la función que realiza las llamadas a APIS de NLP---------------
                resp=NLP(mensaje['payload'][0]['robot'],mensaje['payload'][0]['content'])
                if resp not in "Sin estado":
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 2.-------------------
                    state=resp
                else:
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 3.-------------------
                    state=default_id
            #-----PASO 9. Inicio: Llamada a la función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)
        
        #------------------PASO 7. Acciones y validaciones que se realizan para los bloques "slideBuy"-------------------
        elif(block_type[0]=="slideBuy"):
            elements,next_id,default_id,nameVar=consulta("select id_elements,next_id,default_id,save_var from bloqueslidebuy where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")
            #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
            state=next_id
            for element in elements.split(","):
                if element in mensaje["payload"][0]["content"]:                
                    if nameVar in mensaje["payload"][0]["entities"]:
                        if mensaje["payload"][0]["content"] in mensaje["payload"][0]["entities"][nameVar]:
                            val=mensaje["payload"][0]["entities"][nameVar][mensaje["payload"][0]["content"]]
                            mensaje["payload"][0]["entities"][nameVar][mensaje["payload"][0]["content"]]=val+1
                            break
                        mensaje["payload"][0]["entities"][nameVar][mensaje["payload"][0]["content"]]=1
                        break
                    mensaje["payload"][0]["entities"][nameVar]={mensaje["payload"][0]["content"]:1}
                    break
            else:
                #-------------PASO 7. Llamada a la función que realiza las llamadas a APIS de NLP---------------
                resp=NLP(mensaje['payload'][0]['robot'],mensaje['payload'][0]['content'])
                if resp not in "Sin estado":
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 2.-------------------
                    state=resp
                else:
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 3.-------------------
                    state=default_id
            #-----PASO 9. Inicio: Función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)
        
        #---------------PASO 7. Acciones y validaciones que se realizan para los bloques "slideDinamico"-----------------
        elif(block_type[0]=="slideDinamico"):
            opciones,default_id,s_v=consulta("select next_id, default_id, save_var from bloqueslidedinamico where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")
            save_var=s_v.split(",")
            if mensaje["payload"][0]["type_resp"]=="postback":  
                for opcion in opciones.split(","):
                    if opcion in mensaje["payload"][0]["content"]:
                        #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
                        state=opcion
                        break
                else:
                    if len(save_var)>2:
                        #En este caso se almacena en el campo save_var de la DB el nombre de la variable y el next_id, esto cuando en el slide se retorne un dato que se tiene que almacenar y no represente un next_id
                        mensaje["payload"][0]["entities"]["VarTipoDato"]=save_var[0]
                        mensaje["payload"][0]["entities"][save_var[1]]=mensaje["payload"][0]["content"]
                        state=save_var[2]
                    else:
                        mensaje["payload"][0]["entities"]["VarTipoDato"]=save_var[0]
                        mensaje["payload"][0]["entities"][save_var[1]]=mensaje["payload"][0]["content"]
                        state=opciones
            else:
                #-------------PASO 7. Llamada a la función que realiza las llamadas a APIS de NLP---------------
                resp=NLP(mensaje['payload'][0]['robot'],mensaje['payload'][0]['content'])
                if resp not in "Sin estado":
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 2.-------------------
                    state=resp
                else:
                    #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 3.-------------------
                    state=default_id
            #-----PASO 9. Inicio: Función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)
            
        #------------------PASO 7. Acciones y validaciones que se realizan para los bloques "ticket"---------------------
        elif(block_type[0]=="ticket"):
            #-----------------PASO 8. Generacion del siguiente estado a ejecutar: CASO 1.-------------------
            state=str(consulta("select next_id from bloqueticket where id_robot='"+str(mensaje["payload"][0]["robot"])+"' and namestate='"+estado_actual+"'")[0])
            #-----PASO 9. Inicio: Función que verifica el tipo de bloque al que pertenece el siguiente estado-----
            cont=confirma(ch,props, method, state,mensaje)

#-----Creacion de la cola de mensajes en RabbitMQ-----
channel.basic_qos(prefetch_count=1)
channel.basic_consume(on_request, queue='chatbotVB101')

#-----PASO 1.- Inicio: Desencolar mensaje: se llama a la funcion on_request pasando el mensaje descolado-----
print(" [x] Comenzando conversación...")
channel.start_consuming()


# In[ ]:





# In[ ]:




