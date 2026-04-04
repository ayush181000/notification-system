import type { FastifyReply } from "fastify";

export function successResponseHelper(reply: FastifyReply): void;
export function successResponseHelper<T extends object>(
  reply: FastifyReply,
  data: T,
): void;
export function successResponseHelper<T extends object>(
  reply: FastifyReply,
  data: T,
  httpCode: number,
): void;
export function successResponseHelper<T extends object>(
  reply: FastifyReply,
  data: T,
  httpCode: number,
  statusCode: string,
): void;
export function successResponseHelper<T extends object>(
  reply: FastifyReply,
  data: T,
  httpCode: number,
  statusCode: string,
  message: string,
): void;

export function successResponseHelper(
  reply: FastifyReply,
  data = {},
  httpCode: number = 200,
  statusCode: string = "SUCCESS",
  message: string = "Successful",
) {
  reply.status(httpCode).send({
    success: true,
    data: data,
    code: statusCode,
    message: message,
  });
}
