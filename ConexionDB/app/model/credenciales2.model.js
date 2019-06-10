module.exports = (sequelize, Sequelize) => {
	const CredencialesAPIs2 = sequelize.define('credencialesapis', {
        id_credencial:{
            type: Sequelize.STRING,
            primaryKey: true
        },
        blocktype:{
			type: Sequelize.STRING
	    },
        namecredencial:{
			type: Sequelize.STRING
	    },
        credencial:{
			type: Sequelize.STRING
        },
        id_block:{
			type: Sequelize.STRING
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'credencialesapis'
        // options
    }
    );
    CredencialesAPIs2.removeAttribute('id');
    
	return CredencialesAPIs2;
}