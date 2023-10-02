const {
  addItemHandler,
  getAllItemsHandler,
  getItemsByIdHandler,
  editItemsByIdHandler,
  deleteItemByIdHandler,
  getItemsHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addItemHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllItemsHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getItemsByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editItemsByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteItemByIdHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getItemsHandler,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: () => 'Halaman tidak ditemukan',
  },
];

module.exports = routes;
