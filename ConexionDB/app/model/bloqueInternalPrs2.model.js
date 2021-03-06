module.exports = (sequelize, Sequelize) => {
	const BloqueInternalPrs2 = sequelize.define('internal_process', {
        id_block: {
            type: Sequelize.STRING,
            primaryKey: true
	    },
	    id_robot: {
		    type: Sequelize.STRING
        },
        namestate: {
			type: Sequelize.STRING
	    },
        opc_nextid: {
            type: Sequelize.STRING
        },
        default_nextid: {
            type: Sequelize.STRING
        },
        blocktype: {
            type: Sequelize.STRING
        },
        pos_x: {
            type: Sequelize.STRING
        },
        pos_y: {
            type: Sequelize.STRING
        },
        tag_active: {
            type: Sequelize.BOOLEAN
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'internal_process'
        // options
    }
    );
    BloqueInternalPrs2.removeAttribute('id');
    
	return BloqueInternalPrs2;
}