import Fastify from "fastify";

const server = Fastify();

server.get("/", async () => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await server.listen({ port: 8080 });
    console.log(`Server is running at http://localhost:8080`);
  } catch (err) {
    console.error(err);
    server.log.error(err);
    process.exit(1);
  }
};

start();
