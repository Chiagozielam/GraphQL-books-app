const graphql = require("graphql");
const _ = require("lodash");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = graphql;

// dummy Data
var books = [
  { name: "sands", genre: "love", id: "1", authorId: "1" },
  { name: "fairytale", genre: "fiction", id: "2", authorId: "2" },
  { name: "blockout", genre: "horror", id: "3", authorId: "3" },
  { name: "The Rock", genre: "fantasy", id: "4", authorId: "2" },
  { name: "universe", genre: "Sci-Fi", id: "5", authorId: "2" },
  { name: "guns", genre: "action", id: "6", authorId: "3" },
  { name: "intimate", genre: "romance", id: "7", authorId: "3" }
];

var authors = [
    {name: "Daniel Don", age: "28", id: "1"},
    {name: "Joseph Don", age: "48", id: "2"},
    {name: "Ebenezer Don", age: "38", id: "3"}
]

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
        type: AuthorType,
        resolve(parent, args){
            return _.find(authors, {id: parent.authorId})
        }
    }
  })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      age: { type: GraphQLString },
      books: {
          type: new GraphQLList(BookType),
          resolve(parent, args){
              return _.filter(books, {authorId: parent.id})
          }
      }
    })
  });

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID }
      },

      resolve(parent, args) {
        // code to get data from db / other source
        return _.find(books, { id: args.id });
      }
    },

    author: {
        type: AuthorType,
        args: {
            id: {type: GraphQLID}
        },
        resolve(parent, args) {
            return _.find(authors, {id: args.id})
        }
    },

    books: {
        type: new GraphQLList(BookType),
        resolve(parent, args){
            return  books
        }
    },

    authors: {
        type: new GraphQLList(AuthorType),
        resolve(parent, args){
            return authors
        }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
