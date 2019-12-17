module.exports = function(app) {
    const robots = require('../controller/chatbots.controller.js');
    const bloqueinfo= require('../controller/bloqueInfo.controller.js'); 
    const bloqueinfoDin= require('../controller/bloqueInfoDin.controller.js'); 
    const bloqueinput= require('../controller/bloqueInput.controller.js');  
    const bloqueqr= require('../controller/bloqueQR.controller.js');
    const bloqueslide= require('../controller/bloqueSlide.controller.js');
    const bloqueslideDin= require('../controller/bloqueSlideDin.controller');
    const elementos= require('../controller/elementos.controller');
    const botones= require('../controller/botones.controller');
    const linksAPI= require('../controller/linksapis.controller');
    const credencialesAPI= require('../controller/credenciales.controller');
    const bloqueinputDin= require('../controller/bloqueInputDin.controller'); 
    const bloqueQRDin= require('../controller/bloqueQRDin.controller');
    const bloqueInternalPrs= require('../controller/bloqueInternalPrs.controller');
    const Operaciones= require('../controller/Operaciones.controller');
    const Variables= require('../controller/variables.controller');
    const bloqueticket= require('../controller/bloqueTicket.controller.js'); 
 
    app.post('/api/chatbotsDB', robots.create);

    app.get('/api/chatbotsDB', robots.findAll);

    app.put('/api/chatbotsDB', robots.update);
 
    app.delete('/api/chatbotsDB/:id', robots.delete);

    app.get('/api/chatbotsDB/:id_user', robots.findByIdUser);

    app.get('/api/chatbotsDB/new/:datos', robots.findbotByData);
    
    
    
    app.post('/api/bloqueInfo', bloqueinfo.create);

    //app.get('/api/bloqueInfo', bloqueinfo.findAll);

    app.put('/api/bloqueInfo', bloqueinfo.update);

    app.delete('/api/bloqueInfo/:id', bloqueinfo.delete);

    app.get('/api/bloqueInfo/:id_robot', bloqueinfo.findByIdRobot);

    app.get('/api/bloqueInfo/newBlk/:datos', bloqueinfo.findBloque);

    app.delete('/api/bloqueInfo/newBlk/:id_robot', bloqueinfo.deleteByIdBot);


    app.post('/api/bloqueInfoDinamico', bloqueinfoDin.create);

    //app.get('/api/bloqueInfo', bloqueinfo.findAll);

    app.put('/api/bloqueInfoDinamico', bloqueinfoDin.update);

    app.delete('/api/bloqueInfoDinamico/:id', bloqueinfoDin.delete);

    app.get('/api/bloqueInfoDinamico/:id_robot', bloqueinfoDin.findByIdRobot);

    app.get('/api/bloqueInfoDinamico/newBlk/:datos', bloqueinfoDin.findBloque);

    app.delete('/api/bloqueInfoDinamico/newBlk/:id_robot', bloqueinfoDin.deleteByIdBot);


    app.post('/api/linksAPI', linksAPI.create);

    //app.get('/api/bloqueInfo', bloqueinfo.findAll);

    app.put('/api/linksAPI', linksAPI.update);

    app.delete('/api/linksAPI/:id', linksAPI.delete);

    app.get('/api/linksAPI/:id_block', linksAPI.findByIdBlock);

    app.get('/api/linksAPI/newLK/:datos', linksAPI.findLink);

    app.delete('/api/linksAPI/newLK/:id_block', linksAPI.deleteByIdBLK);

    app.delete('/api/linksAPI/contruccion/:datos', linksAPI.findByDatos);


    app.post('/api/credencialesAPI', credencialesAPI.create);

    //app.get('/api/bloqueInfo', bloqueinfo.findAll);

    app.put('/api/credencialesAPI', credencialesAPI.update);

    app.delete('/api/credencialesAPI/:id', credencialesAPI.delete);

    app.get('/api/credencialesAPI/:id_block', credencialesAPI.findByIdBlock);

    app.get('/api/credencialesAPI/newCD/:datos', credencialesAPI.findCredencial);

    app.delete('/api/credencialesAPI/newCD/:id_block', credencialesAPI.deleteByIdBLK);

    app.delete('/api/credencialesAPI/contruccion/:datos', credencialesAPI.findByDatos);

    
    app.post('/api/bloqueInput', bloqueinput.create);

    //app.get('/api/bloqueInput', bloqueinput.findAll);

    app.put('/api/bloqueInput', bloqueinput.update);

    app.delete('/api/bloqueInput/:id', bloqueinput.delete);

    app.get('/api/bloqueInput/:id_robot', bloqueinput.findByIdRobot);

    app.get('/api/bloqueInput/newBlk/:datos', bloqueinput.findBloque);

    app.delete('/api/bloqueInput/newBlk/:id_robot', bloqueinput.deleteByIdBot);


    app.post('/api/bloqueInputDinamico', bloqueinputDin.create);

    //app.get('/api/bloqueInput', bloqueinput.findAll);

    app.put('/api/bloqueInputDinamico', bloqueinputDin.update);

    app.delete('/api/bloqueInputDinamico/:id', bloqueinputDin.delete);

    app.get('/api/bloqueInputDinamico/:id_robot', bloqueinputDin.findByIdRobot);

    app.get('/api/bloqueInputDinamico/newBlk/:datos', bloqueinputDin.findBloque);

    app.delete('/api/bloqueInputDinamico/newBlk/:id_robot', bloqueinputDin.deleteByIdBot);

    
    app.post('/api/bloqueQR', bloqueqr.create);

    app.get('/api/bloqueQR', bloqueqr.findAll);

    app.put('/api/bloqueQR', bloqueqr.update);

    app.delete('/api/bloqueQR/:id', bloqueqr.delete);

    app.get('/api/bloqueQR/:id_robot', bloqueqr.findByIdRobot);

    app.get('/api/bloqueQR/newBlk/:datos', bloqueqr.findBloque);

    app.delete('/api/bloqueQR/newBlk/:id_robot', bloqueqr.deleteByIdBot);


    app.post('/api/bloqueQRDinamico', bloqueQRDin.create);

    app.get('/api/bloqueQRDinamico', bloqueQRDin.findAll);

    app.put('/api/bloqueQRDinamico', bloqueQRDin.update);

    app.delete('/api/bloqueQRDinamico/:id', bloqueQRDin.delete);

    app.get('/api/bloqueQRDinamico/:id_robot', bloqueQRDin.findByIdRobot);

    app.get('/api/bloqueQRDinamico/newBlk/:datos', bloqueQRDin.findBloque);

    app.delete('/api/bloqueQRDinamico/newBlk/:id_robot', bloqueQRDin.deleteByIdBot);


    app.post('/api/bloqueSlide', bloqueslide.create);

    app.get('/api/bloqueSLide', bloqueslide.findAll);

    app.put('/api/bloqueSlide', bloqueslide.update);

    app.delete('/api/bloqueSlide/:id', bloqueslide.delete);

    app.get('/api/bloqueSlide/:id_robot', bloqueslide.findByIdRobot);

    app.get('/api/bloqueSlide/newBlk/:datos', bloqueslide.findBloque);

    app.delete('/api/bloqueSlide/newBlk/:id_robot', bloqueslide.deleteByIdBot);

    
    app.post('/api/bloqueSlideDinamico', bloqueslideDin.create);

    app.get('/api/bloqueSlideDinamico', bloqueslideDin.findAll);

    app.put('/api/bloqueSlideDinamico', bloqueslideDin.update);

    app.delete('/api/bloqueSlideDinamico/:id', bloqueslideDin.delete);

    app.get('/api/bloqueSlideDinamico/:id_robot', bloqueslideDin.findByIdRobot);

    app.get('/api/bloqueSlideDinamico/newBlk/:datos', bloqueslideDin.findBloque);

    app.delete('/api/bloqueSlideDinamico/newBlk/:id_robot', bloqueslideDin.deleteByIdBot);

    
    app.post('/api/elementos', elementos.create);

    app.get('/api/elementos', elementos.findAll);

    app.put('/api/elementos', elementos.update);

    app.delete('/api/elementos/:id', elementos.delete);

    app.get('/api/elementos/:id_block', elementos.findByIdBLK);

    app.get('/api/elementos/newELM/:datos', elementos.findElemento);

    app.delete('/api/elementos/newELM/:id_block', elementos.deleteByIdBlk);

    
    app.post('/api/botones', botones.create);
    
    app.get('/api/botones', botones.findAll);

    app.put('/api/botones', botones.update);

    app.delete('/api/botones/:id', botones.delete);

    app.get('/api/botones/:id_elemento', botones.findByIdELM);

    app.get('/api/botones/newBTN/:datos', botones.findBoton);

    app.delete('/api/botones/newBTN/:id_elemento', botones.deleteByIdELM);


    app.post('/api/bloqueInternalPrs', bloqueInternalPrs.create);

    app.put('/api/bloqueInternalPrs', bloqueInternalPrs.update);

    app.delete('/api/bloqueInternalPrs/:id', bloqueInternalPrs.delete);

    app.get('/api/bloqueInternalPrs/:id_robot', bloqueInternalPrs.findByIdRobot);

    app.get('/api/bloqueInternalPrs/newBlk/:datos', bloqueInternalPrs.findBloque);

    app.delete('/api/bloqueInternalPrs/newBlk/:id_robot', bloqueInternalPrs.deleteByIdBot);


    app.post('/api/operaciones', Operaciones.create);

    app.put('/api/operaciones', Operaciones.update);

    app.delete('/api/operaciones/:id', Operaciones.delete);

    app.get('/api/operaciones/:id_block', Operaciones.findByIdBLK);

    app.get('/api/operaciones/newOpc/:datos', Operaciones.findOperacion);

    app.delete('/api/operaciones/newOpc/:id_block', Operaciones.deleteByIdBlk);


    app.post('/api/variables', Variables.create);

    app.put('/api/variables', Variables.update);

    app.delete('/api/variables/:id', Variables.delete);

    app.get('/api/variables/:id_var', Variables.findByIdVar);

    app.get('/api/variables/getVars/:id_robot', Variables.findByIdRobot)

    app.get('/api/variables/newVar/:datos', Variables.findVar);

    app.delete('/api/variables/newVar/:id_robot', Variables.deleteByIdBot);   


    app.post('/api/bloqueTicket', bloqueticket.create);

    app.put('/api/bloqueTicket', bloqueticket.update);

    app.delete('/api/bloqueTicket/:id', bloqueticket.delete);

    app.get('/api/bloqueTicket/:id_robot', bloqueticket.findByIdRobot);

    app.get('/api/bloqueTicket/newBlk/:datos', bloqueticket.findBloque);

    app.delete('/api/bloqueTicket/newBlk/:id_robot', bloqueticket.deleteByIdBot);


    app.post('/api/bloqueTicketDinamico', bloqueticketDin.create);

    //app.get('/api/bloqueInfo', bloqueinfo.findAll);

    app.put('/api/bloqueTicketDinamico', bloqueticketDin.update);

    app.delete('/api/bloqueTicketDinamico/:id', bloqueticketDin.delete);

    app.get('/api/bloqueTicketDinamico/:id_robot', bloqueticketDin.findByIdRobot);

    app.get('/api/bloqueTicketDinamico/newBlk/:datos', bloqueticketDin.findBloque);

    app.delete('/api/bloqueTicketDinamico/newBlk/:id_robot', bloqueticketDin.deleteByIdBot);

    

}