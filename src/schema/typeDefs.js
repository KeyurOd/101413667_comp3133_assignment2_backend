const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    name: String!
    department: String!
    position: String!
    profilePicture: String
    createdAt: String
    updatedAt: String
  }

  type DeleteResponse {
    success: Boolean!
    message: String
  }

  type Query {
    me: User
    employees(department: String, position: String): [Employee]
    employee(id: ID!): Employee
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    addEmployee(
      firstName: String!, 
      lastName: String!, 
      department: String!, 
      position: String!, 
      profilePicture: String
    ): Employee
    updateEmployee(
      id: ID!, 
      firstName: String, 
      lastName: String, 
      department: String, 
      position: String, 
      profilePicture: String
    ): Employee
    deleteEmployee(id: ID!): DeleteResponse
  }
`;

module.exports = typeDefs;
