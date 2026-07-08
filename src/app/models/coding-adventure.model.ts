import { VideoPath } from "./video-path.model";

export interface CodingAdventure {
  id: string;
  title: string;
  videoPath: VideoPath;
  tags: string[];
  description: string;
  timeSpent: string;
  images: string[];
  githubLink: string;
}