import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    products: [Product]
    product(id: ID!): Product
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
  }
`;

export default typeDefs;