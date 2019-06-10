const db = require('../config/db.config.js');
const BloqueQR = db.bloqueQRDin;
const BloqueQR2 = db.bloqueQRDin2;

exports.create = (req, res) => {
	console.log("Creando un bloque qr")	
	// Save to PostgreSQL database
	BloqueQR.create({
				//"id_block": req.body.id_block, 
				"namestate": req.body.namestate, 
				"id_robot": req.body.id_robot,
                "contenido": req.body.contenido,
				"opciones": req.body.opciones,
				"opc_nextid": req.body.opc_nextid,
				"next_id": req.body.next_id,
				"blocktype": req.body.blocktype,
                "typingtime": req.body.typingtime,
                "default_id": req.body.default_id,
                "save_var": req.body.save_var,
				"pos_y": req.body.pos_y,	
				"pos_x": req.body.pos_x,
            }
        ).then(bloqueqr => {
				// Send created customer to client
				res.json(bloqueqrdinamico);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	BloqueQR2.findAll().then(bloqueqrdinamico => {
			// Send All Customers to Client
			res.json(bloqueqrdinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_block;
	BloqueQR2.update( req.body, 
			{ where: {id_block: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	BloqueQR2.destroy({
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
	BloqueQR2.findAll({
		where: { id_robot: id }
	}).then(bloqueqrdinamico => {
			res.json(bloqueqrdinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findBloque = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_bot= obj.id_robot;
	const NS= obj.namestate;
	BloqueQR2.findAll({
		where: { id_robot: id_bot, namestate: NS }
	}).then(bloqueqrdinamico => {
			// Send All Customers to Client
			res.json(bloqueqrdinamico.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.deleteByIdBot = (req, res) => {
	const id = req.params.id_robot;
	BloqueQR2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque qr con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};