import { AsyncLocalStorage } from "node:async_hooks";
import type { FastifyBaseLogger } from "fastify";

type Store = {
  logger: FastifyBaseLogger;
};

export const asyncLocalStorage = new AsyncLocalStorage<Store>();

export const getLogger = () => {
  return asyncLocalStorage.getStore()?.logger;
};
