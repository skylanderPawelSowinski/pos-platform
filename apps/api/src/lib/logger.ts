import pino from "pino";

const nodeEnv = process.env.NODE_ENV;

const level =
  nodeEnv === "test" ? "silent" : nodeEnv === "production" ? "info" : "debug";

export const logger = pino({
  level,

  transport:
    nodeEnv === "development"
      ? {
          target: "pino-pretty",
        }
      : undefined,
});
