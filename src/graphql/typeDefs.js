import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    products: [Product]
    productsByCategory(category: String): [Product]
    product(id: ID!): Product
    me: User
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    userType: String!
    addressLine: String!
    pinCode: String!
    city: String!
    state: String!
    country: String!
    createdAt: String
  }

  type Auth {
    message: String
    token: String!
    refreshToken: String!
  }

  type Product {
    id: ID!
    name: String!
    price: String!
    description: String
    image: String!
    category: String
    createdAt: String
  }

  type Mutation {
    createProduct(
      name: String!
      price: String!
      description: String
      image: String!
      category: String
    ): String
    updateProduct(
      id: ID!
      name: String!
      price: String!
      description: String
      image: String!
      category: String
    ): String
    deleteProduct(id: ID!): String
    createUser(
      username: String!
      email: String!
      password: String!
      addressLine: String!
      pinCode: String!
      city: String!
      state: String!
      country: String!
    ): Auth
    login(
      email: String!
      password: String!
    ): Auth
    updateUser(
      username: String!
      email: String!
      addressLine: String!
      pinCode: String!
      city: String!
      state: String!
      country: String!
    ): String!
    deleteUser(id: ID!): String
  }
`;

export default typeDefs;