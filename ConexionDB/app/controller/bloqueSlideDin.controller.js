const db = require('../config/db.config.js');
const BloqueSlide = db.bloqueslideDin;
const BloqueSlide2 = db.bloqueslideDin2;

exports.create = (req, res) => {
	console.log("Creando un bloque slide dinamico")	
	// Save to PostgreSQL database
	BloqueSlide.create({                
                'namestate': req.body.namestate,
                "contenido": req.body.contenido,
                'id_robot': req.body.id_robot,
                'opc_nextid': req.body.opc_nextid,
                'next_id': req.body.next_id,
                'blocktype': req.body.blocktype,
                'typingtime': req.body.typingtime,
                'default_id': req.body.default_id,
                'save_var': req.body.save_var,
                'pos_y': req.body.pos_y,
                'pos_x': req.body.pos_x,
                'opc_elm': req.body.opc_elm
            }
        ).then(bloqueslidedinamico => {
				// Send created customer to client
				res.json(bloqueslidedinamico);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	BloqueSlide2.findAll().then(bloqueslidedinamico => {
			// Send All Customers to Client
			res.json(bloqueslidedinamico.sort(function(c1, c2){return c1.id - c2.id}));
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
	}).then(bloqueslidedinamico => {
			res.json(bloqueslidedinamico.sort(function(c1, c2){return c1.id - c2.id}));
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
	}).then(bloqueslidedinamico => {
			// Send All Customers to Client
			res.json(bloqueslidedinamico.sort(function(c1, c2){return c1.id - c2.id}));
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