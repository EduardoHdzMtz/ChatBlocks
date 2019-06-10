var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())
 
const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
 
app.use(cors(corsOptions))
 
//const db = require('./app/config/db.config.js');
  
//force: true will drop the table if it already exists
/*db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync with { force: true }');
    initial();
});*/
 
require('./app/route/opc.route.js')(app);
 
// Create a Server
var server = app.listen(8080, function () {
    let host = server.address().address
    let port = server.address().port
    
    console.log("App listening at http://%s:%s", host, port);
})
 
/*function initial(){
    let robots = [
        {
            id_robot: 1,
			name_robot: "ChatPro", 
			id_face: "dsdsdsdad",
			block_ini: "Saludo",
			type_blocki: "informativo",
			access_token: "wfksdjbsfs76s7d6fs76",
			api_nlp: "nada"
        },
        {
            id_robot: 2,
			name_robot: "ChatBot2", 
			id_face: "dsdsdsdad",
			block_ini: "SaludoI",
			type_blocki: "informativo",
			access_token: "wfksdjbsfs76s7d6fs76",
			api_nlp: "nada"
        }
    ]
 
    // Init data -> save to MySQL
    const Robots = db.robots;
    for (let i = 0; i < robots.length; i++) { 
        Robots.create(robots[i]);  
    }
}*/