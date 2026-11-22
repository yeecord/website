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

/** The neck pivots high and back, at the withers like a grazing animal's, and ends where the head turns. */
const NECK_BASE: P = [52, -172];
const HEAD_PIVOT: P = [84, -245.95];
const NECK: Chain = {
  name: "Neck",
  ids: ["1:2", "1:11", "1:12"],
  at: NECK_BASE,
  rotation: Math.atan2(HEAD_PIVOT[1] - NECK_BASE[1], HEAD_PIVOT[0] - NECK_BASE[0]),
  length: Math.hypot(HEAD_PIVOT[0] - NECK_BASE[0], HEAD_PIVOT[1] - NECK_BASE[1]),
};
const TAIL: Chain = { name: "Tail", ids: ["1:4", "1:13", "1:14"], at: [-101, -78], rotation: 3.0239, length: 93.6 };
const LEGS: P[] = [[-83.1, -51], [-33.2, -51], [26.9, -51], [77, -51]];
const LEG_SPANS: [number, number][] = [[-106, -60], [-56, -10], [5, 50], [55, 100]];

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

const SKELETON: BoneSpec[] = [
  { name: "Body", id: "1:1", at: [0, 0], rotation: -Math.PI / 2, length: 20 },
  chainBones(NECK, [{ name: "Head", id: "1:3", length: 90.6, rotation: 0.448, children: [{ name: "Eyes", id: "1:9", length: 12, rotation: 1.086 }] }]),
  chainBones(TAIL),
  ...LEGS.map((at, i): BoneSpec => ({ name: `Leg${i}`, id: `1:${5 + i}`, at, rotation: Math.PI / 2, length: 51 })),
];

/** Rest-pose world placement of every bone, in rig space, in hierarchy order. */
type Placed = { spec: BoneSpec; start: P; rotation: number };
const placed: Placed[] = [];

function place(specs: BoneSpec[], start: P | undefined, rotation: number) {
  for (const spec of specs) {
    const origin = spec.at ?? start ?? [0, 0];
    const world = (spec.at ? 0 : rotation) + spec.rotation;

    placed.push({ spec, start: origin, rotation: world });
    place(spec.children ?? [], [origin[0] + Math.cos(world) * spec.length, origin[1] + Math.sin(world) * spec.length], world);
  }
}

place(SKELETON, undefined, 0);
const index = new Map(placed.map((b, i) => [b.spec.name, i]));

// ---- weights ----

