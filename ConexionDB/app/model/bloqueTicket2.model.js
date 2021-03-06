module.exports = (sequelize, Sequelize) => {
	const BloqueTicket2 = sequelize.define('bloqueticket', {
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
        opc_nextid: {
            type: Sequelize.STRING
        },
        next_id: {
            type: Sequelize.STRING
        },
        blocktype: {
            type: Sequelize.STRING
        },
        currency: {
            type: Sequelize.STRING
        },
        rescue_var: {
            type: Sequelize.STRING
        },
        shipping_cost: {
            type: Sequelize.STRING
        },
        total_taxes: {
            type: Sequelize.STRING
        },
        street1_var: {
            type: Sequelize.STRING
        },
        street2_var: {
            type: Sequelize.STRING
        },
        city_var: {
            type: Sequelize.STRING
        },
        pc_var: {
            type: Sequelize.STRING
        },
        state_var: {
            type: Sequelize.STRING
        },
        country_var: {
            type: Sequelize.STRING
        },
        paymethod_var: {
            type: Sequelize.STRING
        },
        nameu_var: {
            type: Sequelize.STRING
        },
        id_block: {
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
        modelName: 'bloqueticket'
        // options
    }
    );
    BloqueTicket2.removeAttribute('id');
    
	return BloqueTicket2;
}