// Rebuilds the Rig node of scene.rml from mascot/art: the bone hierarchy, every path's vertices and their bone weights.
// Run `bun mascot/skeleton.ts`, then `bun mascot/build-rig.ts`. Animations, paints and the state machine are left as written.
import { readFile, writeFile } from "node:fs/promises";

type P = [number, number];
type Seg = { from: P; c1: P; c2: P; to: P };
type Influence = [bone: string, weight: number];

/** The rig node sits on the ground point; bones and vertices are written relative to it. */
const GROUND: P = [256, 462];

type BoneSpec = { name: string; id: string; length: number; rotation: number; at?: P; children?: BoneSpec[] };
/** A straight run of equal bones named `${name}1`, `${name}2`… from `at`, pointing along `rotation`. */
type Chain = { name: string; ids: string[]; at: P; rotation: number; length: number };

/** The neck runs straight between the shoulders and the jaw; the jaw joint gets a disc of the neck's half-width. */
const NECK_BASE: P = [81.6, -200];
const HEAD_PIVOT: P = [84.5, -274];
const JAW_RADIUS = 29.9;
const NECK: Chain = {
  name: "Neck",
  ids: ["1:2", "1:11", "1:12"],
  at: NECK_BASE,
  rotation: Math.atan2(HEAD_PIVOT[1] - NECK_BASE[1], HEAD_PIVOT[0] - NECK_BASE[0]),
  length: Math.hypot(HEAD_PIVOT[0] - NECK_BASE[0], HEAD_PIVOT[1] - NECK_BASE[1]),
};
const TAIL: Chain = { name: "Tail", ids: ["1:4", "1:13", "1:14"], at: [-101, -78], rotation: 3.0239, length: 93.6 };
const LEGS: P[] = [[-83.1, -51], [-33.2, -51], [26.9, -51], [77, -51]];
/** The spine bends at the loin, between the back and front legs. The hips carry the tail and all four legs, so the chest can
 * sag or lift the shoulders, neck and head while every foot stays planted. */
const HIPS: P = [-60, -110];
const LOIN: P = [-2, -110];
/** The knee sits halfway down each leg. */
const THIGH = 26;
const KNEE_Y = -51 + THIGH;
/** Above this height, behind the back legs, the outline belongs to the tail. */
const TAIL_Y = -60;
/** The top of the gaps between the legs. */
const CROTCH_Y = -46;
const LEG_SPANS: [number, number][] = [[-106, -60], [-56, -10], [5, 50], [55, 100]];

const eyeLoops = await loops("eyes");
const mouthLoops = await loops("mouth");

/** The chain's bones, nested, with `tip` hung off the last one. */
function chainBones({ name, ids, at, rotation, length }: Chain, tip: BoneSpec[] = []): BoneSpec {
  const build = (n: number): BoneSpec => ({
    name: `${name}${n + 1}`,
    id: ids[n] ?? "",
    length: length / ids.length,
    rotation: n === 0 ? rotation : 0,
    at: n === 0 ? at : undefined,
    children: n + 1 < ids.length ? [build(n + 1)] : tip,
  });

  return build(0);
}

/** The head's rest direction. */
const HEAD_ROTATION = -0.7144;

/** The centre of some face parts in the head's own frame, where a face bone sits so squashing it keeps the parts in place. */
function inHead(parts: Seg[][]): P {
  const points = parts.flat().map((seg) => seg.from);
  const [cx, cy] = points.reduce(([x, y], [px, py]) => [x + px / points.length, y + py / points.length], [0, 0]);
  const [dx, dy] = [cx - HEAD_PIVOT[0], cy - HEAD_PIVOT[1]];

  return [dx * Math.cos(-HEAD_ROTATION) - dy * Math.sin(-HEAD_ROTATION), dx * Math.sin(-HEAD_ROTATION) + dy * Math.cos(-HEAD_ROTATION)];
}

/** A root placed at a rig-space point, under a parent that starts at `from` and is level at rest. */
const at = ([x, y]: P, [fx, fy]: P): P => [+(x - fx).toFixed(2), +(y - fy).toFixed(2)];

