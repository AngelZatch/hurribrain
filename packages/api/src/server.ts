import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

export const server = Fastify();

export const initializeServer = async () => {
  await server.register(fastifyCors, {
    credentials: true,
    origin: true,
  });

  await server.ready();
};
