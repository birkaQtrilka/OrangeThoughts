import { CodingAdventure } from "../../../models/coding-adventure.model";

export const CODING_DOTS: CodingAdventure = {
  id: 'DOTS',
  title: 'Unity DOTS and BOIDS',
  videoPath: '/assets/videos/Boids3D_Short.mp4',
  tags: ['Unity', 'Side-Project'],
  description: `
    &emsp; Because the Unity Data Oriented Technology Stack was released, I decided to learn it by doing a project. I use the 
    earlier learned <a href="Coding adventures.html#Boids">Boids Algorithm</a> as the problem to optimize. However, this time 
    I use an easier space partitioning algorithm, so I can focus more on how DOTS works. The way it works is that a region in 
    space has its hash code that is used as a key in a HashTable. The limitation is that boids interact only in the bounds of a 
    particular cell and not in their respective perception radius.
    <br>&emsp; The main challenge I encountered was to find the right documentation to learn from. Many tutorials use deprecated 
    functions and even workflows.
  `,
  timeSpent: '4 days',
  images: ['/assets/Images/SideProjects/DOTS.png'],
  githubLink: 'https://github.com/birkaQtrilka/BoidsWithDOTS/blob/main/Assets/BoidSystem.cs'
};
