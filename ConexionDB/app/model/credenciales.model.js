module.exports = (sequelize, Sequelize) => {
	const CredencialesAPIs = sequelize.define('credencialesapis', {
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
    CredencialesAPIs.removeAttribute('id');
    
	return CredencialesAPIs;
}