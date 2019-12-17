module.exports = (sequelize, Sequelize) => {
	const BloqueTicketDinamico2 = sequelize.define('bloqueticketdinamico', {

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
        pos_y: {
            type: Sequelize.STRING
        },
        pos_x: {
            type: Sequelize.STRING
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'bloqueticketdinamico'
        // options
    }
    );
    BloqueTicketDinamico2.removeAttribute('id');
    
	return BloqueTicketDinamico2;
}