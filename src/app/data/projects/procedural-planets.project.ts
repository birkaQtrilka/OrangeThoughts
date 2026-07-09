export const PROJECT_PROCEDURAL_PLANETS = {
  id: 'procedural-planets',
  title: 'Procedural Planets',
  videoPath: { isIframe: false, path: 'https://res.cloudinary.com/uj9ir4ss/video/upload/v1783590539/NewPlanetsDemo_trxir2.mp4' },
  tags: ['C#', 'Unity', 'Procedural Generation'],
  description: `
    <p>
      &emsp; A continuation of Sebastian Lague's 
      <a href="https://www.youtube.com/watch?v=QN39W020LqU&list=PLFt_AvWsXl0cONs3T0By4puYy6GM22ko8" target="_blank">
        procedural planet generation tutorial
      </a>.  
      In the first iteration, I learned how to create meshes in code by making an ocean mesh that follows the contour of the
      planet's land. My solution was to implement the 
      <a href="https://en.wikipedia.org/wiki/Marching_squares" target="_blank">marching squares algorithm</a>.
      You divide the mesh into squares and give the corners a value based on how close they are to the ocean level.  
      Then, using the lookup table of all possible cell configurations, you determine the correct mesh shape and
      interpolate the vertices.
      <br>&emsp;<strong>The main challenge</strong> was understanding how mesh generation works and finding the right solution.
      I stumbled upon the marching squares algorithm and realized I could use it for this project. Implementing it was 
      difficult, but also a lot of fun.
      <br>
      &emsp;In the <strong>second iteration</strong>, I learned how to create an atmosphere shader. Each planet can have a ball that slowly 
      becomes less bright and more transparent (from an inner to an out radius), kind of like a spotlight. I also 
      created a star shader using Voronoi noise for random but homogenous distribution of stars.
      <br>
      &emsp;For my <strong>third iteration</strong>, I decided to refactor my code to use a parallel algorithm, using the C# job system. This
      made the generation time 31 times faster. I also added an LOD system with lazy loading to allow for better 
      performance if the player is too far away.       
    </p>
  `,
  timeSpent: '2 months',
  githubLink: 'https://github.com/birkaQtrilka/Cosmic-Surviver/blob/master/Assets/Scripts/OceanFace.cs',
  credits: [
    { name: 'Inspiration and code snippets', link: 'https://www.youtube.com/watch?v=QN39W020LqU&list=PLFt_AvWsXl0cONs3T0By4puYy6GM22ko8', linkLabel: 'Sebastian Lague' }
  ]
};
