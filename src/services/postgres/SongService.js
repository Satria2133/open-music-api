/* eslint-disable no-underscore-dangle */
const nanoid = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const mapDBToModel = require('../../utils/index');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const statement = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, createdAt, updatedAt],
    };

    const result = await this._pool.query(statement);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const songs = await this._pool.query('SELECT id, title, performer FROM songs');
    return songs.rows.map(mapDBToModel);
  }

  async getSong(id) {
    const statement = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editSongbyId(id, {
    title, year, performer, genre, duration,
  }) {
    const updateAt = new Date().toISOString();
    const statement = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, update_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updateAt, id],
    };

    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const statement = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
