const db = require('../config/db.config.js');
const BloqueSlide = db.bloqueslide;
const BloqueSlide2 = db.bloqueslide2;

exports.create = (req, res) => {
	console.log("Creando un bloque slide")	
	// Save to PostgreSQL database
	BloqueSlide.create({
				//"id_block": req.body.id_block, 
				"namestate": req.body.namestate, 
				"id_robot": req.body.id_robot,
				"opc_nextid": req.body.opc_nextid,
				"next_id": req.body.next_id,
				"blocktype": req.body.blocktype,
                "typingtime": req.body.typingtime,
                "default_id": req.body.default_id,
				"id_var": req.body.id_var,
				"pos_y": req.body.pos_y,	
				"pos_x": req.body.pos_x,
				"opc_elm": req.body.opc_elm,
				"tag_active": req.body.tag_active,
            }
        ).then(bloqueslide => {
				// Send created customer to client
				res.json(bloqueslide);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	BloqueSlide2.findAll().then(bloqueslide => {
			// Send All Customers to Client
			res.json(bloqueslide.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_block;
	BloqueSlide2.update( req.body, 
			{ where: {id_block: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque slide con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	BloqueSlide2.destroy({
			where: { id_block: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque slide con Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdRobot = (req, res) => {
	const id= req.params.id_robot;
	BloqueSlide2.findAll({
		where: { id_robot: id }
	}).then(bloqueslide => {
			res.json(bloqueslide.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findBloque = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_bot= obj.id_robot;
	const NS= obj.namestate;
	BloqueSlide2.findAll({
		where: { id_robot: id_bot, namestate: NS }
	}).then(bloqueslide => {
			// Send All Customers to Client
			res.json(bloqueslide.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBot = (req, res) => {
	const id = req.params.id_robot;
	BloqueSlide2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque slide con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};