import { CodingAdventure } from "../../models/coding-adventure.model";

export const CODING_PHYSICS: CodingAdventure = {
  id: 'Physics',
  title: 'Physics Engine',
  videoPath: { isIframe: false, path: 'https://res.cloudinary.com/uj9ir4ss/video/upload/v1783590537/physics_d3c7z8.mp4' },
  tags: ['GxpEngine', 'University Project'],
  description: `
    &emsp; A physics engine that handles continuous collisions between circles, angled lines, and AABBs. It doesn't support rotation yet.
    My aim was to improve my math and physics skills, especially in vectors as it's so prevalent in game development.
    <br>&emsp;The main challenge was to solve the weird edge cases.. literally. The circles would bounce weirdly at the corners of 
    rectangles and at the ends of segments. To solve this, I added "caps". These are circles placed at the ends of segments that have the 
    radius set to zero.
  `,
  timeSpent: '2 weeks',
  images: ['/assets/Images/SideProjects/Physics.png'],
  githubLink: 'https://github.com/birkaQtrilka/Simple-Physics/tree/main/gxpengine_template/MyClasses/TankGame/PhysicsEngine'
};
