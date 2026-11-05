import { Document } from "mongoose";
import { ILocalizedString } from "../service/service.interface";

export type IProjectSectorSlug =
  | "all"
  | "systems-integration"
  | "construction"
  | "facility-services"
  | "manpower"
  | "environmental";

export type IProjectStatusCode = "Ongoing" | "Completed" | "Planning";

export interface IProjectImage {
  url: string;
  public_id?: string;
}

export interface IProject extends Document {
  projectId: string; // e.g. "proj-1", "flagship-king-salman-park"
  title: ILocalizedString;
  sector: ILocalizedString;
  sectorSlug: IProjectSectorSlug;
  status: ILocalizedString;
  statusCode: IProjectStatusCode;
  location: ILocalizedString;
  regionId: string; // e.g. "riyadh", "tabuk", "eastern-province", "makkah", "madinah", "al-jawf", "asir"
  description: ILocalizedString;
  value: ILocalizedString; // e.g. "SAR 480M" / "480 مليون ريال"
  year: string; // e.g. "2025"
  progress: number; // 0 to 100
  image: IProjectImage;
  isFlagship: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectStat {
  target: number;
  prefix?: string;
  prefixAr?: string;
  suffix?: string;
  suffixAr?: string;
  unit?: string;
  unitAr?: string;
  decimals?: number;
  label: ILocalizedString;
  order?: number;
}
