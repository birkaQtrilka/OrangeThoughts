import { CodingAdventure } from "../../../models/coding-adventure.model";

export const CODING_BOIDS: CodingAdventure = {
  id: 'Boids',
  title: 'Boids and Quad Trees',
  videoPath: '/assets/videos/boids.mp4',
  tags: ['GxpEngine', 'Side-Project'],
  description: `
    &emsp; Boids simulate flocking behavior. The challenge was optimizing the algorithm: a naive implementation is O(n²).
    <br>&emsp;To solve this, I used a quadtree to reduce neighbor checks. Although bins are technically better for this purpose,
    I chose quadtrees because I found them more fun and useful for future projects.
  `,
  timeSpent: '5 days',
  images: [
    '/assets/Images/SideProjects/Boids.png',
    '/assets/Images/SideProjects/QuadTree.png'
  ],
  githubLink: 'https://github.com/birkaQtrilka/Boids/tree/main/gxpengine_template/GXPEngine/MyClasses'
};
