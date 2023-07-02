const nanoid = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const mapDBToModel = require('../../utils/mapDBToModel');

class SongService {
    constructor(){
        this._pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration, albumId }){
        const id = nanoid(16);

        const statement = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, albumId]
        };

        const result = await this._pool.query(statement);

        if (!result.rows[0].id){
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
        }

    }

    async editSong(id, { title, year, performer, genre, duration }) {

    }

}

module.exports = SongService;