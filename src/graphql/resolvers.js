import bcrypt from 'bcryptjs';
import User from '../models/User';
import Product from "../models/Product";
import { issueToken, getAuthUser, getRefreshTokenUser } from '../utils/authentication';
const resolvers = {
  Query: {
    products: async (root, args, {req, res}) => {
      const products = await Product.find();
      return products;
    },
    productsByCategory: async (root, args, {req, res}) => {
      const products = await Product.find({category: args.category});
      return products;
    },
    product: async (root, args, {req, res}) => {
      const product = await Product.findById(args.id);
      return product;
    },
    me: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      return User.findById(authUser.id);
    },
  },
  Mutation: {
    createProduct: async (root, args, {req, res}) => {
      try {
        const authUser = await getAuthUser(req, true);
        if (authUser.userType === 'admin') {
          const product = new Product(args);
          await product.save();
          return "Product created successfully";
        } else {
          return "You are not authorized to create a product";
        }
      } catch (error) {
        return error;
      }
    },
    updateProduct: async (root, args, {req, res}) => {
      try {
        const authUser = await getAuthUser(req, true);
        if (authUser.userType === 'admin') {
          await Product.findByIdAndUpdate(args.id, args);
          return "Product updated successfully";
        } else {
          return "You are not authorized to update product";
        }
      } catch (error) {
        return error;
      }
    },
    deleteProduct: async (root, args, {req, res}) => {
      try {
        const authUser = await getAuthUser(req, true);
        if (authUser.userType === 'admin') {
          await Product.findByIdAndDelete(args.id);
          return "Product deleted successfully";
        } else {
          return "You are not authorized to delete this product";
        }
      } catch (error) {
        return error;
      }
    },
    createUser: async (root, args) => {
      const user = await User.findOne({ email: args.email });
      if (user) {
        return {
          message: 'Email already exists',
          token: null,
          refreshToken: null,
        };
      }
      args.password = await bcrypt.hash(args.password, 10);
      const newUser = await User.create(args);
      const tokens = await issueToken(newUser);
      return {
        message: 'User created successfully',
        ...tokens,
      };
    },
    login: async (root, args) => {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        return {
          message: 'User not found',
          token: null,
          refreshToken: null,
        };
      }
      const isValid = await bcrypt.compare(args.password, user.password);
      if (!isValid) {
        return {
          message: 'Invalid password',
          token: null,
          refreshToken: null,
        };
      }
      const tokens = await issueToken(user);
      return {
        message: 'User logged in successfully',
        ...tokens,
      };
    },
    updateUser: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      await User.findByIdAndUpdate(authUser.id, args, { new: true });
      return 'User updated successfully';
    },
  },
};

export default resolvers;