const db = require('../config/db.config.js');
const Credenciales = db.credenciales;
const Credenciales2 = db.credenciales2;

exports.create = (req, res) => {	
	// Save to PostgreSQL database
	Credenciales.create({
				"blocktype": req.body.blocktype,
                "namecredencial": req.body.namecredencial,
                "credencial": req.body.credencial,
                "id_block": req.body.id_block
            }
        ).then(credencialesapis => {
				// Send created customer to client
				res.json(credencialesapis);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	Credenciales2.findAll().then(credencialesapis => {
			// Send All Customers to Client
			res.json(credencialesapis.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_credencial;
	Credenciales2.update( req.body, 
			{ where: {id_credencial: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	Credenciales2.destroy({
			where: { id_credencial: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque informativo con Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdBlock = (req, res) => {
	const id= req.params.id_block;
	Credenciales2.findAll({
		where: { id_block: id }
	}).then(credencialesapis => {
			// Send All Customers to Client
			res.json(credencialesapis.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findCredencial = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_ELM= obj.id_block;
	const tl= obj.credencial;
	Credenciales2.findAll({
		where: { id_block: id_ELM, credencial: tl }
	}).then(credencialesapis => {
			// Send All Customers to Client
			res.json(credencialesapis.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBLK= (req, res) => {
	const id = req.params.id_block;
	Credenciales2.destroy({
			where: { id_block: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByDatos = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id= obj.id_block;
	const bt= obj.blocktype;
	Credenciales2.findAll({
		where: { id_block: id, blocktype: bt }
	}).then(credencialesapis => {
			// Send All Customers to Client
			res.json(credencialesapis.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};