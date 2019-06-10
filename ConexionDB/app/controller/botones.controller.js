const db = require('../config/db.config.js');
const Botones = db.botones;
const Botones2 = db.botones2;

exports.create = (req, res) => {	
	// Save to PostgreSQL database
	Botones.create({
				"id_elemento": req.body.id_elemento,
                "titlebutton": req.body.titlebutton,
                "typebutton": req.body.typebutton,
                "contentbutton": req.body.contentbutton
            }
        ).then(botones => {
				// Send created customer to client
				res.json(botones);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	Botones2.findAll().then(botones => {
			// Send All Customers to Client
			res.json(botones.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_boton;
	Botones2.update( req.body, 
			{ where: {id_boton: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	Botones2.destroy({
			where: { id_boton: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque informativo con Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdELM = (req, res) => {
	const id= req.params.id_elemento;
	Botones2.findAll({
		where: { id_elemento: id }
	}).then(botones => {
			// Send All Customers to Client
			res.json(botones.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findBoton = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_ELM= obj.id_elemento;
	const tl= obj.title;
	Botones2.findAll({
		where: { id_elemento: id_ELM, titlebutton: tl }
	}).then(botones => {
			// Send All Customers to Client
			res.json(botones.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdELM= (req, res) => {
	const id = req.params.id_elemento;
	Elementos2.destroy({
			where: { id_elemento: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};