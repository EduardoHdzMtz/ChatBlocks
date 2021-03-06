const db = require('../config/db.config.js');
const bloqueInternalPrs = db.bloqueInternalPrs;
const bloqueInternalPrs2 = db.bloqueInternalPrs2;

exports.create = (req, res) => {	
	// Save to PostgreSQL database
	bloqueInternalPrs.create({
				//"id_block": req.body.id_block, 
				"namestate": req.body.namestate,
                "id_robot": req.body.id_robot,
                "opc_nextid": req.body.opc_nextid,
                "default_nextid": req.body.default_nextid,
                "blocktype": req.body.blocktype,
                "pos_x": req.body.pos_x,
				"pos_y": req.body.pos_y,
				"tag_active": req.body.tag_active,
            }
        ).then(bloqueInternalPrs => {
				// Send created customer to client
				res.json(bloqueInternalPrs);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	bloqueInternalPrs2.findAll().then(bloqueInternalPrs => {
			// Send All Customers to Client
			res.json(bloqueInternalPrs.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_block;
	bloqueInternalPrs2.update( req.body, 
			{ where: {id_block: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	bloqueInternalPrs2.destroy({
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
	bloqueInternalPrs2.findAll({
		where: { id_robot: id }
	}).then(bloqueInternalPrs => {
			// Send All Customers to Client
			res.json(bloqueInternalPrs.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findBloque = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_bot= obj.id_robot;
	const NS= obj.namestate;
	bloqueInternalPrs2.findAll({
		where: { id_robot: id_bot, namestate: NS }
	}).then(bloqueInternalPrs => {
			// Send All Customers to Client
			res.json(bloqueInternalPrs.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBot = (req, res) => {
	const id = req.params.id_robot;
	bloqueInternalPrs2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};