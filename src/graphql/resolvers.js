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
    productsInMyCart: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      return authUser.cartProducts;
    },
    savedProducts: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      return authUser.savedProducts;
    }
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
    addToCart: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      const product = await Product.findById(args.productId);
      if (!product) {
        return 'Product not found';
      }
      if (!authUser.cartProducts.includes(product.id)) {
        authUser.cartProducts.push(product.id);
        product.cartBy.push(authUser.id);
        await authUser.save();
        await product.save();
        return 'Product added to cart successfully';
      } else {
        return 'Product already in cart';
      }
    },
    removeFromCart: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      const product = await Product.findById(args.productId);
      if (!product) {
        return 'Product not found';
      }
      if (authUser.cartProducts.includes(product.id)) {
        authUser.cartProducts.splice(authUser.cartProducts.indexOf(product.id), 1);
        product.cartBy.splice(product.cartBy.indexOf(authUser.id), 1);
        await authUser.save();
        await product.save();
        return 'Product removed from cart successfully';
      } else {
        return 'Product not in cart';
      }
    },
    addToSavedProducts: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      const product = await Product.findById(args.productId);
      if (!product) {
        return 'Product not found';
      }
      if (!authUser.savedProducts.includes(product.id)) {
        authUser.savedProducts.push(product.id);
        product.savedBy.push(authUser.id);
        await authUser.save();
        await product.save();
        return 'Product added to saved products successfully';
      } else {
        return 'Product already in saved products';
      }
    },
    removeFromSavedProducts: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      const product = await Product.findById(args.productId);
      if (!product) {
        return 'Product not found';
      }
      if (authUser.savedProducts.includes(product.id)) {
        authUser.savedProducts.splice(authUser.savedProducts.indexOf(product.id), 1);
        product.savedBy.splice(product.savedBy.indexOf(authUser.id), 1);
        await authUser.save();
        await product.save();
        return 'Product removed from saved products successfully';
      } else {
        return 'Product not in saved products';
      }
    }
  },
  User: {
    savedProducts: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      return Product.find({ savedBy: authUser.id });
    },
    cartProducts: async (root, args, { req }) => {
      const authUser = await getAuthUser(req, true);
      return Product.find({ cartBy: authUser.id });
    }
  },
  Product: {
    savedBy: async (root, args, { req }) => {
      await getAuthUser(req, true);
      return User.find({ savedProducts: root.id });
    },
    cartBy: async (root, args, { req }) => {
      await getAuthUser(req, true);
      return User.find({ cartProducts: root.id });
    }
  }
};

export default resolvers;