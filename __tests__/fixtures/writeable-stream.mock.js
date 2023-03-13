const { Writable } = require("stream");

class WriteableStreamMock extends Writable {
  constructor() {
    super();
    this.buffer = "";
  }

  _write(chunk, _, next) {
    this.buffer += chunk;
    next();
  }

  reset() {
    this.buffer = "";
  }
}

module.exports = { WriteableStreamMock };

//
// const WritableMock = new WriteMemory();
//
// const mockCreateWriteStream = jest.fn().mockImplementation(() => {
//   WritableMock.reset();
//   return WritableMock;
// });
//
// const mockFile = jest.fn().mockImplementation(() => {
//   return {
//     createWriteStream: mockCreateWriteStream,
//   };
// });
//
// module.exports = { WritableMock };