const leg = (i: number, from: P): BoneSpec => ({
  name: `Leg${i}`,
  id: `1:${5 + i}`,
  at: at(LEGS[i] ?? [0, 0], from),
  rotation: Math.PI / 2,
  length: THIGH,
  children: [{ name: `Shin${i}`, id: `1:${16 + i}`, length: 51 - THIGH, rotation: 0 }],
});

const chest: BoneSpec = {
  name: "Chest",
  id: "1:21",
  length: 80,
  rotation: 0,
  children: [
    { ...chainBones(NECK, [
    {
      name: "Head",
      id: "1:3",
      length: 90.6,
      rotation: HEAD_ROTATION - NECK.rotation,
      children: [
        { name: "Eyes", id: "1:9", at: inHead(eyeLoops), length: 12, rotation: -HEAD_ROTATION },
        { name: "Mouth", id: "1:15", at: inHead(mouthLoops), length: 10, rotation: -HEAD_ROTATION },
      ],
    },
  ]), at: at(NECK_BASE, LOIN) },
  ],
};
const hips: BoneSpec = {
  name: "Hips",
  id: "1:20",
  at: HIPS,
  length: LOIN[0] - HIPS[0],
  rotation: 0,
  children: [{ ...chainBones(TAIL), at: at(TAIL.at, HIPS) }, ...LEGS.map((_, i) => leg(i, HIPS)), chest],
};
const SKELETON: BoneSpec[] = [{ name: "Body", id: "1:1", at: [0, 0], rotation: 0, length: 20, children: [hips] }];

/** Rest-pose world placement of every bone, in rig space, in hierarchy order. */
type Placed = { spec: BoneSpec; start: P; rotation: number };
const placed: Placed[] = [];

function place(specs: BoneSpec[], parent?: Placed) {
  for (const spec of specs) {
    const [x, y] = spec.at ?? [parent?.spec.length ?? 0, 0];
    const [px, py] = parent?.start ?? [0, 0];
    const rotation = parent?.rotation ?? 0;
    const cos = Math.cos(rotation), sin = Math.sin(rotation);
    const bone: Placed = {
      spec,
      start: [px + x * cos - y * sin, py + x * sin + y * cos],
      rotation: rotation + spec.rotation,
    };

    placed.push(bone);
    place(spec.children ?? [], bone);
  }
}

place(SKELETON);
const index = new Map(placed.map((b, i) => [b.spec.name, i]));

// ---- weights ----

