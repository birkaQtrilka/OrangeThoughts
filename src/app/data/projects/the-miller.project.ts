import { Project } from "../../models/project.model";

export const PROJECT_THE_MILLER: Project = {
  id: 'the-miller',
  title: 'The Miller',
  videoPath: {
    isIframe: true,
    path: 'https://www.youtube.com/embed/zGLvysscKtU?si=3DQR4ntxzxNjIOU-'
  },
  tags: ['C#', 'Unity', 'Editor Scripting', 'Tool Development'],
  description: `
    <h3>Game Description</h3>
    <p>
      &emsp; A short horror game that takes place in the Northern-Mill of Twickel, Twente.
      You bought the property and now you want to re-check its state. Somehow you get stuck in a
      secret basement that you didn't know about, needing to find your way out.
    </p>
    <h3>My Contributions</h3>
    <p>
      &emsp; In this project, I was responsible for the lighting and environment setup, 
      for game mechanics such as note interaction, NPC behavior, timeline sequencing, 
      player hands animations, UI. I was also the scrum master, 
      keeping track of the project progress and managing the team work load.
    </p>
  `,
  timeSpent: '6 week',
  
  githubLink: 'https://github.com/Tetroit/Project-ShowOff',
  credits: [
    {
      linkLabel: 'Lluis Alguersuari',
      link: 'https://www.linkedin.com/in/lluis-alguersuari-4831562b9/',
      name: 'Writer and level Design'
    },
    {
      linkLabel: 'Rianne Jongerius',
      link: 'https://www.riannejongerius.nl/',
      name: 'Environment Designer'
    },
    {
      linkLabel: 'Connor Smith',
      link: 'https://www.connorsmithcv.com/',
      name: 'Audio Designer'
    },
    {
      linkLabel: 'Kyra Zendman',
      link: 'https://www.linkedin.com/in/kyra-zendman-2467bb223/',
      name: 'Character Art'
    },
    {
      linkLabel: 'Jade Izmirlioglu',
      link: 'https://www.jadeizm.net/',
      name: 'Environment Art'
    },
    {
      linkLabel: 'Ivan Shychynov',
      link: 'https://tetroit.github.io/index.html',
      name: 'Game Programmer'
    },
  ]
};
