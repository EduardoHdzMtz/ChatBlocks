const db = require('../config/db.config.js');
const Links = db.links;
const Links2 = db.links2;

exports.create = (req, res) => {	
	// Save to PostgreSQL database
	Links.create({
				"blocktype": req.body.blocktype,
                "links": req.body.links,
                "id_block": req.body.id_block
            }
        ).then(linksapis => {
				// Send created customer to client
				res.json(linksapis);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	Links2.findAll().then(linksapis => {
			// Send All Customers to Client
			res.json(linksapis.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_link;
	Links2.update( req.body, 
			{ where: {id_link: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	Links2.destroy({
			where: { id_link: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque informativo con Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdBlock = (req, res) => {
	const id= req.params.id_block;
	Links2.findAll({
		where: { id_block: id }
	}).then(linksapis => {
			// Send All Customers to Client
			res.json(linksapis.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findLink = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_ELM= obj.id_block;
	const tl= obj.links;
	Links2.findAll({
		where: { id_block: id_ELM, links: tl }
	}).then(linksapis => {
			// Send All Customers to Client
			res.json(linksapis.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBLK= (req, res) => {
	const id = req.params.id_block;
	Links2.destroy({
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
	Links2.findAll({
		where: { id_block: id, blocktype: bt }
	}).then(linksapis => {
			// Send All Customers to Client
			res.json(linksapis.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};