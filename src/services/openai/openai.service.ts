// src/services/openai/openai.service.ts
import httpStatus from "http-status";
import { ApiError } from "../errorHandler";
import { openai } from "../../configs";
import { ITask } from "../../interfaces";
import { staticProps } from "../../utils";

const prompts = {
  summarize:
    "You are a precise summarizer. Create concise, clear summaries for my task. It has title, description, duedate in unix time and status. I am giving you a json file with the task data.",
  planToFinish:
    "You are a task planner. Put together a comprehansive plan for my task. It has title, description, duedate in unix time and status. I am giving you a json file with the task data.",
};

const modelName = "chatgpt-4o-latest";

export const generateSummary = async (task: ITask): Promise<string> => {
  if (!task) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Text is required");
  }

  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content: prompts.summarize,
        },
        {
          role: "user",
          content: `Please summarize the following task: ${task}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return (
      response.choices?.[0]?.message?.content ??
      staticProps.openai.SUCCESSFUL_EMPTY_RESPONSE
    );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      staticProps.openai.FAILED_TO_GENERATE_SUMMARY
    );
  }
};

export const generatePlanToFinish = async (task: ITask): Promise<string> => {
  if (!task) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Text is required");
  }

  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content: prompts.planToFinish,
        },
        {
          role: "user",
          content: `Please create a plan for the following task: ${task}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return (
      response.choices?.[0]?.message?.content ??
      staticProps.openai.SUCCESSFUL_EMPTY_RESPONSE
    );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      staticProps.openai.FAILED_TO_GENERATE_PLAN
    );
  }
};
