const db = require('../config/db.config.js');
const Elementos = db.elementos;
const Elementos2 = db.elementos2;

exports.create = (req, res) => {	
	// Save to PostgreSQL database
	Elementos.create({
				"blocktype":req.body.blocktype,
                "title": req.body.title,
                "image_url": req.body.image_url,
                "subtitle": req.body.subtitle,
				"id_block": req.body.id_block,
            }
        ).then(elementos => {
				// Send created customer to client
				res.json(elementos);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	Elementos2.findAll().then(elementos => {
			// Send All Customers to Client
			res.json(elementos.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_elements;
	Elementos2.update( req.body, 
			{ where: {id_elements: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	Elementos2.destroy({
			where: { id_elements: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque informativo con Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdBLK = (req, res) => {
	const id= req.params.id_block;
	Elementos2.findAll({
		where: { id_block: id }
	}).then(elementos => {
			// Send All Customers to Client
			res.json(elementos.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findElemento = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_blk= obj.id_block;
	const tl= obj.title;
	Elementos2.findAll({
		where: { id_block: id_blk, title: tl }
	}).then(elementos => {
			// Send All Customers to Client
			res.json(elementos.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBlk = (req, res) => {
	const id = req.params.id_block;
	Elementos2.destroy({
			where: { id_block: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};