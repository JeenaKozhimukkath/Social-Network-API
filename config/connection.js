const { connect, connection } = require('mongoose');

connect('mongodb://localhost/social-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;