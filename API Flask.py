#!/usr/bin/env python
# coding: utf-8

# In[1]:


from flask import Flask
import re
import json
from flask_restful import Resource, Api


# In[ ]:


app = Flask(__name__)
api = Api(app)

def selec_salto(entidades,intenciones):
    salto_estado="Sin estado"
    if ("Quiero" in entidades) or ("Deseo" in entidades) or ("Busco" in entidades) or ("Necesito" in entidades) or ("Solicito" in entidades):
        if ("Consultar" in intenciones) or ("Mostrar" in intenciones) or ("Ver" in intenciones):
            if "Estacion" in intenciones:
                if "Id" in intenciones:
                    salto_estado="ObtenerDatosAPIInput"
                else:
                    salto_estado="ConsultarEstaciones"
                        
            elif "Menu" in intenciones:
                salto_estado="OpMenu"                   
                            
        elif "Realizar" in intenciones:
            if "Consultar" in intenciones:
                if "Estacion" in intenciones:
                    if "Id" in intenciones:
                        salto_estado="ObtenerDatosAPIInput"
                    else:
                        salto_estado="ConsultarEstaciones"
        elif "Poner" in intenciones:
            if "Queja" in intenciones:
                salto_estado="Queja"
                        
    elif ("Consultar" in intenciones) or ("Mostrar" in intenciones) or ("Ver" in intenciones):
        if "Estacion" in intenciones:
            if "Id" in intenciones:
                salto_estado="ObtenerDatosAPIInput"
            else:
                salto_estado="ConsultarEstaciones"
        elif "Menu" in intenciones:
            salto_estado="OpMenu"          
                
    elif "Poner" in intenciones:
            if "Queja" in intenciones:
                salto_estado="Queja"
        
    return salto_estado

class API_NLP(Resource):         
    
    def get(self, mensaje):
        entidades={
            "Quiero": "[Qq]u[ie][esr][rei][rdaeio][rsano]?[asd]?[os]?",
            "Deseo": "[Dd]ese[ao][dnsbr]?[doaie]?[ao]?",
            "Busco": "Bb]us[cq][aou][rndbet]?[aeiod]?[ao]?s?",
            "Necesito": "[Nn]ecesit[ao][rndsb]?[doaei]?[oa]?",
            "Solicito": "[Ss]olicit[aoe][rnd]?[do]?[o]?"
        }
        intenciones={
            "Consultar": "[Cc]onsult[aeo][rndsb]?[doai]?[oa]?",
            "Realizar": "[Rr]eali[zc][aeo][rndb]?[dsae]?[eo]?",
            "Poner": "[Ppm][oe][nt][iegd][reoa][ne]?d?o?",
            "Ver": "[vV][ie][rso][ut]?[ao]?l?i?z?a?r?",
            "Mostrar": "[Mm][ou][se][st][tr][ar][rae][ma]?[es]?",
            "Queja": "[qQ]uej[ao][rns]?[md]?[eo]?",
            "Bicicleta": "[Bb]icic?l?e?t?a?",
            "Estacion": "[Ee]stacione?s?",
            "Id": "[iI][dD]e?n?t?i?f?i?c?a?d?o?r?",
            "Menu": "[Mm]enu ?[poca]?[rpoc]?[icn]?[niv]?[coe]?[inr]?[pes]?[as]?[lc]?i?o?n?"
        }
        
        #quiero: quiero quisiera quisieras quieres querrias querras queria querer queriendo querido
        #Deseo: deseo deseas eseaba desearia deseare desear deseando deseado deseare
        #necesito: necesitar necesitando necesitado necesito necesitas necesitaba necesitare necesitaria
        #solicitar solicitando solicitado solicito solicita solicitado solicite
        
        #realizar realizando realizado realizarse realizo realiza realizaba realice realizare
        #consultar consultando consultado consulto consultas consulta consultaba consulte consultaria consultaba consultaria consultado consultar
        #ver visualizar visto vio
        #quejarme quejando quejo quejas queja
        #bicicleta bici
        
        mensaje=mensaje.replace("50", '?')
        mensaje=mensaje.replace("60", '¿')
        print("Mensaje: ",mensaje)
        entid_find=[]
        intec_find=[]
        
        for ent in entidades:
            patron=re.compile(entidades[ent])
            if str(patron.search(mensaje)) not in "None":
                entid_find.append(ent)
        
        for ints in intenciones:
            patron=re.compile(intenciones[ints])
            if str(patron.search(mensaje)) not in "None":
                intec_find.append(ints)

        print("\n\nEntidades-> ",entid_find)
        print("Intenciones-> ",intec_find)        
        
        estado={"salto_estado": selec_salto(entid_find,intec_find)}
        
        return estado
    
api.add_resource(API_NLP, '/API/REGEX/v1/<mensaje>')

    


if __name__ == '__main__':
    app.run(port=800)
    #app.run()


# In[ ]:





# In[ ]:




