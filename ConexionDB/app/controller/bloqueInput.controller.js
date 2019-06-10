const db = require('../config/db.config.js');
const BloqueInput = db.bloqueinput;
const BloqueInput2 = db.bloqueinput2;

exports.create = (req, res) => {
	console.log("Creando un bloque input")	
	// Save to PostgreSQL database
	BloqueInput.create({
				//"id_block": req.body.id_block, 
				"namestate": req.body.namestate, 
				"id_robot": req.body.id_robot,
				"contenido": req.body.contenido,
				"opc_nextid": req.body.opc_nextid,
				"next_id": req.body.next_id,
				"blocktype": req.body.blocktype,
                "contenttype": req.body.contenttype,
                "typingtime": req.body.typingtime,
                "validacion": req.body.validacion,
                "default_id": req.body.default_id,
                "save_var": req.body.save_var,
				"pos_y": req.body.pos_y,	
				"pos_x": req.body.pos_x,
            }
        ).then(bloqueinput => {
				// Send created customer to client
				res.json(bloqueinput);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	BloqueInput2.findAll().then(bloqueinput => {
			// Send All Customers to Client
			res.json(bloqueinput.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_block;
	BloqueInput2.update( req.body, 
			{ where: {id_block: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	BloqueInput2.destroy({
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
	BloqueInput2.findAll({
		where: { id_robot: id }
	}).then(bloqueinput => {
			res.json(bloqueinput.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findBloque = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_bot= obj.id_robot;
	const NS= obj.namestate;
	BloqueInput2.findAll({
		where: { id_robot: id_bot, namestate: NS }
	}).then(bloqueinput => {
			// Send All Customers to Client
			res.json(bloqueinput.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.deleteByIdBot = (req, res) => {
	const id = req.params.id_robot;
	BloqueInput2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque input con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};