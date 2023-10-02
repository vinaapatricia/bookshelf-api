const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 9000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  // config route
  server.route(routes);
  // start hapi server
  await server.start();
  // listen hapi server
  console.log(`server berjalan pada ${server.info.uri}`);
};

init();
