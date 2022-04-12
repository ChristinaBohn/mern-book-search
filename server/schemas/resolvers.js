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
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Email is incorrect!');
            }

            const isCorrectPassword = await User.isCorrectPassword(password);

            if (!correctPassword) throw new AuthenticationError('Password is incorrect!');

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = User.findOneAndUpdate(
                    {_id: context.user._id },
                    { 
                        $addToSet: {savedBooks: args.bookData},
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                return updatedUser
            }
            throw new AuthenticationError('Not logged in!');
          },

        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser =  User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                      $pull: {savedBooks: { bookId: args.bookId } },
                    },
                    { new: true }
                  );
    
                  return updatedUser;
            }
            throw new AuthenticationError('Not logged in!');
        }
    }
};

module.exports = resolvers;