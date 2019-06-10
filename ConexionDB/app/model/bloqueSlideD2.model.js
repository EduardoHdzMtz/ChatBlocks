module.exports = (sequelize, Sequelize) => {
	const BloqueSlideDinamico2 = sequelize.define('bloqueslidedinamico', {
        id_block: {
            type: Sequelize.STRING,
            primaryKey: true
	    },
	    namestate: {
			type: Sequelize.STRING
        },
        contenido:{
		    type: Sequelize.STRING
        },
	    id_robot: {
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
        modelName: 'bloqueslidedinamico'
    }
    );
    BloqueSlideDinamico2.removeAttribute('id');
    
	return BloqueSlideDinamico2;
}