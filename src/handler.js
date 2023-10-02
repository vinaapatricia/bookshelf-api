/* eslint-disable max-len */
const { nanoid } = require('nanoid');

const items = require('./books');

// Kriteria 3 : API dapat menyimpan buku
const addItemHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // validasi properti name
  if (name === undefined) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });

    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newItem = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  items.push(newItem);

  const isSuccess = items.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    });

    response.code(201);

    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
  response.code(500);

  return response;
};

// Kriteria 4 : API dapat menampilkan seluruh buku
const getAllItemsHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // cari dari name status, === 1 : true, === 0 : false
  if (reading !== undefined) {
    const BooksReading = items.filter(
      (book) => Number(book.reading) === Number(reading),
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: BooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);

    return response;
  } if (name !== undefined) {
    const itemsName = items.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h
      .response({
        status: 'success',
        data: {
          books: itemsName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);

    return response;
  } if (finished !== undefined) {
    const BooksFinished = items.filter(
      (book) => book.finished === finished,
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: BooksFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: items.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Kriteria 5 : API dapat menampilkan detail buku
const getItemsByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = items.filter((i) => i.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);

  return response;
};

// Kriteria 6 : API dapat mengubah data buku
const editItemsByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = items.findIndex((book) => book.bookId === bookId);

  // Check if the 'name' property is missing in the request body
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  // Check if 'readPage' is greater than 'pageCount' in the request body
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  // If the book with the given ID is found
  if (index !== -1) {
    items[index] = {
      ...items[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // If the book with the given ID is not found
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

// Kriteria 7 : API dapat menghapus buku
const deleteItemByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = items.findIndex((book) => book.id === bookId);

  // book dengan id dicari ditemukan
  if (index !== -1) {
    items.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  // jika book dgn id yg dicari tdk ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

// opsional
const getItemsHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // filter dari query params
  let filteredBooks = [...items];

  if (name) {
    // filter dr nama case sensi
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading === '0') {
    // Filter dr buku yg blm di baca
    filteredBooks = filteredBooks.filter((book) => !book.reading);
  } else if (reading === '1') {
    // filter untuk buku yg udah dibaca
    filteredBooks = filteredBooks.filter((book) => book.reading);
  }

  if (finished === '0') {
    // filter untuk buku yg blm kelar
    filteredBooks = filteredBooks.filter((book) => !book.finished);
  } else if (finished === '1') {
    // filter untuk buku yg udah kelar
    filteredBooks = filteredBooks.filter((book) => book.finished);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks,
    },
  }).code(200);

  return response;
};

module.exports = {
  addItemHandler,
  getAllItemsHandler,
  getItemsByIdHandler,
  editItemsByIdHandler,
  deleteItemByIdHandler,
  getItemsHandler,
};
