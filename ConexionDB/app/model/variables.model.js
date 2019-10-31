module.exports = (sequelize, Sequelize) => {
	const Variables = sequelize.define('variables', {
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
   Variables.removeAttribute('id');
    
	return Variables;
}