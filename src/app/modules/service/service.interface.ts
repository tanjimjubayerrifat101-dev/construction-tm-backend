import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface ILocalizedArray {
  en: string[];
  ar: string[];
}

export interface IServiceImage {
  url: string;
  public_id?: string;
}

export interface ISubDiscipline {
  id: string; // unique slug/id like 'electrical', 'hvac'
  tabTitle: ILocalizedString;
  heading: ILocalizedString;
  description: ILocalizedString;
  capabilitiesHeading?: ILocalizedString;
  capabilities?: ILocalizedArray;
  icon?: string; // lucide icon identifier e.g. 'Zap', 'Wrench'
}

export interface ICatalogItem {
  id: string; // unique identifier
  title: ILocalizedString;
  description: ILocalizedString;
  image: IServiceImage;
  badge?: ILocalizedString;
}

export interface IService extends Document {
  slug: string;
  number: string; // e.g. "01", "02"
  name: ILocalizedString;
  shortTitle: ILocalizedString;
  heading: ILocalizedString;
  description: ILocalizedString;
  image: IServiceImage;
  icon: string; // e.g. "Cpu", "Building2"
  tabHeading?: ILocalizedString;
  coreCapabilitiesHeading?: ILocalizedString;
  coreDescription?: ILocalizedString;
  coreCapabilities?: ILocalizedArray;
  catalogHeading?: ILocalizedString;
  subDisciplines: ISubDiscipline[];
  catalogItems: ICatalogItem[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
