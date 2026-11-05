import { Document } from "mongoose";
import { ILocalizedArray, ILocalizedString } from "../service/service.interface";

export type IDepartmentId =
  | "systems-integration"
  | "construction"
  | "facility-services"
  | "environmental"
  | "manpower";

export interface IJobRequirements {
  education: ILocalizedArray; // Array of education qualifications (en & ar)
  experience: ILocalizedArray; // Array of experience bullets (en & ar)
  licensing: ILocalizedArray; // Array of certifications / training (en & ar)
}

export interface IJobPosition extends Document {
  jobId: string; // unique slug e.g. "sr-systems-integration-engineer"
  title: ILocalizedString;
  departmentId: IDepartmentId;
  department: ILocalizedString;
  location: ILocalizedString;
  type: ILocalizedString; // e.g. "Full-time" / "دوام كامل"
  experience: ILocalizedString; // e.g. "8+ years" / "+٨ سنوات"
  postedDate: string; // "YYYY-MM-DD"
  icon: string; // e.g. "Wrench", "HardHat", "Cpu", "Sparkles", "Users", "Briefcase"
  overview: ILocalizedString; // Job Purpose / Objective
  responsibilities: ILocalizedArray; // Array of key responsibilities bullet points (en & ar)
  requirements: IJobRequirements; // Grouped requirements with arrays
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IApplicationStatus = "Pending" | "Reviewed" | "Shortlisted" | "Rejected";

export interface IApplicationFile {
  url: string;
  public_id?: string;
  filename?: string;
}

export interface IJobApplication extends Document {
  jobId: string; // matches jobPosition.jobId
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  currentCity: string;
  experience: string;
  noticePeriod: string;
  currentEmployer?: string;
  linkedin?: string;
  coverNote?: string;
  cv: IApplicationFile;
  status: IApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}
