/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumbyIdHandler = this.getAlbumbyIdHandler.bind(this);
    this.updateAlbumbyIdHandler = this.updateAlbumbyIdHandler.bind(this);
    this.deleteAlbumbyIdHandler = this.deleteAlbumbyIdHandler.bind(this);
  }

  async postAlbumHandler({ name, year }) {
    const id = nanoid(16);

    const statement = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(statement);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumsHandler() {
    const result = await this._pool.query('SELECT id, name, year FROM albums');
    return result.rows;
  }

  async getAlbumbyIdHandler(id) {
    const statement = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = result.rows[0];
    const songsstatement = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [album.id],
    };

    const songs = await this._pool.query(songsstatement);

    if (songs.rows.length > 0) {
      album.songs = songs.rows;
    }

    return album;
  }

  async updateAlbumbyIdHandler(id, { name, year }) {
    const statement = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async deleteAlbumbyIdHandler(id) {
    const statement = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
