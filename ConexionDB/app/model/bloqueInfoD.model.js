module.exports = (sequelize, Sequelize) => {
	const BloqueInfoDinamico = sequelize.define('bloqueinfodinamico', {

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
        contenttype: {
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
        modelName: 'bloqueinfodinamico'
        // options
    }
    );
    BloqueInfoDinamico.removeAttribute('id');
    
	return BloqueInfoDinamico;
}
