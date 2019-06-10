module.exports = (sequelize, Sequelize) => {
	const LinksAPIs = sequelize.define('linksapis', {
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
    LinksAPIs.removeAttribute('id');
    
	return LinksAPIs;
}