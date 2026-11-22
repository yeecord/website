// Turns scene.rml into src/home/mascot/rig.ts: bones, skinned paths, paints and timelines. Run `bun mascot/build-rig.ts` after editing the scene.
import { readFile, writeFile } from "node:fs/promises";

type El = { tag: string; attrs: Record<string, string>; children: El[] };

function parse(source: string): El {
  const root: El = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];

  for (const [whole, close, tag = "", rest = "", selfClosing] of source.matchAll(/<!--[\s\S]*?-->|<(\/?)([A-Za-z]\w*)([^>]*?)(\/?)>/g)) {
    if (whole.startsWith("<!--")) {
      continue;
    }

    if (close) {
      stack.pop();
      continue;
    }

    const el: El = { tag, attrs: Object.fromEntries([...rest.matchAll(/([\w:]+)="([^"]*)"/g)].map(([, k = "", v = ""]) => [k, v])), children: [] };
    stack.at(-1)?.children.push(el);

    if (!selfClosing) {
      stack.push(el);
    }
  }

  return root;
}

const all = (el: El, tag: string): El[] => el.children.flatMap((c) => (c.tag === tag ? [c] : []).concat(all(c, tag)));
const child = (el: El, tag: string) => el.children.find((c) => c.tag === tag);
const num = (el: El | undefined, key: string, fallback = 0) => (el?.attrs[key] === undefined ? fallback : Number(el.attrs[key]));
const round = (v: number) => Math.round(v * 100) / 100;

const root = parse(await readFile(new URL("scene.rml", import.meta.url), "utf8"));
const rig = all(root, "Node").find((n) => n.attrs.name === "Rig");

if (!rig) {
  throw new Error("scene has no Rig node");
}

type Bone = { id: string; name: string; parent: number; attachment?: number; x: number; y: number; length: number; rotation: number; bind: number[] };
const bones: Bone[] = [];

function addBones(el: El, parent: number) {
  for (const c of el.children) {
    if (c.tag !== "RootBone" && c.tag !== "Bone") {
      continue;
    }

    // Offset roots inherit a transform but do not sit at the parent's tip.
    const offset = c.tag === "RootBone";
    const attachment = offset && parent >= 0 ? { attachment: parent } : {};

    bones.push({ id: c.attrs.id ?? "", name: c.attrs.name ?? "", parent: offset ? -1 : parent, ...attachment, x: num(c, "x"), y: num(c, "y"), length: num(c, "length"), rotation: num(c, "rotation"), bind: [] });
    addBones(c, bones.length - 1);
  }
}

addBones(rig, -1);
const boneIndex = new Map(bones.map((b, i) => [b.id, i]));

/** Unpacks Rive's four byte slots into [bone, weight] pairs. */
function influences(values: number, indices: number, tendons: number[]): number[] {
  const out: number[] = [];

  for (let slot = 0; slot < 4; slot++) {
    const value = (values >>> (slot * 8)) & 255;
    const tendon = ((indices >>> (slot * 8)) & 255) - 1;

    if (value === 0) {
      continue;
    }

    const bone = tendons[tendon];

    if (tendon < 0 || bone === undefined) {
      throw new Error("a weight points at the identity slot or a missing tendon");
    }

    // Four places: weights multiply artboard coordinates in the hundreds, so a sum off by 0.01 moves a point by pixels.
    out.push(bone, Math.round((value / 255) * 10000) / 10000);
  }

  return out;
}

const color = (argb = "FF000000") => [parseInt(argb.slice(2, 4), 16), parseInt(argb.slice(4, 6), 16), parseInt(argb.slice(6, 8), 16), round(parseInt(argb.slice(0, 2), 16) / 255)];

const shapes = rig.children.filter((c) => c.tag === "Shape").map((shape) => ({
  name: shape.attrs.name,
  paths: shape.children.filter((c) => c.tag === "PointsPath").map((path) => {
    const skin = child(path, "Skin");
    const tendons = (skin?.children ?? []).map((t) => {
      const bone = boneIndex.get(t.attrs.boneId ?? "") ?? -1;
      const target = bones[bone];

      if (target && target.bind.length === 0) {
        target.bind = ["xx", "xy", "yx", "yy", "tx", "ty"].map((k) => num(t, k, k === "xx" || k === "yy" ? 1 : 0));
      }

      return bone;
    });
    const [sx, sy] = [num(skin, "tx"), num(skin, "ty")];
    // Each vertex gives three control points in artboard space: in handle, point, out handle.
    const points: number[] = [];
    const weights: number[][] = [];

    for (const v of path.children.filter((c) => c.tag === "CubicDetachedVertex")) {
      const w = child(v, "CubicWeight");
      const [x, y] = [num(v, "x") + sx, num(v, "y") + sy];
      const handle = (r: string, d: string) => [round(x + Math.cos(num(v, r)) * num(v, d)), round(y + Math.sin(num(v, r)) * num(v, d))];

      points.push(...handle("inRotation", "inDistance"), round(x), round(y), ...handle("outRotation", "outDistance"));
      weights.push(influences(num(w, "inValues", 255), num(w, "inIndices", 1), tendons), influences(num(w, "values", 255), num(w, "indices", 1), tendons), influences(num(w, "outValues", 255), num(w, "outIndices", 1), tendons));
    }

    return { points, weights };
  }),
  fills: shape.children.filter((c) => c.tag === "Fill").map((fill) => {
    const feather = child(fill, "Feather");
    const gradient = child(fill, "LinearGradient");

    return {
      color: color(child(fill, "SolidColor")?.attrs.colorValue),
      feather: feather && { strength: num(feather, "strength"), x: num(feather, "offsetX"), y: num(feather, "offsetY") },
      gradient: gradient && { from: [num(gradient, "startX"), num(gradient, "startY")], to: [num(gradient, "endX"), num(gradient, "endY")], stops: gradient.children.map((s) => [num(s, "position"), ...color(s.attrs.colorValue)]) },
    };
  }),
}));

const animations = Object.fromEntries(all(root, "LinearAnimation").map((a) => [a.attrs.name ?? "", {
  duration: num(a, "duration", 60),
  loop: a.attrs.loopValue === "loop",
  tracks: all(a, "KeyedObject").flatMap((o) => o.children.map((p) => ({
    object: o.attrs.objectId === rig.attrs.id ? -1 : boneIndex.get(o.attrs.objectId ?? "") ?? -2,
    property: p.attrs.property,
    keys: p.children.map((k) => {
      const ease = child(k, "CubicEaseInterpolator");

      return [num(k, "frame"), num(k, "value"), k.attrs.interpolationType ?? "hold", ...(ease ? ["x1", "y1", "x2", "y2"].map((e) => num(ease, e)) : [])];
    }),
  }))),
}]));

const out = { rig: { x: num(rig, "x"), y: num(rig, "y") }, bones: bones.map(({ id, ...b }) => b), shapes, animations };
await writeFile(new URL("../src/home/mascot/rig.ts", import.meta.url), `// Generated by mascot/build-rig.ts from mascot/scene.rml.\nimport type { Rig } from "./player";\n\nexport const rig: Rig = ${JSON.stringify(out)};\n`);
console.log(`bones ${bones.length}, shapes ${shapes.length}, animations ${Object.keys(animations).join(" ")}`);
