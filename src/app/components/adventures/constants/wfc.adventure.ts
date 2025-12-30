import { CodingAdventure } from "../../../models/coding-adventure.model";

export const CODING_WFC: CodingAdventure = {
  id: 'WFC',
  title: 'Wave Function Collapse',
  videoPath: '/assets/videos/WFC.mp4',
  tags: ['GxpEngine', 'Side-Project'],
  description: `
    &emsp; A window that's filled with procedurally generated tiles that must connect. 
    It is based on the wave function collapse algorithm:
    <br>&emsp;&emsp; Each tile has a superstate 
    <br>&emsp;&emsp; A random state is picked from the tile with the least superstates
    <br>&emsp;&emsp; Other cells update their superstates based on constraints
    <br>&emsp;&emsp; Repeat.
    <br>&emsp; The challenge was including rotated versions of tiles in the superstates. I added the rotated tiles as separate objects.
  `,
  timeSpent: '3 days',
  images: ['/assets/Images/SideProjects/WFC.png'],
  githubLink: 'https://github.com/birkaQtrilka/WaveFunctionCollapse/blob/main/gxpengine_template/MyClasses/Displayer.cs'
};
