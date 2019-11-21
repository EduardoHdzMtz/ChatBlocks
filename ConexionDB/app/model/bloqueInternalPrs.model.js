module.exports = (sequelize, Sequelize) => {
	const BloqueInternalPrs = sequelize.define('internal_process', {
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
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'internal_process'
        // options
    }
    );
    BloqueInternalPrs.removeAttribute('id');
    
	return BloqueInternalPrs;
}