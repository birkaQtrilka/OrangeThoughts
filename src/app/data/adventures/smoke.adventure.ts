import { CodingAdventure } from "../../models/coding-adventure.model";

export const CODING_SMOKE: CodingAdventure = {
  id: 'smoke',
  title: 'Smoke simulator',
  videoPath: { isIframe: false, path: 'https://res.cloudinary.com/uj9ir4ss/video/upload/v1786610827/2026-08-13_10-44-05_dq3zap.mkv'},
  tags: ['Rust', 'Side Project'],
  description: `
  &emsp; A GPU-accelerated fluid simulation using a MAC grid and pressure projection, implemented with
    OpenGL compute shaders and Rust.
    <br>&emsp;&emsp; The simulation solves the Navier-Stokes equations for incompressible flow using a
    staggered grid (velocity stored on faces, pressure/scalar at cell centers)
    <br>&emsp;&emsp; Each timestep consists of:
    <br>&emsp;&emsp;&emsp; 1. Prepare cycle data (compute RHS and inverse diagonal for pressure solve)
    <br>&emsp;&emsp;&emsp; 2. Solve pressure via Red-Black Gauss-Seidel iterations
    <br>&emsp;&emsp;&emsp; 3. Update velocities using the computed pressure gradient
    <br>&emsp;&emsp;&emsp; 4. Advect velocities using semi-Lagrangian backtracing with bilinear interpolation
    <br>&emsp;&emsp;&emsp; 5. Advect smoke/density scalar field using the same semi-Lagrangian scheme
    <br>&emsp; GPU resources are managed via Shader Storage Buffer Objects (SSBOs) with ping-pong
    swapping to avoid copying memory between advection steps.
    <br>&emsp; The API allows interaction by injecting velocity boundary conditions and smoke sources
    through queues, with automatic synchronization between CPU and GPU buffers.
    <br>&emsp; A challenge was correctly handling the staggered grid sampling in the semi-Lagrangian
    advection, requiring offset coordinate mapping (0.5 cell offsets) for face-centered
    velocities when doing bilinear interpolation of the velocity field.
  `,
  timeSpent: '4 days',
  images: ['/assets/Images/SideProjects/Smoke.png'],
  githubLink: 'https://github.com/birkaQtrilka/fractals/tree/main/src/smoke'
};
