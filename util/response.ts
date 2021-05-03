import { Status } from "../deps.ts";

export function notFound(): Response {
  return new Response("Not found", { status: Status.NotFound });
}
export function noUpdateAvailable(): Response {
  return new Response(null, { status: Status.NoContent });
}

export function json(obj: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(obj), {
    status: init?.status ?? Status.OK,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}
