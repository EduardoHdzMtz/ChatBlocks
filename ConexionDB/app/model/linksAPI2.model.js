module.exports = (sequelize, Sequelize) => {
	const LinksAPIs2 = sequelize.define('linksapis', {
        id_link:{
            type: Sequelize.STRING,
            primaryKey: true
        },
        blocktype:{
			type: Sequelize.STRING
	    },
        links:{
			type: Sequelize.STRING
	    },
        id_block:{
			type: Sequelize.STRING
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'linksapis'
        // options
    }
    );
    LinksAPIs2.removeAttribute('id');
    
	return LinksAPIs2;
}