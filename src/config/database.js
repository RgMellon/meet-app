// require('dotenv/config');

// console.log(process.env);

module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'meetap',
  database: 'meetapp',
  port: '5433',

  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
};
