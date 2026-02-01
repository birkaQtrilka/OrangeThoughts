import { Project } from '../../models/project.model';

export const PROJECT_BALL_BLAZE: Project = {
  id: 'ball-blaze',
  title: 'Ball Blaze',
  videoPath: {
    isIframe: true,
    path: 'https://www.youtube.com/embed/VZPgS2hYo4c?si=GAaVJJXlZwwvnrGY'
  },
  tags: ['C#', 'GxpEngine', '2D Physics', 'Team Project', 'Game Development'],
  description: `
      <h3>Game</h3>
      <p>
        &emsp; A neon style, golf like game, where the player has to put objects in the environment so the ball reaches the
        hole in one strike.
      </p>
      <h3>My Contributions</h3>
      <p>
        &emsp; In this one week university project, we were a team of 6. I made a continuous 2D physics system that
        implemented ball, rectangle and line
        colliders. It was the result of a month of studying. I learned about what is and when to use the dot product, how to
        get the normal of a
        surface, some edge cases of collisions such as how to counteract the floating point error or sticky physics.
        <br>
        &emsp;Also, I made a working scene manager and a designer friendly interface through <span><a
            href="https://www.mapeditor.org/" target="_blank">Tiled</a></span>.
        I added a prefab system, so we don't have to hard code the data of objects, but rather create it in Tiled and clone it
        everytime we want an instance.

      </p>
      <h3>Soft Skills Development</h3>
      <p>
        &emsp;I was the scrum master and used <span><a href="https://hacknplan.com/">HacknPlan</a></span> (a planning tool) to
        give each team member tasks that we agreed on as a team.
        The mechanics were all planed out in advance. We did user research and analyzed different puzzle games. We also had a
        brainstorming session after which we had
        three prototypes. We tested each prototype and picked the best one based on feedback. After, our designers worked on
        the Game Design Document and the artists drew concept
        art. Meanwhile, I was working on the prefab system and the physics system. When the GDD was almost done, we started
        implementing everything.
        <br>
        &emsp; Probably the biggest problem we had was that we did so well, that we didn't know if we wanted to add more
        content or improve the current ones.
        At the end, we decided to add more content such as levels, backgrounds, sounds, and a website.
      </p>
      `,
  timeSpent: '3 weeks',
  githubLink: 'https://github.com/birkaQtrilka/FinalAproach',
  credits: [
    { name: 'Designer', link: 'https://www.linkedin.com/in/lluis-alguersuari-4831562b9/', linkLabel: 'Lluis Alguersuari' },
    { name: 'Designer', link: 'https://linkedin.com/in/george-didenko-b1b37128b', linkLabel: 'George Didenko' },
    { name: 'Artist', link: 'https://www.linkedin.com/in/andy-tandareanu-9866392ba/', linkLabel: 'Andy Tandareanu' },
    { name: 'Artist', link: 'https://www.linkedin.com/in/nicola-cristea-4a58122a0/', linkLabel: 'Nicola Cristea' },
    { name: 'Engineer', link: 'https://www.linkedin.com/in/ilia-nevrov-3a9934233/', linkLabel: 'Ilia Nevrov' }
  ]
};
