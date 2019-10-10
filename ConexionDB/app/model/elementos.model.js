module.exports = (sequelize, Sequelize) => {
	const Elementos = sequelize.define('elementos', {
        id_block:{
			type: Sequelize.STRING
	    },
        blocktype:{
			type: Sequelize.STRING
	    },
        title:{
			type: Sequelize.STRING
	    },
        image_url:{
			type: Sequelize.STRING
	    },
        subtitle:{
			type: Sequelize.STRING
      }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'elementos'
        // options
    }
    );
    Elementos.removeAttribute('id');
    
	return Elementos;
}