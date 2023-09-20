require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumServices');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongService');
const SongsValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/postgres/UserService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentication');
const AuthenticationsService = require('./services/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const playlist = require('./api/playlists');
const PlaylistService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/playlists');

const collaborations = require('./api/collaboration');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaboration');

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('musicsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    }, {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    }, {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    }, {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: PlaylistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService: CollaborationsService,
        playlistService: PlaylistService,
        validator: CollaborationsValidator,
      },
    },
  ]);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
