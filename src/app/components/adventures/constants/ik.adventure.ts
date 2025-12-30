import { CodingAdventure } from "../../../models/coding-adventure.model";

export const CODING_IK: CodingAdventure = {
  id: 'InverseKinematics',
  title: 'Inverse Kinematics',
  videoPath: '/assets/videos/IK_Progress.mp4',
  tags: ['Unity', 'Side-Project'],
  description: `
    &emsp; I implemented the algorithm for spider walking in a few hours, and left it off when the spider could react to changing heights.
    <br>&emsp; The main challenge was to position the legs uniformly and to make a standing 
    state and a walking state, so the legs don't look odd while idle.
  `,
  timeSpent: '2 days',
  images: ['/assets/Images/SideProjects/Ik_Code.png'],
  githubLink: 'https://github.com/birkaQtrilka/ProceduralAnimation/blob/main/Assets/Spider/LegManager.cs'
};
