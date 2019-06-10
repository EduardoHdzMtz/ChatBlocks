module.exports = (sequelize, Sequelize) => {
	const Robots2 = sequelize.define('robots', {
	  id_robot: {
        type: Sequelize.STRING,
        primaryKey: true
	  },
	  name_robot: {
			type: Sequelize.STRING
	  },
	  id_face: {
		  type: Sequelize.STRING
      },
      block_ini: {
          type: Sequelize.STRING
      },
      type_blocki: {
          type: Sequelize.STRING
      },
      access_token: {
          type: Sequelize.STRING
      },
      api_nlp: {
          type: Sequelize.STRING
      },
      id_user: {
        type: Sequelize.STRING
      }
    });
    Robots2.removeAttribute('id');
    
	return Robots2;
}