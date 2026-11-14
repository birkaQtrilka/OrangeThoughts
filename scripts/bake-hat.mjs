import fs from 'node:fs';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('usage: node scripts/bake-hat.mjs <in.fbx> <out.bin>');
  process.exit(1);
}

// Node has no DOM and we only need geometry, so skip texture decoding.
THREE.TextureLoader.prototype.load = () => new THREE.Texture();

const file = fs.readFileSync(input);
const root = new FBXLoader().parse(
  file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength),
  ''
);
root.updateMatrixWorld(true);

const verts = []; // x y z nx ny nz u v
const indices = [];
const v = new THREE.Vector3();
const n = new THREE.Vector3();

root.traverse((obj) => {
  if (!obj.isMesh) return;
  const g = obj.geometry;
  if (!g.attributes.normal) g.computeVertexNormals();
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const uv = g.attributes.uv;
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(obj.matrixWorld);
  const base = verts.length / 8;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyMatrix4(obj.matrixWorld);
    n.fromBufferAttribute(nor, i).applyMatrix3(normalMatrix).normalize();
    verts.push(v.x, v.y, v.z, n.x, n.y, n.z, uv ? uv.getX(i) : 0, uv ? uv.getY(i) : 0);
  }

  const count = g.index ? g.index.count : pos.count;
  const flip = obj.matrixWorld.determinant() < 0; // mirrored node -> fix winding
  for (let i = 0; i < count; i += 3) {
    const a = g.index ? g.index.getX(i) : i;
    const b = g.index ? g.index.getX(i + 1) : i + 1;
    const c = g.index ? g.index.getX(i + 2) : i + 2;
    indices.push(base + a, base + (flip ? c : b), base + (flip ? b : c));
  }
});

// Normalise: base-centre at origin, height = 1.
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
for (let i = 0; i < verts.length; i += 8) {
  minX = Math.min(minX, verts[i]);     maxX = Math.max(maxX, verts[i]);
  minY = Math.min(minY, verts[i + 1]); maxY = Math.max(maxY, verts[i + 1]);
  minZ = Math.min(minZ, verts[i + 2]); maxZ = Math.max(maxZ, verts[i + 2]);
}
const h = maxY - minY;
if (!(h > 0)) throw new Error('Hat has no measurable height');
const cx = (minX + maxX) / 2;
const cz = (minZ + maxZ) / 2;
for (let i = 0; i < verts.length; i += 8) {
  verts[i] = (verts[i] - cx) / h;
  verts[i + 1] = (verts[i + 1] - minY) / h;
  verts[i + 2] = (verts[i + 2] - cz) / h;
}

// File layout: [u32 vertexCount, u32 indexCount, 8 bytes pad][f32 x8 per vertex][u32 indices]
const vertexCount = verts.length / 8;
const out = Buffer.alloc(16 + vertexCount * 32 + indices.length * 4);
out.writeUInt32LE(vertexCount, 0);
out.writeUInt32LE(indices.length, 4);
Buffer.from(new Float32Array(verts).buffer).copy(out, 16);
Buffer.from(new Uint32Array(indices).buffer).copy(out, 16 + vertexCount * 32);
fs.writeFileSync(output, out);
console.log(`${vertexCount} vertices, ${indices.length / 3} triangles -> ${output} (${out.length} bytes)`);