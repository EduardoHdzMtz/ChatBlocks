const db = require('../config/db.config.js');
const BloqueTicket = db.bloqueticket;
const BloqueTicket2 = db.bloqueticket2;

exports.create = (req, res) => {	
	// Save to PostgreSQL database
	BloqueTicket.create({
				//"id_block": req.body.id_block, 
				"namestate": req.body.namestate, 
				"id_robot": req.body.id_robot,
				"opc_nextid": req.body.opc_nextid,
				"next_id": req.body.next_id,
				"blocktype": req.body.blocktype,
				"typingtime": req.body.typingtime,
				"pos_y": req.body.pos_y,	
                "pos_x": req.body.pos_x,
                "currency": req.body.currency,
                "rescue_var": req.body.rescue_var,
                "shipping_cost": req.body.shipping_cost,
                "total_taxes": req.body.total_taxes,
                "street1_var": req.body.street1_var,
                "street2_var": req.body.street2_var,
                "city_var": req.body.city_var,
                "pc_var":req.body.pc_var,
                "state_var": req.body.state_var,
                "country_var": req.body.country_var,
                "paymethod_var": req.body.paymethod_var,
				"nameu_var": req.body.nameu_var,
				"tag_active": req.body.tag_active,
            }
        ).then(bloqueticket => {
				// Send created customer to client
				res.json(bloqueticket);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findAll = (req, res) => {
	BloqueTicket2.findAll().then(bloqueticket => {
			// Send All Customers to Client
			res.json(bloqueticket.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_block;
	BloqueTicket2.update( req.body, 
			{ where: {id_block: id} }).then(() => {
				res.status(200).json( { mgs: "Fue actualizado el bloque informativo con Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	const id = req.params.id;
	BloqueTicket2.destroy({
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
	BloqueTicket2.findAll({
		where: { id_robot: id }
	}).then(bloqueticket => {
			// Send All Customers to Client
			res.json(bloqueticket.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};

exports.findBloque = (req, res) => {
	var obj=JSON.parse(req.params.datos);
	const id_bot= obj.id_robot;
	const NS= obj.namestate;
	BloqueTicket2.findAll({
		where: { id_robot: id_bot, namestate: NS }
	}).then(bloqueticket => {
			// Send All Customers to Client
			res.json(bloqueticket.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.deleteByIdBot = (req, res) => {
	const id = req.params.id_robot;
	BloqueTicket2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Fueron eliminados los bloques informativos con Id_robot = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};