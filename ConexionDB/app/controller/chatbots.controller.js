const db = require('../config/db.config.js');
const Robots = db.robots;
const Robots2 = db.robots2;



exports.create = (req, res) => {	
	// Save to PostgreSQL database
	Robots.create({
				//	"id_robot": req.body.id_robot, 
				"name_robot": req.body.name_robot, 
				"id_face": req.body.id_face,
				"block_ini": req.body.block_ini,
				"type_blocki": req.body.type_blocki,
				"access_token": req.body.access_token,
				"api_nlp": req.body.api_nlp,
				"id_user": req.body.id_user
            }
        ).then(robots => {
				// Send created customer to client
				res.json(robots);
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findByIdUser = (req, res) => {
	const id= req.params.id_user;
	Robots2.findAll({
		where: { id_user: id }
	}).then(robots => {
			// Send All Customers to Client
			res.json(robots.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.findbotByData = (req, res) => {	
	var obj=JSON.parse(req.params.datos);
	const id= obj.id_user;
	const NB= obj.name_robot;
	Robots2.findAll({
		where: { id_user: id, name_robot: NB }
	}).then(robots => {
			// Send All Customers to Client
			res.json(robots.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};





exports.findAll = (req, res) => {
	Robots.findAll().then(robots => {
			// Send All Customers to Client
			res.json(robots.sort(function(c1, c2){return c1.id - c2.id}));
		}).catch(err => {	
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};


exports.update = (req, res) => {
	const id = req.body.id_robot;
	Robots2.update( req.body, 
			{ where: {id_robot: id} }).then(() => {
				res.status(200).json( { mgs: "Updated Successfully -> Customer Id = " + id } );
			}).catch(err => {
				console.log(err);
				res.status(500).json({msg: "error", details: err});
			});
};


exports.delete = (req, res) => {
	console.log("Id a eliminar-> "+req.params.id)
	const id = req.params.id;
	Robots2.destroy({
			where: { id_robot: id }
		}).then(() => {
			res.status(200).json( { msg: 'Deleted Successfully -> Customer Id = ' + id } );
		}).catch(err => {
			console.log(err);
			res.status(500).json({msg: "error", details: err});
		});
};