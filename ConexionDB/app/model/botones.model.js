module.exports = (sequelize, Sequelize) => {
	const Botones = sequelize.define('botones', {
        id_elemento:{
		    type: Sequelize.STRING
        },
        titlebutton:{
		    type: Sequelize.STRING
        },
        typebutton:{
		    type: Sequelize.STRING
        },
        contentbutton:{
		    type: Sequelize.STRING
        },
        opc_nextid:{
          type: Sequelize.STRING
        }
    },
    {
        sequelize,
        freezeTableName: true,
        modelName: 'botones'
    }
    );
    Botones.removeAttribute('id');
    
	return Botones;
}