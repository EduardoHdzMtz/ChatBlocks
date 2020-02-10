module.exports = (sequelize, Sequelize) => {
	const BloqueQRDinamico2 = sequelize.define('bloqueqrdinamico', {
        id_block: {
            type: Sequelize.STRING,
            primaryKey: true
	    },
	    namestate: {
			type: Sequelize.STRING
	    },
	    id_robot: {
		    type: Sequelize.STRING
        },
        contenido: {
            type: Sequelize.STRING
        },
        opciones: {
            type: Sequelize.STRING
        },
        opc_nextid: {
            type: Sequelize.STRING
        },
        next_id: {
            type: Sequelize.STRING
        },
        blocktype: {
            type: Sequelize.STRING
        },
        typingtime: {
            type: Sequelize.STRING
        },
        default_id: {
            type: Sequelize.STRING
        },
        id_var: {
            type: Sequelize.STRING
        },
        pos_y: {
            type: Sequelize.STRING
        },
        pos_x: {
            type: Sequelize.STRING
        },
        tag_active: {
            type: Sequelize.BOOLEAN
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'bloqueqrdinamico'
        // options
    }
    );
    BloqueQRDinamico2.removeAttribute('id');
    
	return BloqueQRDinamico2;
}