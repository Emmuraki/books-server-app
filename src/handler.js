const {nanoid} = require('nanoid');
const allbook = require('./books');

const addBookhand = (request, h) => {
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

  const id = nanoid(15);
  const insertedAt = new Date().toDateString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const createBook = {
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

  if (createBook.name === undefined) {
    const response = h.response({
      'status': `fail`,
      'message': `Gagal menambahkan buku. Mohon isi nama buku`,
    });

    response.code(400);
    return response;
  } else if (createBook.readPage > createBook.pageCount) {
    const response = h.response({
      'status': 'fail',
      // eslint-disable-next-line max-len
      'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  allbook.push(createBook);

  const success = allbook.filter((iBook) => iBook.id === id).length > 0;
  if (success) {
    const response = h.response({
      'status': `success`,
      'message': `Buku berhasil ditambahkan`,
      'data': {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }
};

const allgetBook = (request, h) => {
  const {name, reading, finished} = request.query;
  const books = allbook.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));


  if (name !== undefined && name !== '') {
    // eslint-disable-next-line max-len
    const books = allbook.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()))
        .map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        }));
    if (books.length !== 0) {
      return {
        status: 'success',
        data: {books},
      };
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  } else if (reading !== undefined && reading !== '') {
    const nReading = reading == 1;
    const books = allbook.filter((b) => b.reading == nReading)
        .map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        }));
    if (books.length !== 0) {
      return {
        status: 'success',
        data: {books},
      };
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  } else if (finished !== undefined && finished !== '') {
    const nFinish = finished == 1;
    const books = allbook.filter((b) => b.finished == nFinish)
        .map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        }));
    if (books.length !== 0) {
      return {
        status: 'success',
        data: {books},
      };
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }


  const response = h.response({
    'status': 'success',
    'data': {
      books,
    },
  });
  response.code(200);
  return response;
};

const getbookId = (request, h) => {
  const {id} = request.params;

  const book = allbook.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: `success`,
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

const editBookbyid = (request, h) => {
  const {id} = request.params;
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
  const updatedAt = new Date().toDateString();
  const indBook = allbook.findIndex((indeBox) => indeBox.id === id);
  const idBook = allbook.filter((n) => n.id === id)[0];
  if (idBook !== undefined) {
    if (indBook !== -1) {
      allbook[indBook] = {
        ...allbook[indBook],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };

      if (allbook[indBook].name === undefined) {
        const response = h.response({
          'status': 'fail',
          'message': 'Gagal memperbarui buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
      } else if (allbook[indBook].readPage > allbook[indBook].pageCount) {
        const response = h.response({
          'status': 'fail',
          // eslint-disable-next-line max-len
          'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
      }

      const response = h.response({
        'status': 'success',
        'message': 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
  };
  const response = h.response({
    'status': 'fail',
    'message': 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


const delbookByid = (request, h) => {
  const {id} = request.params;
  const indBook = allbook.findIndex((indeBox) => indeBox.id === id);

  if (indBook !== -1) {
    allbook.splice(indBook, 1);
    const response = h.response({
      'status': 'success',
      'message': 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    'status': 'fail',
    'message': 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookhand,
  allgetBook,
  getbookId,
  editBookbyid,
  delbookByid,
};
