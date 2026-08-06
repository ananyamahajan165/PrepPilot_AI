import OpenAI from "openai";
import { env } from "../config/env.js";

let client;

const getClient = () => {
  if (!env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is required for AI features."
    );
  }

  if (!client) {
    client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  return client;
};

const lazyClient = new Proxy(
  {},
  {
    get(_target, property) {
      return getClient()[property];
    },
  }
);

export default lazyClient;
