module.exports = (sequelize, Sequelize) => {
	const Variables2 = sequelize.define('variables', {
        id_var:{
            type: Sequelize.STRING,
            primaryKey: true
        },
        id_operacion:{
			type: Sequelize.STRING
	    },
        opc_type:{
			type: Sequelize.STRING
	    },
        opc_data:{
			type: Sequelize.STRING
	    },
        var:{
			type: Sequelize.STRING
	    }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'variables'
        // options
    }
    );
   Variables2.removeAttribute('id');
    
	return Variables2;
}