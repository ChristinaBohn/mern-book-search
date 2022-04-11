const { AuthenticationError } = require('apollo-server-express');
const { User } = requre('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id}).select('-_v-passowrd');

                return userData;
            }
            throw new AuthenticationError('Not logged in!')
        }
    },

    Mutation: {

    }
};

module.exports resolvers;