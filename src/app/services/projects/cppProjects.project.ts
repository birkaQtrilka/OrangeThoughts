import { Project } from "../../models/project.model";

export const PROJECT_CPP_PROJECTS: Project = {
  id: 'cpp-projects',
  title: 'C++ Projects',
  videoPath: { isIframe: false, path: '/assets/videos/cppProjects.mp4' },
  tags: ['C++', 'OpenGL', '3D Rendering'],
  description: `
    <p>
      &emsp; These are the C++ projects I worked on during my studies. In the video you can see the
      order of development, starting with a simple I/O project where I learned how to make a save system.
      Then I learned the basics of 3D rendering with OpenGL, creating a simple engine that can render
      3D models with textures and lighting.
      <br>&emsp; My main challenge was learning how to use OpenGL. Binding elements, VBOs, parallel
      programming were relatively new concepts, so I had to spend time reading documentation and tutorials.
    </p>
  `,
  timeSpent: '8 weeks',
  githubLink: 'https://github.com/birkaQtrilka/3D_Rendering',
  credits: []
};
