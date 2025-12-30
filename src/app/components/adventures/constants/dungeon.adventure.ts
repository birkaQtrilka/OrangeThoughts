import { CodingAdventure } from "../../../models/coding-adventure.model";

export const CODING_PATHFINDING: CodingAdventure = {
  id: 'PathFinding',
  title: 'Procedural dungeon generation and pathfinding',
  videoPath: '/assets/videos/Dungeon.mp4',
  tags: ['GxpEngine', 'University Project'],
  description: `
    &emsp; A scene with an orc that moves from A to B through a procedurally generated dungeon by the shortest path. The dungeon is 
    generated using a binary space partitioning algorithm, the rooms that "collide" will form doors that will be elongated as the rooms
    randomly shrink. The pathfinding is implemented using the <a target="_blank" href="https://www.geeksforgeeks.org/a-search-algorithm/">A* algorithm</a>.
    <br>&emsp;The main challenges were: 
    <br>&emsp;&emsp;How to connect the rooms? – solved with the previously mentioned collision idea
    <br>&emsp;&emsp;Creating a custom min heap container for the A* implementation.
    <br>&emsp;&emsp;Making the node grid with a simple square fill algorithm.
  `,
  timeSpent: '1 week',
  images: ['/assets/Images/SideProjects/Dungeon.png'],
  githubLink: 'https://github.com/birkaQtrilka/Pathfinding-and-dungeon-generation/blob/main/MyClasses/Assignment/PathFinding/PathFinderAStar.cs'
};
