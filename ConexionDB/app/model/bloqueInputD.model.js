module.exports = (sequelize, Sequelize) => {
	const BloqueInputDinamico = sequelize.define('bloqueinputdinamico', {
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
        validacion: {
            type: Sequelize.STRING
        },
        default_id: {
            type: Sequelize.STRING
        },
        save_var: {
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
        modelName: 'bloqueinputdinamico'
        // options
    }
    );
    BloqueInputDinamico.removeAttribute('id');
    
	return BloqueInputDinamico;
}