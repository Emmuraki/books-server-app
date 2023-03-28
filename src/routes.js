const {
  addBookhand,
  allgetBook,
  getbookId,
  editBookbyid,
  delbookByid,
} = require('./handler');

const routes = [{
  method: `POST`,
  path: `/books`,
  handler: addBookhand,
},
{
  method: `GET`,
  path: `/books`,
  handler: allgetBook,
},
{
  method: `GET`,
  path: `/books/{id}`,
  handler: getbookId,
},
{
  method: `PUT`,
  path: `/books/{id}`,
  handler: editBookbyid,
},
{
  method: `DELETE`,
  path: `/books/{id}`,
  handler: delbookByid,
},
];

module.exports = routes;
