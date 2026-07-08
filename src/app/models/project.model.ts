import { Credit } from "./credit.model";
import { VideoPath } from "./video-path.model";

export interface Project {
  id: string;
  title: string;
  videoPath?: VideoPath;
  tags?: string[];
  height?: string;
  description: string;
  timeSpent?: string;
  githubLink?: string;
  downloadLinks?: { label: string; path: string }[];
  credits?: Credit[];
}