const ramp = (a: number, b: number, v: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

const smooth = (a: number, b: number, v: number) => {
  const t = ramp(a, b, v);

  return t * t * (3 - 2 * t);
};

function handover(from: string, to: string, weight: number): Influence[] {
  return [[from, 1 - weight], [to, weight]];
}

/** Hands `from`, itself possibly a blend, over to `to`. */
function onto(from: Influence[], to: Influence[], weight: number): Influence[] {
  return [...from.map(([bone, w]): Influence => [bone, w * (1 - weight)]), ...to.map(([bone, w]): Influence => [bone, w * weight])];
}

/** The torso bends at the loin: hips behind it, chest in front. The belly over the legs stays on the hips with them, so a
 * sagging chest presses down from the back instead of folding the crotches. */
function torso([x, y]: P): Influence[] {
  return handover("Hips", "Chest", smooth(LOIN[0] - 18, LOIN[0] + 18, x) * smooth(CROTCH_Y - 4, -120, y));
}

/** A hard cut straight across the neck at the jaw keeps the head rigid, and the jaw disc covers it as the head turns. */
function neckWeights([x, y]: P): Influence[] {
  if (y < HEAD_PIVOT[1]) {
    return [["Head", 1]];
  }

  const s = ((NECK_BASE[1] - y) / (NECK_BASE[1] - HEAD_PIVOT[1])) * 3;

  if (s <= 0.5) {
    // The back hands over far down the withers so it stretches into one arc as the head drops; the throat hands over
    // within a few units of the shoulder cut, so it folds cleanly instead of being scooped out.
    const back = smooth(-150, -215, y) * smooth(-60, 40, x);
    const throat = smooth(NECK_BASE[1] + 4, NECK_BASE[1] - 4, y);

    return onto(torso([x, y]), [["Neck1", 1]], back + (throat - back) * smooth(70, 100, x));
  }

  if (s <= 1.5) {
    return handover("Neck1", "Neck2", s - 0.5);
  }

  if (s <= 2.5) {
    return handover("Neck2", "Neck3", s - 1.5);
  }

  return [["Neck3", 1]];
}

/** Each branch hands off to its neighbour before the next handover begins. */
function bodyWeights(p: P): Influence[] {
  const [x, y] = p;

  if (x > -100 && y < -88) {
    return neckWeights(p);
  }

  if (x < -81 && y > -150 && (y < TAIL_Y || x < -105)) {
    const tail = smooth(-150, -120, y) * Math.max(smooth(-105, -124, x), smooth(TAIL_Y, TAIL_Y - 24, y));
    const t = smooth(-81, -134, x) * tail;

    if (t < 1) {
      return onto(torso([x, y]), [["Tail1", 1]], t);
    }

    if (x > -163) {
      return handover("Tail1", "Tail2", smooth(-134, -163, x));
    }

    return handover("Tail2", "Tail3", smooth(-163, -188, x));
  }

  const gap = ([a, b]: [number, number]) => (x < a ? a - x : x > b ? x - b : 0);
  const leg = LEG_SPANS.reduce((best, span, i) => (gap(span) < gap(LEG_SPANS[best] ?? span) ? i : best), 0);
  const [a, b] = LEG_SPANS[leg] ?? [0, 0];
  const neighbour = LEG_SPANS[x < a ? leg - 1 : leg + 1];
  // Between two legs the weight fades to the torso at the midline, so the outline never jumps from one leg to the next.
  // Below the crotch every point is on a leg, so a foot that flares past its span still turns with its leg.
  const half = neighbour ? (x < a ? a - neighbour[1] : neighbour[0] - b) / 2 : 8;
  const fade = Math.max(1 - smooth(0, half, gap([a, b])), smooth(CROTCH_Y, CROTCH_Y + 8, y));

  // The knee blends over a few units, so a bent leg keeps a round joint.
  const limb = handover(`Leg${leg}`, `Shin${leg}`, smooth(KNEE_Y - 5, KNEE_Y + 5, y));

  // The leg hands over just below the crotch, so the crotch arcs stay on the torso and the visible leg turns as one piece.
  // The outer edges of the end legs run straight on from the chest and under the tail, so they hand over along a longer
  // stretch: the chest's from high up, the rump's from where the tail lets go.
  const mid = (a + b) / 2;
  const crotch = smooth(CROTCH_Y - 2, CROTCH_Y + 8, y);
  const outer = leg === 0 ? smooth(mid, a, x) : leg === LEG_SPANS.length - 1 ? smooth(mid, b, x) : 0;
  const hip = crotch + ((leg === 0 ? smooth(TAIL_Y, -34, y) : smooth(-70, -36, y)) - crotch) * outer;

  return onto(torso([x, y]), limb, hip * fade);
}

/** Quantizes the weights to Rive bytes that sum to 255. */
function pack(influences: Influence[]) {
  const kept = influences.filter(([, w]) => Math.round(w * 255) > 0);
  const total = kept.reduce((sum, [, w]) => sum + w, 0);
  const bytes = kept.map(([name, w]) => [index.get(name) ?? 0, Math.round((w / total) * 255)] as const);
  const drift = 255 - bytes.reduce((sum, [, v]) => sum + v, 0);

  if (bytes[0]) {
    bytes[0] = [bytes[0][0], bytes[0][1] + drift];
  }

  let values = 0, indices = 0;

  bytes.forEach(([tendon, value], slot) => {
    values |= value << (8 * slot);
    indices |= (tendon + 1) << (8 * slot);
  });

  return { values: values >>> 0, indices: indices >>> 0 };
}

// ---- paths ----

/** Reads the closed cubic loops of an SVG written as absolute M, C and Z commands, moved into rig space. */
async function loops(file: string): Promise<Seg[][]> {
  const svg = await readFile(new URL(`art/${file}.svg`, import.meta.url), "utf8");

  return [...svg.matchAll(/ d="([^"]+)"/g)].map(([, d = ""]) => {
    const tokens = d.match(/[MCZ]|-?\d*\.?\d+/g) ?? [];
    const segs: Seg[] = [];
    let i = 0, pos: P = [0, 0];
    const point = (): P => [Number(tokens[i++]) - GROUND[0], Number(tokens[i++]) - GROUND[1]];

    while (i < tokens.length) {
      const command = tokens[i++];

      if (command === "M") {
        pos = point();
      } else if (command === "C") {
        const [c1, c2, to] = [point(), point(), point()];

        segs.push({ from: pos, c1, c2, to });
        pos = to;
      }
    }

    return segs;
  });
}

