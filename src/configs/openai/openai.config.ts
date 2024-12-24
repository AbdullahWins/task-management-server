//src/config/openai.ts
import OpenAI from "openai";
import { environment } from "../environment/environment.config";

export const openai = new OpenAI({
  apiKey: environment.openai.OPENAI_API_KEY,
});
