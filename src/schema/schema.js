const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList } = require('graphql');
const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return prisma.user.findMany();
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const hashedPassword = await bcrypt.hash(args.password, 12);
        const user = await prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          }
        });
        return user;
      }
    },
    login: {
      type: GraphQLString,  
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const user = await prisma.user.findUnique({
          where: { email: args.email }
        });
        if (!user) {
          throw new Error('User not found');
        }

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '1d'
        });

        return token;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