const dist = ([ax, ay]: P, [bx, by]: P) => Math.hypot(bx - ax, by - ay);
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Splits a cubic at `t` (de Casteljau) into two with the same shape. */
function split({ from, c1, c2, to }: Seg, t: number): [Seg, Seg] {
  const ab = lerp(from, c1, t), bc = lerp(c1, c2, t), cd = lerp(c2, to, t);
  const abc = lerp(ab, bc, t), bcd = lerp(bc, cd, t), mid = lerp(abc, bcd, t);

  return [{ from, c1: ab, c2: abc, to: mid }, { from: mid, c1: bcd, c2: cd, to }];
}

/** Splits every cubic into equal pieces no longer than `step`, so the outline has vertices to bend with and keeps its rest shape. */
const densify = (segs: Seg[]) =>
  segs.flatMap((seg): Seg[] => {
    const step = seg.from[0] > -40 && seg.from[1] < -88 && seg.from[1] > -306 ? 4 : 4;
    const pieces = Math.max(1, Math.ceil((dist(seg.from, seg.c1) + dist(seg.c1, seg.c2) + dist(seg.c2, seg.to)) / step));
    const out: Seg[] = [];
    let rest = seg;

    for (let n = pieces; n > 1; n--) {
      const [head, tail] = split(rest, 1 / n);

      out.push(head);
      rest = tail;
    }

    return [...out, rest];
  });

const r = (v: number) => +v.toFixed(2);
const angle = ([ax, ay]: P, [bx, by]: P) => Math.atan2(by - ay, bx - ax);

/** Every bone's rest world transform in artboard space, as Rive's skin binds it. */
const tendons = placed
  .map(({ spec, start, rotation }) => {
    const [cos, sin] = [Math.cos(rotation), Math.sin(rotation)];

    return `<Tendon boneId="${spec.id}" xx="${cos.toFixed(6)}" xy="${sin.toFixed(6)}" yx="${(-sin).toFixed(6)}" yy="${cos.toFixed(6)}" tx="${r(start[0] + GROUND[0])}" ty="${r(start[1] + GROUND[1])}" name="${spec.name}"/>`;
  })
  .join("");

function pointsPath(name: string, segs: Seg[], weigh: (p: P) => Influence[]) {
  const vertices = segs.map((seg, n) => {
    const prev = segs[(n - 1 + segs.length) % segs.length] ?? seg;
    // Each handle follows the deformation where it sits, so a stretched stretch of outline keeps its curve.
    const influences = weigh(seg.from);
    // A vertex on the rigid head keeps its handles on the head too, even where a handle pokes past its edge.
    const rigid = influences.filter(([, v]) => v > 0).length === 1;
    const [w, wi, wo] = [pack(influences), pack(rigid ? influences : weigh(prev.c2)), pack(rigid ? influences : weigh(seg.c1))];
    const p = seg.from;

    return `<CubicDetachedVertex x="${r(p[0])}" y="${r(p[1])}" inRotation="${angle(p, prev.c2).toFixed(6)}" inDistance="${r(dist(p, prev.c2))}" outRotation="${angle(p, seg.c1).toFixed(6)}" outDistance="${r(dist(p, seg.c1))}"><CubicWeight values="${w.values}" indices="${w.indices}" inValues="${wi.values}" inIndices="${wi.indices}" outValues="${wo.values}" outIndices="${wo.indices}"/></CubicDetachedVertex>`;
  });

  return `<PointsPath isClosed="true" name="${name}">${vertices.join("")}<Skin tx="${GROUND[0]}" ty="${GROUND[1]}" name="Skin">${tendons}</Skin></PointsPath>`;
}

const only = (bone: string) => (): Influence[] => [[bone, 1]];

