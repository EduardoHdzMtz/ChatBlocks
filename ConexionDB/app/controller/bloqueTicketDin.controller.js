const db = require('../config/db.config.js');
const BloqueTicket = db.bloqueticketDin;
const BloqueTicket2 = db.bloqueticketDin2;

exports.create = (req, res) => {
	BloqueTicket.create({
				"namestate": req.body.namestate, 
				"id_robot": req.body.id_robot,
				"contenido": req.body.contenido,
				"opc_nextid": req.body.opc_nextid,
				"next_id": req.body.next_id,
				"blocktype": req.body.blocktype,
				"typingtime": req.body.typingtime,
				"pos_y": req.body.pos_y,	
				"pos_x": req.body.pos_x,
            }
        ).then(bloqueticketdinamico => {
				// Send created customer to client
				res.json(bloqueticketdinamico);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	BloqueTicket2.findAll().then(bloqueticketdinamico => {
			// Send All Customers to Client
			res.json(bloqueticketdinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_block;
	BloqueTicket2.update( req.body, 
			{ where: {id_block: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	BloqueTicket2.destroy({
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
	BloqueTicket2.findAll({
		where: { id_robot: id }
	}).then(bloqueticketdinamico => {
			// Send All Customers to Client
			res.json(bloqueticketdinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findBloque = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_bot= obj.id_robot;
	const NS= obj.namestate;
	BloqueTicket2.findAll({
		where: { id_robot: id_bot, namestate: NS }
	}).then(bloqueticketdinamico => {
			// Send All Customers to Client
			res.json(bloqueticketdinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBot = (req, res) => {
	const id = req.params.id_robot;
	BloqueTicket2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};