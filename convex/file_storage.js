import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const addFileEntryToDb = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    createdBy: v.string()
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert('pdfFiles', {
      fileId: args.fileId,
      fileName: args.fileName,
      fileUrl: args.fileUrl,
      storageId: args.storageId,
      createdBy: args.createdBy
    })
    return "Insert File to Db"
  }
});

export const getFileUrl = mutation({
  args: {
    storageId: v.string()
  },
  handler: async(ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  }
})

export const getFileRecord = query({
  args: {
    fileId: v.string()
  },
  handler: async(ctx, args) => {
    const result = await ctx.db.query('pdfFiles').filter((q) => q.eq(q.field('fileId'), args.fileId)).collect()

    return result[0]
  }
});

// Get current user's files
export const getUserFiles = query({
  args: {
    userEmail: v.optional(v.string())
  },
  handler: async(ctx, args) => {
    if (!args?.userEmail) {
      return;
    }
    const result = await ctx.db.query("pdfFiles").filter((q) => q.eq(q.field("createdBy"), args.userEmail)).collect();

    return result;
  }
})