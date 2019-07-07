const express = require('express');
const graphqlHttp = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const cors = require('cors');

const application = express();

// administrator  JrwJGv95Uwnep4kT

application.use(cors());

mongoose.connect(
  'mongodb+srv://administrator:JrwJGv95Uwnep4kT@cluster0-alb7r.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);
mongoose.connection.once('open', () => {
  console.log('connected to the database');
});

application.use(
  '/graphql',
  graphqlHttp({
    schema,
    graphiql: true
  })
);

application.listen(5000, () => {
  console.log('Leads app running...');
});
