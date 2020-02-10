module.exports = (sequelize, Sequelize) => {
	const BloqueInfo = sequelize.define('bloqueinfo', {

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
        },
        tag_active: {
            type: Sequelize.BOOLEAN
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'bloqueinfo'
        // options
    }
    );
    BloqueInfo.removeAttribute('id');
    
	return BloqueInfo;
}









/*const Model = Sequelize.Model;
class BloqueInfo extends Model {}
BloqueInfo.init({
  // attributes
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
        }
}, {
  sequelize,
  freezeTableName: true,
  modelName: 'bloqueinfo'
  // options
});*/