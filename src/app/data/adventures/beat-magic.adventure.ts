import { CodingAdventure } from "../../models/coding-adventure.model";

export const CODING_BEAT_MAGIC: CodingAdventure = {
  id: 'CODING_BEAT_MAGIC',
  title: 'Beat Magic',
  videoPath: {isIframe: true, path: 'https://www.youtube.com/embed/reayt37_DtA?si=Y5EuCafbzTLnebaa'},
  tags: [
    'Unity',
    'University Project'
  ],
  description: `
    <h3>Game</h3>
    <p>
      &emsp; You play in a constantly moving world, where music can create objects out of thin air. 
      Use your newly discovered spells to find the secrets of this magic. Beware, your curiosity is 
      a threat to the harmony created by “the blocks”, unfriendly entities that survive by keeping 
      things on the beat.
    </p>
    <p>
      &emsp; In this project, I learned how to synchronize sounds with game mechanics because the 
      sound logic lives on a different thread in Unity. I also challenged myself by creating a 
      different way of moving: lerping based on beat duration. Each enemy has a list of actions 
      that they have to perform one at a time per beat, so you see these satisfying synchronous 
      movements. I must be honest, making the player fall naturally was a tough thing to design 
      in that movement system.
      <br>&emsp; Additionally, I used the tile rule system for the first time, which was fun.
      <br>&emsp; Lastly, in this project, I used extensively unity events and realized their power. 
      You can script not only with code but also with the inspector.
      <br><br>
      &emsp; Before all the programming, I wrote a 13 page Game Design Document which I had to 
      follow. This helped me learn a lot on how to plan my code architecture.
    </p>
  `,
  timeSpent: '3 weeks',
  images: [],
  githubLink: 'https://github.com/birkaQtrilka/GameDesign'
};