const db = require('../config/db.config.js');
const Operaciones = db.Operaciones;
const Operaciones2 = db.Operaciones2;

exports.create = (req, res) => {	
	// Save to PostgreSQL database
	Operaciones.create({
				"id_block": req.body.id_block,
                "order_opc": req.body.order_opc,
                "type_operation": req.body.type_operation,
                "new_exist": req.body.new_exist,
                "id_var_1": req.body.id_var_1,
                "opc_operation": req.body.opc_operation,
                "id_var_2": req.body.id_var_2,
                "opc_nextid": req.body.opc_nextid,
                "next_id": req.body.next_id
            }
        ).then(Operaciones => {
				// Send created customer to client
				res.json(Operaciones);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	Operaciones2.findAll().then(Operaciones => {
			// Send All Customers to Client
			res.json(Operaciones.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_operacion;
	Operaciones2.update( req.body, 
			{ where: {id_operacion: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	Operaciones2.destroy({
			where: { id_operacion: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fue eliminado el bloque informativo con Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findByIdBLK = (req, res) => {
	const id= req.params.id_block;
	Operaciones2.findAll({
		where: { id_block: id }
	}).then(Operaciones => {
			// Send All Customers to Client
			res.json(Operaciones.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findOperacion  = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_blk= obj.id_block;
	const order= obj.order_opc;
	Operaciones2.findAll({
		where: { id_block: id_blk, order_opc: order }
	}).then(Operaciones => {
			// Send All Customers to Client
			res.json(Operaciones.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBlk = (req, res) => {
	const id = req.params.id_block;
	Operaciones2.destroy({
			where: { id_block: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};