const routes = (handler) => [
  {

    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'playlistsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'playlistsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: handler.getPlaylistByIdHandler,
    options: {
      auth: 'playlistsapp_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/playlists/{playlistId}',
    handler: handler.putPlaylistByIdHandler,
    options: {
      auth: 'playlistsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'playlistsapp_jwt',
    },

  },
];

module.exports = routes;
