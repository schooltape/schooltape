import pino from "pino";

export const logger = pino({
  browser: {
    disabled: !process.env.NODE_ENV || process.env.NODE_ENV === "prod",
    asObject: true,
  },
});
