const db = require('../config/db.config.js');
const BloqueInfo = db.bloqueinfoDin;
const BloqueInfo2 = db.bloqueinfoDin2;

exports.create = (req, res) => {
	console.log("Creando un bloque info: "+req.body.opc_nextID);
	console.log("Creando un bloque next_id: "+req.body.next_id);	
	// Save to PostgreSQL database
	BloqueInfo.create({
				//"id_block": req.body.id_block, 
				"namestate": req.body.namestate, 
				"id_robot": req.body.id_robot,
				"contenido": req.body.contenido,
				"opc_nextid": req.body.opc_nextid,
				"next_id": req.body.next_id,
				"blocktype": req.body.blocktype,
                "contenttype": req.body.contenttype,
				"typingtime": req.body.typingtime,
				"pos_y": req.body.pos_y,	
				"pos_x": req.body.pos_x,
				"tag_active": req.body.tag_active,
            }
        ).then(bloqueinfodinamico => {
				// Send created customer to client
				res.json(bloqueinfodinamico);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	BloqueInfo2.findAll().then(bloqueinfodinamico => {
			// Send All Customers to Client
			res.json(bloqueinfodinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_block;
	BloqueInfo2.update( req.body, 
			{ where: {id_block: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	BloqueInfo2.destroy({
			where: { id_block: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque informativo con Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdRobot = (req, res) => {
	const id= req.params.id_robot;
	BloqueInfo2.findAll({
		where: { id_robot: id }
	}).then(bloqueinfodinamico => {
			// Send All Customers to Client
			res.json(bloqueinfodinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findBloque = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_bot= obj.id_robot;
	const NS= obj.namestate;
	BloqueInfo2.findAll({
		where: { id_robot: id_bot, namestate: NS }
	}).then(bloqueinfodinamico => {
			// Send All Customers to Client
			res.json(bloqueinfodinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBot = (req, res) => {
	const id = req.params.id_robot;
	BloqueInfo2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};