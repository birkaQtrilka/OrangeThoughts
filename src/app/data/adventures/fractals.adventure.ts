import { CodingAdventure } from "../../models/coding-adventure.model";

export const CODING_FRACTAL: CodingAdventure = {
  id: 'fractals',
  title: 'Fractals',
  videoPath: { isIframe: false, path: 'https://res.cloudinary.com/uj9ir4ss/video/upload/v1784657371/fractal_l8ukse.mov'},
  tags: ['Rust', 'Side Project'],
  description: `
Two different fractals rendered separately on the GPU using OpenGL.

<br>This program supports deep zoom by emulating double-precision arithmetic. On the CPU side, it uses double precision values, which are split into two 32-bit floating-point values (high and low parts) before being sent to the GPU, where the arithmetic is reconstructed. You can render either a Mandelbrot set or a Julia set.

<br>The Julia set implementation includes a simple save and load system for the Julia constant. The entire program was written in Rust as a language-learning exercise. I had always wanted to learn Rust because it is highly performant and memory-safe, making it an excellent choice for game development. The main downside is that it is not yet widely adopted.

  `,
  timeSpent: '4 days',
  images: ['/assets/Images/SideProjects/fractal.png'],
  githubLink: 'https://github.com/birkaQtrilka/fractals'
};
