export type Vec3 = readonly [number, number, number];

export const PLANET_RADIUS = 0.7;
export const PLANET_DEPTH = 1.1;
export const MOON_RADIUS = PLANET_RADIUS * 0.1;
export const MOON_ORBIT_RADIUS = PLANET_RADIUS * 1.9;
export const MOON_ORBIT_SPEED = 0.02;
export const MOON_SPIN_SPEED = 0.7;
// The old code effectively applied 0.0001 twice, so 0.0002 keeps the current look.
export const SCROLL_SPEED = 0.0002;
export const LIGHT_POS: Vec3 = [0, 1, 1];

export interface SceneLayout {
  planetPos: Vec3;
  planetRadius: number;
  moonPos: Vec3;
  moonRadius: number;
  /** Moon self-rotation angle in radians. */
  moonSpin: number;
  lightPos: Vec3;
}

export function computeLayout(time: number, scrollY: number, isMobile: boolean): SceneLayout {
  const planetPos: Vec3 = [
    0,
    (isMobile ? -0.9 : -0.7) + scrollY * SCROLL_SPEED,
    PLANET_DEPTH,
  ];
  const a = (time +10) * MOON_ORBIT_SPEED;
  const moonPos: Vec3 = [
    planetPos[0] + Math.cos(a) * MOON_ORBIT_RADIUS,
    planetPos[1] + Math.sin(a) * MOON_ORBIT_RADIUS * 1.25,
    planetPos[2] + Math.sin(a) * MOON_ORBIT_RADIUS,
  ];
  return {
    planetPos,
    planetRadius: PLANET_RADIUS,
    moonPos,
    moonRadius: MOON_RADIUS,
    moonSpin: (time + 55) * MOON_SPIN_SPEED,
    lightPos: LIGHT_POS,
  };
}