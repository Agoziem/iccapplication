import { ArticleResponseSchema, ArticleSchema, categorySchema, commentSchema, tagSchema } from "@/schemas/articles";
import { z } from "zod";


export type Tag = z.infer<typeof tagSchema>;

export type Tags = Tag[];

export type ArticleCategory = z.infer<typeof categorySchema>;

export type ArticleCategories = ArticleCategory[];

export type Article = z.infer<typeof ArticleSchema>;

export type ArticlesResponse = z.infer<typeof ArticleResponseSchema>;

export type Articles = Article[];

export type ArticleComment = z.infer<typeof commentSchema>;

export type ArticleComments = ArticleComment[]

