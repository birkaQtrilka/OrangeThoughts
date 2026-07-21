import { Project } from '../../models/project.model';

export const PROJECT_PROPOSALS_PLEASE: Project = {
  id: 'proposals-please',
  title: 'Proposals Please',
  videoPath: {
    isIframe: true,
    path: 'assets/Games/ProposalsPlease/index.html',
    hideOnMobile: true
  },
  tags: ['C#', 'unity', 'Game Development'],
  height: '600px',
  description: `
      <h3>Game</h3>
      <p>
        &emsp; A retro game where you play as a business owner that needs to approve or disapprove business automation proposals.
      </p>
      <h3>Details</h3>
      <p>
        &emsp; It was a passion project made as the interactive segment for an educational presentation about process automation.
        I used gamification to keep the user engaged into a rather boring process of reading documents to decide if a process is worth automating.
        Game mechanics at the time of release:<br>
        <br>&emsp;* Approving/Disapproving papers
        <br>&emsp;* A queue of people can form if player is too slow on deciding
        <br>&emsp;* A counter that forces game end if it reaches 0
        <br>&emsp;* A score that goes up or down depending on the correctness of the decision
        <br>&emsp;* A bomb explosion when game ends
      </p>
      <h3>Things learned</h3>
      <p>
        &emsp; In making this game, I learned how to render the environment using render textures and how to layer them 
        to achieve different effects. For example, I wanted the papers to not be pixelated, so their text can be readable. 
        Additionally, I learned how to do animations/movement using scripting by making my own spline system. And last 
        but not least, I did some sound design, so the game feels more punchy.
      </p>
      `,
  timeSpent: '1 week',

};
