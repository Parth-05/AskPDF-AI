import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { action } from "./_generated/server.js";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText, // Array
      // args.fileId, // string
      args.splitText.map(() => ({ fileId: args.fileId })), // Metadata for each text
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyDsnaafynPV0DApK1MVwjZu78pnRWr_b6E",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
    return "Added embedded document"
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyDsnaafynPV0DApK1MVwjZu78pnRWr_b6E",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      })
      , { ctx });
    const resultOne = await (await vectorStore.similaritySearch(args.query, 1))
                              .filter(q => q.metadata.fileId == args.fileId)
    console.log(resultOne);
    return JSON.stringify(resultOne);
  },
});