const ramp = (a: number, b: number, v: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

const smooth = (a: number, b: number, v: number) => {
  const t = ramp(a, b, v);

  return t * t * (3 - 2 * t);
};

/** How far along the chain's direction a point lies, from the chain's start. */
const reach = ({ at, rotation }: Chain, [x, y]: P) => (x - at[0]) * Math.cos(rotation) + (y - at[1]) * Math.sin(rotation);

/** How far a point lies to the right of the chain's direction: for the neck, positive is the throat side. */
const side = ({ at, rotation }: Chain, [x, y]: P) => (y - at[1]) * Math.cos(rotation) - (x - at[0]) * Math.sin(rotation);

/** Splits a weight along a chain: full weight on a bone at its midpoint, handed over linearly to the next bone's midpoint. */
function along(chain: Chain, p: P, weight: number): Influence[] {
  const count = chain.ids.length;
  const s = reach(chain, p);
  const mid = (n: number) => ((n + 0.5) * chain.length) / count;

  return chain.ids.map((_, n): Influence => {
    const rise = n === 0 ? 1 : ramp(mid(n - 1), mid(n), s);
    const fall = n === count - 1 ? 1 : 1 - ramp(mid(n), mid(n + 1), s);

    return [`${chain.name}${n + 1}`, weight * rise * fall];
  });
}

/** The leg whose span scores lowest for `x`. */
const nearestLeg = (score: (span: [number, number]) => number) =>
  LEG_SPANS.reduce((best, span, i) => (score(span) < score(LEG_SPANS[best] ?? span) ? i : best), 0);

/** The body outline: the trunk on Body, blending into the neck chain, the head, the tail chain and each leg. */
function bodyWeights(p: P): Influence[] {
  const [x, y] = p;
  const up = reach(NECK, p);
  // The back of the neck hands over to Body far down the withers, so it stretches into one arc; the throat hands over
  // above the chest, measured by height because the tilted neck axis would reach down into the chest.
  const throat = smooth(-10, 40, side(NECK, p));
  const toNeck = (smooth(-60, 15, up) * (1 - throat) + smooth(-150, -190, y) * throat) * smooth(-20, 40, x);
  const toHead = smooth(NECK.length - 35, NECK.length + 10, up);
  const toTail = smooth(-81, -146, x) * smooth(-150, -120, y);
  const gap = ([a, b]: [number, number]) => (x < a ? a - x : x > b ? x - b : 0);
  const leg = nearestLeg(gap);
  const toLeg = smooth(-58, -25, y) * (1 - smooth(0, 8, gap(LEG_SPANS[leg] ?? [0, 0])));
  const trunk = (1 - toNeck) * (1 - toTail) * (1 - toLeg);

  return [
    ["Body", trunk],
    ...along(NECK, p, toNeck * (1 - toHead)),
    ["Head", toNeck * toHead],
    ...along(TAIL, p, (1 - toNeck) * toTail),
    [`Leg${leg}`, (1 - toNeck) * (1 - toTail) * toLeg],
  ];
}

/** Packs up to four influences into Rive's byte slots: specks dropped, the rest normalised to exactly 255. */
function pack(influences: Influence[]) {
  const kept = influences.filter(([, w]) => w > 0.01).sort((a, b) => b[1] - a[1]).slice(0, 4);
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
const densify = (segs: Seg[], step: number) =>
  segs.flatMap((seg): Seg[] => {
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
    const [w, wi, wo] = [pack(weigh(seg.from)), pack(weigh(prev.c2)), pack(weigh(seg.c1))];
    const p = seg.from;

    return `<CubicDetachedVertex x="${r(p[0])}" y="${r(p[1])}" inRotation="${r(angle(p, prev.c2))}" inDistance="${r(dist(p, prev.c2))}" outRotation="${r(angle(p, seg.c1))}" outDistance="${r(dist(p, seg.c1))}"><CubicWeight values="${w.values}" indices="${w.indices}" inValues="${wi.values}" inIndices="${wi.indices}" outValues="${wo.values}" outIndices="${wo.indices}"/></CubicDetachedVertex>`;
  });

  return `<PointsPath isClosed="true" name="${name}">${vertices.join("")}<Skin tx="${GROUND[0]}" ty="${GROUND[1]}" name="Skin">${tendons}</Skin></PointsPath>`;
}

const only = (bone: string) => (): Influence[] => [[bone, 1]];

/** The far leg under the loop's centre. */
const farLeg = (segs: Seg[]) => {
  const x = segs.reduce((sum, s) => sum + s.from[0], 0) / segs.length;

  return only(`Leg${nearestLeg(([a, b]) => Math.abs((a + b) / 2 - x))}`);
};

const shapes: Record<string, string[]> = {
  Crown: (await loops("crown")).map((l, i) => pointsPath(`Crown ${i}`, l, only("Head"))),
  Eyes: (await loops("eyes")).map((l, i) => pointsPath(`Eye ${i}`, l, only("Eyes"))),
  Tongue: (await loops("tongue")).map((l, i) => pointsPath(`Tongue ${i}`, l, only("Head"))),
  Mouth: (await loops("mouth")).map((l, i) => pointsPath(`Mouth ${i}`, l, only("Head"))),
  "Far legs": (await loops("far-legs")).map((l, i) => pointsPath(`Far leg ${i}`, l, farLeg(l))),
  Body: (await loops("body")).map((l, i) => pointsPath(`Outline ${i}`, densify(l, 5), bodyWeights)),
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
