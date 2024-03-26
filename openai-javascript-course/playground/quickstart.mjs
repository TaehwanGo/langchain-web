import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { exec } from "child_process";

// export OPENAI_API_KEY=<>
// export SERPAPI_API_KEY=<>
// Replace with your API keys!

// to run, go to terminal and enter: cd playground
// then enter: node quickstart.mjs
console.log("Welcome to the LangChain Quickstart Module!");

const template =
  "You are a director of social media with 30 years of experience. Please give me some ideas for content I should write about regarding {topic}.? The content is for {socialplatform}. Translate to {language}.";
const prompt = new PromptTemplate({
  template,
  inputVariables: ["topic", "socialplatform", "language"],
});

const formattedPromptTemplate = await prompt.format({
  topic: "artificial intelligence",
  socialplatform: "Twitter",
  language: "Korean",
});

console.log({ formattedPromptTemplate });

// node quickstart.mjs

/**
 * LLM Chain
 * - 1. Creates Prompt Template (format)
 * - 2. Call to OpenAI
 *
 * temperature
 * - 0: not creative
 * - 1: creative
 */

const model = new OpenAI({
  temperature: 0.9,
});

const chain = new LLMChain({
  prompt,
  llm: model,
});

const resChain = await chain.call({
  topic: "artificial intelligence",
  socialplatform: "Twitter",
  language: "Korean",
});

console.log({ resChain });

// Chain : pre-defined --- 1. research => API call. 2. summarize research
// Agent : task + tools => it figures out what to do

const agentModel = new OpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

// https://platform.openai.com/docs/models/overview

const tools = [new SerpAPI(process.env.SERPAPI_API_KEY), new Calculator()];

const executer = await initializeAgentExecutorWithOptions(tools, agentModel, {
  agentType: "zero-shot-react-description",
  verbose: true,
  maxIterations: 5,
});

// TODO input 부터(1.9 15:00~)
