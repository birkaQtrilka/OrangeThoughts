// Raw project data; ProjectService will sanitize and convert these into Project instances
export const PROJECT_PROCEDURAL_PLANETS = {
  id: 'procedural-planets',
  title: 'Procedural Planets',
  videoPath: { isIframe: true, path: 'https://www.youtube.com/embed/xWtM5TTlcCg?si=SP-D82S2Abjb2Z7v' },
  tags: ['C#', 'Unity', 'Procedural Generation'],
  description: `
    <p>
      &emsp; A continuation of Sebastian Lague's 
      <a href="https://www.youtube.com/watch?v=QN39W020LqU&list=PLFt_AvWsXl0cONs3T0By4puYy6GM22ko8" target="_blank">
        procedural planet generation tutorial
      </a>.  
      In this project, I learned how to create meshes in code by making an ocean mesh that follows the contour of the
      planet's land. My solution was to implement the 
      <a href="https://en.wikipedia.org/wiki/Marching_squares" target="_blank">marching squares algorithm</a>.
      You divide the mesh into squares and give the corners a value based on how close they are to the ocean level.  
      Then, using the lookup table of all possible cell configurations, you determine the correct mesh shape and
      interpolate the vertices.
      <br>&emsp;The main challenge was understanding how mesh generation works and finding the right solution.
      I stumbled upon the marching squares algorithm and realized I could use it for this project. Implementing it was 
      difficult, but also a lot of fun.
    </p>
  `,
  timeSpent: '2 months',
  githubLink: 'https://github.com/birkaQtrilka/Cosmic-Surviver/blob/master/Assets/Scripts/OceanFace.cs',
  credits: [
    { name: 'Inspiration and code snippets', link: 'https://www.youtube.com/watch?v=QN39W020LqU&list=PLFt_AvWsXl0cONs3T0By4puYy6GM22ko8', linkLabel: 'Sebastian Lague' }
  ]
};
