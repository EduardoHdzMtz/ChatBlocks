const env = require('./env.js') ;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  },

  define: {
    freezeTableName: true,
    timestamps: false
  }

});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.robots = require('../model/chatbots.model.js')(sequelize, Sequelize);
db.robots2 = require('../model/chatbots2.model.js')(sequelize, Sequelize);
db.bloqueinfo = require('../model/bloqueInfo.model.js')(sequelize, Sequelize);
db.bloqueinfo2 = require('../model/bloqueInfo2.model.js')(sequelize, Sequelize);
db.bloqueinput = require('../model/bloqueInput.model.js')(sequelize, Sequelize);
db.bloqueinput2 = require('../model/bloqueInput2.model.js')(sequelize, Sequelize);
db.bloqueqr = require('../model/bloqueQR.model.js')(sequelize, Sequelize);
db.bloqueqr2 = require('../model/bloqueQR2.model.js')(sequelize, Sequelize);
db.bloqueslide = require('../model/bloqueSlide.model.js')(sequelize, Sequelize);
db.bloqueslide2 = require('../model/bloqueSlide2.model.js')(sequelize, Sequelize);
db.elementos = require('../model/elementos.model')(sequelize, Sequelize);
db.elementos2 = require('../model/elementos2.model')(sequelize, Sequelize);
db.botones = require('../model/botones.model')(sequelize, Sequelize);
db.botones2 = require('../model/botones2.model')(sequelize, Sequelize);
db.bloqueinfoDin = require('../model/bloqueInfoD.model')(sequelize, Sequelize);
db.bloqueinfoDin2 = require('../model/bloqueInfoD2.model')(sequelize, Sequelize);
db.links = require('../model/linksAPI.model')(sequelize, Sequelize);
db.links2 = require('../model/linksAPI2.model')(sequelize, Sequelize);
db.credenciales = require('../model/credenciales.model')(sequelize, Sequelize);
db.credenciales2 = require('../model/credenciales2.model')(sequelize, Sequelize);
db.bloqueslideDin = require('../model/bloqueSlideD.model')(sequelize, Sequelize);
db.bloqueslideDin2 = require('../model/bloqueSlideD2.model')(sequelize, Sequelize);
db.bloqueinputDin = require('../model/bloqueInputD.model')(sequelize, Sequelize);
db.bloqueinputDin2 = require('../model/bloqueInputD2.model')(sequelize, Sequelize);
db.bloqueQRDin = require('../model/bloqueQRD.model')(sequelize, Sequelize);
db.bloqueQRDin2 = require('../model/bloqueQRD2.model')(sequelize, Sequelize);
db.bloqueInternalPrs = require('../model/bloqueInternalPrs.model')(sequelize, Sequelize);
db.bloqueInternalPrs2 = require('../model/bloqueInternalPrs2.model')(sequelize, Sequelize);
db.bloqueInternalPrs = require('../model/bloqueInternalPrs.model')(sequelize, Sequelize);
db.bloqueInternalPrs2 = require('../model/bloqueInternalPrs2.model')(sequelize, Sequelize);
db.Operaciones = require('../model/operaciones.model')(sequelize, Sequelize);
db.Operaciones2 = require('../model/operaciones2.model')(sequelize, Sequelize);
db.Variables = require('../model/variables.model')(sequelize, Sequelize);
db.Variables2 = require('../model/variables2.model')(sequelize, Sequelize);
db.bloqueticket = require('../model/bloqueTicket.model')(sequelize, Sequelize);
db.bloqueticket2 = require('../model/bloqueTicket2.model')(sequelize, Sequelize);
db.bloqueticketDin = require('../model/bloqueTicketD.model')(sequelize, Sequelize);
db.bloqueticketDin2 = require('../model/bloqueTicketD2.model')(sequelize, Sequelize);

module.exports = db;