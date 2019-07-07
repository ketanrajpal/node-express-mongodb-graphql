const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull
} = graphql;
const _ = require('lodash');
const User = require('../models/user');
const Domain = require('../models/domain');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    domain: {
      type: new GraphQLList(DomainType),
      resolve(parent, args) {
        //return _.filter(domains, { user: parent.id });
        return Domain.find({ user: parent.id });
      }
    }
  })
});

const DomainType = new GraphQLObjectType({
  name: 'Domain',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    verified: {
      type: GraphQLBoolean
    },
    user: {
      type: UserType,
      resolve(parent, args) {
        //return _.find(users, { id: parent.user });
        return User.findById(parent.user);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // get user from the database with id
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        //return _.find(users, { id: args.id });
        return User.findById(args.id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        //return users;
        return User.find({});
      }
    },
    domain: {
      type: DomainType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        //return _.find(domains, { id: args.id });
        return Domain.findById(args.id);
      }
    },
    domains: {
      type: new GraphQLList(DomainType),
      resolve(parent, args) {
        //return domains;
        return Domain.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        type: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let user = new User({ name: args.name, type: args.type });
        return user.save();
      }
    },
    addDomain: {
      type: DomainType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        verified: { type: GraphQLBoolean },
        user: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let domain = new Domain({
          name: args.name,
          verified: args.verified,
          user: args.user
        });
        return domain.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
