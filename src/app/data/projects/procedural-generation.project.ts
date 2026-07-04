import { Project } from '../../models/project.model';

export const PROJECT_PROCEDURAL_GENERATION: Project = {
  id: 'procedural-generation',
  title: 'Procedural Generation',
  videoPath: { isIframe: true, path: 'https://www.youtube.com/embed/DZ5OSu2idMM?si=xpWqPIWNGzoO9sC_' },
  tags: ['C#', 'Unity', 'Procedural Generation'],
  description: `
    <p>
      &emsp; An extension of the previous wave function collapse projects, in which I made a space
      partitioning algorithm. It is used to divide neighbourhoods that have random shapes into
      rectangles (houses). Each neighbourhood is a "cluster" that can have different generation 
      settings (e.g. having differently colored buildings).
      <br>&emsp; Another addition was the procedural building generator. It was my introduction to
      generation grammar.
      <br>&emsp; The main challenges were separating the logic from the visuals and creating extensive
      debugging tooling while programming the space partitioning algorithm.
    </p>
  `,
  timeSpent: '2 weeks',
  githubLink: 'https://github.com/birkaQtrilka/Grammar',
  credits: [
    { name: 'Artist', link: 'https://www.linkedin.com/in/kim-van-der-tang-74ba94213/', linkLabel: 'Kim Van Der Tang' }
  ]
};
