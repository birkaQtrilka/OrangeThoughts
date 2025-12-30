import { SafeResourceUrl } from "@angular/platform-browser";
import { Credit } from "./credit.model";

export interface Project {
  id: string;
  title: string;
  videoPath?: {isIframe: boolean; path: SafeResourceUrl};
  tags?: string[];
  description: string;
  timeSpent?: string;
  githubLink?: string;
  downloadLinks?: { label: string; path: string }[];
  credits?: Credit[];
}