/** A clockwise circle, the same winding as the outline, so the two fill as one shape. */
function disc([cx, cy]: P, r: number): Seg[] {
  const k = 0.5523 * r;
  const at = (a: number): P => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];

  return [0, 1, 2, 3].map((q) => {
    const a = (q * Math.PI) / 2, b = a + Math.PI / 2;
    const [from, to] = [at(a), at(b)];

    return { from, c1: [from[0] - Math.sin(a) * k, from[1] + Math.cos(a) * k], c2: [to[0] + Math.sin(b) * k, to[1] - Math.cos(b) * k], to };
  });
}

const body = (await loops("body")).map(densify);
const farLegEdges: [start: P, end: P][] = [
  [[242.74, 420.09], [202, 420.44]],
  [[353.92, 399.75], [311.6, 412.53]],
];

/** The jaw's underside, from the bottom of the snout back to the throat, where the chin shade lies. */
const chinEdge: [start: P, end: P] = [[445.4, 150.4], [370.6, 185.8]];

/** A patch on the silhouette: its exact cubics between two outline vertices, shut by a straight line. */
function edgePath(outline: Seg[], [start, end]: [P, P]) {
  // The vertex of the outline nearest each end of the edge.
  const find = ([x, y]: P) =>
    outline.reduce((best, { from }, i) => (dist(from, [x - GROUND[0], y - GROUND[1]]) < dist(outline[best]?.from ?? from, [x - GROUND[0], y - GROUND[1]]) ? i : best), 0);
  const first = find(start), last = find(end);

  if (first < 0 || last <= first) {
    throw new Error("edge endpoints must be vertices on the body outline, in outline order");
  }

  const from = outline[last].from, to = outline[first].from;

  return [...outline.slice(first, last), { from, c1: lerp(from, to, 1 / 3), c2: lerp(from, to, 2 / 3), to }];
}

const shapes: Record<string, string[]> = {
  Crown: (await loops("crown")).map((l, i) => pointsPath(`Crown ${i}`, l, only("Head"))),
  Eyes: eyeLoops.map((l, i) => pointsPath(`Eye ${i}`, l, only("Eyes"))),
  Tongue: (await loops("tongue")).map((l, i) => pointsPath(`Tongue ${i}`, l, only("Mouth"))),
  Mouth: mouthLoops.map((l, i) => pointsPath(`Mouth ${i}`, l, only("Mouth"))),
  "Far legs": farLegEdges.map((edge, i) => pointsPath(`Far leg ${i}`, edgePath(body[0] ?? [], edge), bodyWeights)),
  Chin: [pointsPath("Chin", edgePath(body[0] ?? [], chinEdge), only("Head"))],
  Body: [
    ...body.map((outline, i) => pointsPath(`Outline ${i}`, outline, bodyWeights)),
    pointsPath("Jaw joint", disc(HEAD_PIVOT, JAW_RADIUS), only("Head")),
  ],
};

function boneXml(spec: BoneSpec, depth: number): string {
  const pad = " ".repeat(12 + depth * 4);
  const tag = spec.at ? "RootBone" : "Bone";
  const at = spec.at ? `x="${spec.at[0]}" y="${spec.at[1]}" ` : "";
  const head = `${pad}<${tag} ${at}length="${r(spec.length)}" rotation="${+spec.rotation.toFixed(7)}" name="${spec.name}" id="${spec.id}"`;

  return spec.children?.length ? `${head}>\n${spec.children.map((c) => boneXml(c, depth + 1)).join("\n")}\n${pad}</${tag}>` : `${head}/>`;
}

const file = new URL("scene.rml", import.meta.url);
let scene = await readFile(file, "utf8");

for (const [shape, paths] of Object.entries(shapes)) {
  scene = scene.replace(new RegExp(`(<Shape name="${shape}" id="[^"]+">)[\\s\\S]*?(\\s*<Fill)`), (_, open: string, fill: string) => `${open}\n${paths.join("\n")}${fill}`);
}

scene = scene.replace(/ {12}<RootBone[\s\S]*?(?=\n {8}<\/Node>)/, SKELETON.map((b) => boneXml(b, 0)).join("\n"));
await writeFile(file, scene);
console.log(`${placed.length} bones, ${Object.values(shapes).flat().length} paths`);
