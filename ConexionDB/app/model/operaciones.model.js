module.exports = (sequelize, Sequelize) => {
	const Operaciones = sequelize.define('operaciones', {
        id_block:{
			type: Sequelize.STRING
	    },
        order_opc:{
			type: Sequelize.STRING
	    },
        type_operation:{
			type: Sequelize.STRING
	    },
        new_exist:{
			type: Sequelize.STRING
	    },
        id_var_1:{
			type: Sequelize.STRING
	    },
        opc_operation:{
			type: Sequelize.STRING
	    },
        id_var_2:{
			type: Sequelize.STRING
	    },
        opc_nextid:{
			type: Sequelize.STRING
	    },
        next_id:{
			type: Sequelize.STRING
	    }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'operaciones'
        // options
    }
    );
    Operaciones.removeAttribute('id');
    
	return Operaciones;
}