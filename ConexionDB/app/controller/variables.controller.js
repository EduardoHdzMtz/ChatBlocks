const db = require('../config/db.config.js');
const Variables = db.Variables;
const Variables2 = db.Variables2;

exports.create = (req, res) => {	
	// Save to PostgreSQL database
	Variables.create({
				"id_robot": req.body.id_robot,
                "opc_type": req.body.opc_type,
                "opc_data": req.body.opc_data,
                "var": req.body.var
            }
        ).then(Variables => {
				// Send created customer to client
				res.json(Variables);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	Variables2.findAll().then(Variables => {
			// Send All Customers to Client
			res.json(Variables.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_var;
	Variables2.update( req.body, 
			{ where: {id_var: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	Variables2.destroy({
			where: { id_var: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque informativo con Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdVar = (req, res) => {
	const id= req.params.id_var;
	Variables2.findAll({
		where: { id_var: id }
	}).then(Variables => {
			// Send All Customers to Client
			res.json(Variables.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findVar  = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_bot= obj.id_robot;
	const vr= obj.var;
	const opc_d= obj.opc_data;
	Variables2.findAll({
		where: { id_robot: id_bot, var: vr, opc_data: opc_d }
	}).then(Variables => {
			// Send All Customers to Client
			res.json(Variables.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBot = (req, res) => {
	const id = req.params.id_robot;
	Variables2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdRobot = (req, res) => {
	const id= req.params.id_robot;
	Variables2.findAll({
		where: { id_robot: id }
	}).then(Variables => {
			res.json(Variables.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};