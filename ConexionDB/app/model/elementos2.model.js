module.exports = (sequelize, Sequelize) => {
	const Elementos2 = sequelize.define('elementos', {
      id_elements:{
        type: Sequelize.STRING,
        primaryKey: true
	    },
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
	    },
      opc_nextid:{
        type: Sequelize.STRING
      },
      nextid:{
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
    Elementos2.removeAttribute('id');
    
	return Elementos2;
}