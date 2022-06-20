import Product from "../models/Product";

const resolvers = {
  Query: {
    products: async (root, args, {req, res}) => {
      const products = await Product.find();
      return products;
    },
    product: async (root, args, {req, res}) => {
      const product = await Product.findById(args.id);
      return product;
    }
  },
  Mutation: {
    createProduct: async (root, args, {req, res}) => {
      const product = new Product(args);
      try {
        await product.save();
        return "Product created successfully";
      } catch (error) {
        return error;
      }
    },
    updateProduct: async (root, args, {req, res}) => {
      try {
        await Product.findByIdAndUpdate(args.id, args);
        return "Product updated successfully";
      } catch (error) {
        return error;
      }
    },
    deleteProduct: async (root, args, {req, res}) => {
      try {
        await Product.findByIdAndDelete(args.id);
        return "Product deleted successfully";
      } catch (error) {
        return error;
      }
    }
  },
};

export default resolvers;