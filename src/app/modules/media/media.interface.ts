import { Document } from "mongoose";
import { ILocalizedString } from "../service/service.interface";

export interface IMediaImage {
  url: string;
  public_id?: string;
}

export interface IMediaPost extends Document {
  slug: string;
  title: ILocalizedString;
  category: ILocalizedString;
  excerpt: ILocalizedString;
  body: ILocalizedString;
  image: IMediaImage;
  date: string; // ISO format: "YYYY-MM-DD"
  author?: ILocalizedString;
  readTime?: ILocalizedString;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
