module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('meetapps', 'canceled_at', {
    type: Sequelize.DATE,
    allowNull: true,
  }),

  down: queryInterface => queryInterface.removeColumn('canceled_at'),
};
