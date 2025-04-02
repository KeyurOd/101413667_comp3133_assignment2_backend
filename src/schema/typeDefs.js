// src/schema/typeDefs.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    id: ID!
    name: String!
    department: String!
    position: String!
    profilePicture: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    me: User
    employees(department: String, position: String): [Employee]
    employee(id: ID!): Employee
  }

  type Mutation {
    signup(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    addEmployee(name: String!, department: String!, position: String!, profilePicture: String): Employee
    updateEmployee(id: ID!, name: String, department: String, position: String, profilePicture: String): Employee
    deleteEmployee(id: ID!): Employee
  }
`;

module.exports = typeDefs;
