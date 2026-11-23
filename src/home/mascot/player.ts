// Plays the mascot rig on a canvas: skins the outline each frame and runs the two state machine layers of mascot/scene.rml.
type Key = [frame: number, value: number, type: string, x1?: number, y1?: number, x2?: number, y2?: number];
type Track = { object: number; property: Property; keys: Key[] };
type Anim = { duration: number; loop: boolean; tracks: Track[] };
type Fill = { color: number[]; feather?: { strength: number; x: number; y: number }; gradient?: { from: number[]; to: number[]; stops: number[][] } };
type Shape = { name: string; paths: { points: number[]; weights: number[][] }[]; fills: Fill[] };
type Bone = { name: string; parent: number; attachment?: number; x: number; y: number; length: number; rotation: number; bind: Mat };
export type Rig = { rig: { x: number; y: number }; bones: Bone[]; shapes: Shape[]; animations: Record<string, Anim> };

type Property = "x" | "y" | "rotation" | "scaleX" | "scaleY" | "length";
type Transform = Record<Property, number>;
/** Rive's Mat2D order: x axis (a, b), y axis (c, d), translation (e, f). */
type Mat = [number, number, number, number, number, number];


const multiply = ([a, b, c, d, e, f]: Mat, [g, h, i, j, k, l]: Mat): Mat => [a * g + c * h, b * g + d * h, a * i + c * j, b * i + d * j, a * k + c * l + e, b * k + d * l + f];
const compose = (x: number, y: number, rotation: number, sx: number, sy: number): Mat => {
  const cos = Math.cos(rotation), sin = Math.sin(rotation);

  return [cos * sx, sin * sx, -sin * sy, cos * sy, x, y];
};
const invert = ([a, b, c, d, e, f]: Mat): Mat => {
  const det = a * d - b * c;

  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
};
const rgba = ([r, g, b, a]: number[]) => `rgba(${r},${g},${b},${a})`;

/**
 * Dual complex number skinning, the 2D form of dual quaternion skinning (Kavan et al. 2008): each bone's rigid transform
 * becomes a half-angle rotation r and a dual part t·conj(r)/2, the parts are blended and the rotation renormalised, so a
 * blended point keeps its distance from the joint instead of collapsing toward it as linear blending does. Bones are
 * assumed rigid where points blend; scaled face bones only ever carry single-bone points.
 */
function blend(skins: Mat[], w: number[], x: number, y: number): [number, number] {
  let rr = 0, ri = 0, dr = 0, di = 0, ar = 0, ai = 0;

  for (let j = 0; j < w.length; j += 2) {
    const [a, b, , , e, f] = skins[w[j] ?? 0] ?? [1, 0, 0, 1, 0, 0];
    const weight = w[j + 1] ?? 0;
    const half = Math.atan2(b, a) / 2;
    let qr = Math.cos(half), qi = Math.sin(half);

    if (j === 0) {
      ar = qr;
      ai = qi;
    } else if (qr * ar + qi * ai < 0) {
      qr = -qr;
      qi = -qi;
    }

    rr += qr * weight;
    ri += qi * weight;
    // (e + i f) / 2 · conj(qr + i qi)
    dr += ((e * qr + f * qi) / 2) * weight;
    di += ((f * qr - e * qi) / 2) * weight;
  }

  const n = Math.hypot(rr, ri) || 1;
  const [qr, qi, pr, pi] = [rr / n, ri / n, dr / n, di / n];
  // x' = q² x + 2 qε q
  const [cr, ci] = [qr * qr - qi * qi, 2 * qr * qi];

  return [cr * x - ci * y + 2 * (pr * qr - pi * qi), ci * x + cr * y + 2 * (pr * qi + pi * qr)];
}

type Vec = [number, number];

const NECK_SAMPLES = 24;
/** The share of the neck, from its base, over which points fade from their bone weights onto the curve. */
const NECK_FADE = 1;

/**
 * A bendy neck after Blender's B-Bones and Spine's path constraint: points weighted to the neck chain lie on one cubic Bézier
 * from the base of `Neck1` to the jaw joint, at the share of the neck and the offset from its axis they had at rest. The
 * curve leaves along `Neck1` and arrives along the head, turned back by the head's rest angle, so the neck bends as one arc and
 * meets the head without a crease. Points are placed by arc length, so the neck keeps its length only as far as the curve
 * does. Only this player draws it; a Rive runtime skins the same points with their bone weights.
 */
class NeckCurve {
  private readonly origin: Vec;
  private readonly axis: Vec;
  private readonly length: number;
  private readonly headAngle: number;
  private readonly points: Vec[] = [];
  private readonly arcs: number[] = [];
  private readonly controls: Vec[] = [];

  private constructor(
    private readonly chain: number[],
    private readonly head: number,
    binds: Mat[],
  ) {
    const [, , , , x0, y0] = binds[chain[0] ?? 0] ?? [1, 0, 0, 1, 0, 0];
    const [ha, hb, , , x1, y1] = binds[head] ?? [1, 0, 0, 1, 0, 0];

    this.length = Math.hypot(x1 - x0, y1 - y0);
    this.origin = [x0, y0];
    this.axis = [(x1 - x0) / this.length, (y1 - y0) / this.length];
    this.headAngle = Math.atan2(hb, ha) - Math.atan2(this.axis[1], this.axis[0]);
  }

  /** The curve for a rig with bones named `Neck1`… and `Head`, or none. */
  static of(bones: Bone[]): NeckCurve | undefined {
    const chain = bones.flatMap(({ name }, i) => (/^Neck\d+$/.test(name) ? [i] : []));
    const head = bones.findIndex(({ name }) => name === "Head");

    return chain.length && head >= 0 ? new NeckCurve(chain, head, bones.map((b) => b.bind)) : undefined;
  }

  /** Lays the curve between the posed base and jaw joint. */
  pose(worlds: Mat[], pose: Transform[]) {
    const [ba, bb, , , x0, y0] = worlds[this.chain[0] ?? 0] ?? [1, 0, 0, 1, 0, 0];
    const [ha, hb, , , x3, y3] = worlds[this.head] ?? [1, 0, 0, 1, 0, 0];
    const reach = this.chain.reduce((sum, i) => sum + (pose[i]?.length ?? 0), 0) / 3;
    const start = Math.atan2(bb, ba);
    const end = Math.atan2(hb, ha) - this.headAngle;

    this.controls.splice(
      0,
      4,
      [x0, y0],
      [x0 + Math.cos(start) * reach, y0 + Math.sin(start) * reach],
      [x3 - Math.cos(end) * reach, y3 - Math.sin(end) * reach],
      [x3, y3],
    );
    this.points.length = 0;
    this.arcs.length = 0;

    for (let i = 0; i <= NECK_SAMPLES; i++) {
      const point = this.at(i / NECK_SAMPLES);
      const last = this.points.at(-1);

      this.arcs.push((this.arcs.at(-1) ?? 0) + (last ? Math.hypot(point[0] - last[0], point[1] - last[1]) : 0));
      this.points.push(point);
    }
  }

  /** Moves a skinned point onto the curve, or leaves it where its weights put it when it lies off the neck. */
  place(w: number[], x: number, y: number, skinned: Vec): Vec {
    if (!w.some((value, j) => j % 2 === 0 && this.chain.includes(value))) {
      return skinned;
    }

    const [dx, dy] = [x - this.origin[0], y - this.origin[1]];
    const [ux, uy] = this.axis;
    const share = (dx * ux + dy * uy) / this.length;

    if (share <= 0 || share > 1) {
      return skinned;
    }

    const offset = dx * -uy + dy * ux;
    const t = this.param(share);
    const [px, py] = this.at(t);
    const [tx, ty] = this.tangent(t);
    const fade = Math.min(1, share / NECK_FADE);
    const mix = fade * fade * (3 - 2 * fade);
    const [cx, cy] = [px - ty * offset, py + tx * offset];

    return [skinned[0] + (cx - skinned[0]) * mix, skinned[1] + (cy - skinned[1]) * mix];
  }

  /** The Bézier parameter at a share of the curve's arc length. */
  private param(share: number): number {
    const target = share * (this.arcs.at(-1) ?? 0);
    const i = Math.max(1, this.arcs.findIndex((arc) => arc >= target));
    const a = this.arcs[i - 1] ?? 0;
    const b = this.arcs[i] ?? 0;

    return (i - 1 + (b > a ? (target - a) / (b - a) : 0)) / NECK_SAMPLES;
  }

  private at(t: number): Vec {
    const [p0 = [0, 0], p1 = [0, 0], p2 = [0, 0], p3 = [0, 0]] = this.controls;
    const s = 1 - t;
    const [k0, k1, k2, k3] = [s * s * s, 3 * s * s * t, 3 * s * t * t, t * t * t];

    return [k0 * p0[0] + k1 * p1[0] + k2 * p2[0] + k3 * p3[0], k0 * p0[1] + k1 * p1[1] + k2 * p2[1] + k3 * p3[1]];
  }

  private tangent(t: number): Vec {
    const [p0 = [0, 0], p1 = [0, 0], p2 = [0, 0], p3 = [0, 0]] = this.controls;
    const s = 1 - t;
    const [k0, k1, k2] = [3 * s * s, 6 * s * t, 3 * t * t];
    const x = k0 * (p1[0] - p0[0]) + k1 * (p2[0] - p1[0]) + k2 * (p3[0] - p2[0]);
    const y = k0 * (p1[1] - p0[1]) + k1 * (p2[1] - p1[1]) + k2 * (p3[1] - p2[1]);
    const n = Math.hypot(x, y) || 1;

    return [x / n, y / n];
  }
}

/** cubic-bezier easing, solved for x by bisection. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const curve = (t: number, p1: number, p2: number) => 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;

  return (x: number) => {
    let lo = 0, hi = 1, t = x;

    for (let i = 0; i < 24; i++) {
      if (curve(t, x1, x2) < x) {
        lo = t;
      } else {
        hi = t;
      }

      t = (lo + hi) / 2;
    }

    return curve(t, y1, y2);
  };
}

class Timeline {
  private readonly eases = new Map<Key, (t: number) => number>();

  constructor(private readonly anim: Anim) {
    for (const { keys } of anim.tracks) {
      for (const key of keys) {
        const [, , type, x1 = 0, y1 = 0, x2 = 1, y2 = 1] = key;

        if (type === "cubic") {
          this.eases.set(key, bezier(x1, y1, x2, y2));
        }
      }
    }
  }

  /** Writes this timeline's values at `frame` into the pose, mixed over what is there by `mix`. */
  apply(frame: number, pose: Transform[], rig: Transform, mix: number) {
    const time = this.anim.loop ? frame % this.anim.duration : Math.min(frame, this.anim.duration);

    for (const { object, property, keys } of this.anim.tracks) {
      const target = object === -1 ? rig : pose[object];

      if (!target) {
        continue;
      }

      const value = this.sample(keys, time);
      target[property] += (value - target[property]) * mix;
    }
  }

  private sample(keys: Key[], time: number) {
    const first = keys[0];

    if (!first || time <= first[0]) {
      return first?.[1] ?? 0;
    }

    for (let i = 0; i < keys.length - 1; i++) {
      const from = keys[i], to = keys[i + 1];

      if (!from || !to || time >= to[0]) {
        continue;
      }

      const t = (time - from[0]) / (to[0] - from[0]);
      const eased = from[2] === "hold" ? 0 : from[2] === "cubic" ? (this.eases.get(from)?.(t) ?? t) : t;

      return from[1] + (to[1] - from[1]) * eased;
    }

    return keys.at(-1)?.[1] ?? 0;
  }

  done(frame: number) {
    return !this.anim.loop && frame >= this.anim.duration;
  }
}

type Playing = { timeline: Timeline; frame: number };

/** One state machine layer: the playing state, and the one it is blending out of. */
class Layer {
  from: Playing | undefined;
  mix = 1;
  private mixSeconds = 0;

  constructor(public current: Playing) {}

  go(next: Playing, ms: number) {
    this.from = ms > 0 ? this.current : undefined;
    this.current = next;
    this.mix = ms > 0 ? 0 : 1;
    this.mixSeconds = ms / 1000;
  }

  advance(seconds: number) {
    this.current.frame += seconds * 60;

    if (this.from) {
      this.from.frame += seconds * 60;
      this.mix = Math.min(1, this.mix + seconds / this.mixSeconds);

      if (this.mix >= 1) {
        this.from = undefined;
      }
    }
  }

  get blending() {
    return this.from !== undefined;
  }

  apply(pose: Transform[], rig: Transform) {
    this.from?.timeline.apply(this.from.frame, pose, rig, 1);
    this.current.timeline.apply(this.current.frame, pose, rig, this.mix);
  }
}

export type Trigger = "happy" | "stretch";
export type Face = "normal" | "dead";
const FACE_PARTS = new Set(["Eyes", "Mouth", "Tongue"]);
/** The part of the 512 × 512 artboard to show. */
export type View = { x: number; y: number; width: number; height: number };

export class MascotPlayer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly timelines: Record<string, Timeline>;
  private readonly binds: Mat[];
  private readonly neck: NeckCurve | undefined;
  private readonly idle: Playing;
  private readonly body: Layer;
  private readonly blink: Layer;
  private readonly triggers = new Set<Trigger>();
  private face: Face = "normal";
  private running = false;
  private airborne = false;
  private ducking = false;
  private bodyPath: Path2D | undefined;
  private maskContext: CanvasRenderingContext2D | null = null;
  private hovering = false;
  private frameId = 0;
  private last = 0;
  private scale = 1;
  private readonly onMove = (e: PointerEvent) => this.setHovering(this.hit(e));
  private readonly onLeave = () => this.setHovering(false);

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly data: Rig,
    private readonly view: View = { x: 0, y: 0, width: 512, height: 512 },
  ) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("no 2d context");
    }

    this.ctx = ctx;
    this.timelines = Object.fromEntries(Object.entries(data.animations).map(([name, anim]) => [name, new Timeline(anim)]));
    this.binds = data.bones.map((b) => invert(b.bind));
    this.neck = NeckCurve.of(data.bones);
    this.idle = this.play("Idle");
    this.body = new Layer(this.idle);
    this.blink = new Layer(this.play("Wait 4s"));
    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerleave", this.onLeave);
  }

  destroy() {
    this.stop();
    this.canvas.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
  }

  fire(trigger: Trigger) {
    this.triggers.add(trigger);
  }

  start() {
    if (this.frameId) {
      return;
    }

    this.last = performance.now();

    const tick = (now: number) => {
      this.step(Math.min(0.1, (now - this.last) / 1000));
      this.last = now;
      this.frameId = requestAnimationFrame(tick);
    };
    this.frameId = requestAnimationFrame(tick);
  }

  setRunning(running: boolean) {
    this.running = running;
  }

  setAirborne(airborne: boolean) {
    this.airborne = airborne;
  }

  setDucking(ducking: boolean) {
    this.ducking = ducking;
  }

  setFace(face: Face) {
    this.face = face;

    if (!this.frameId) {
      this.still();
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }

  /** Draws the rest pose once, for reduced motion. */
  still() {
    const { pose, rig } = this.rest();

    this.render(pose, rig);
  }

  private rest() {
    return {
      pose: this.data.bones.map((b): Transform => ({ x: b.x, y: b.y, rotation: b.rotation, scaleX: 1, scaleY: 1, length: b.length })),
      rig: { ...this.data.rig, rotation: 0, scaleX: 1, scaleY: 1, length: 0 },
    };
  }

  private play(name: string): Playing {
    const timeline = this.timelines[name];

    if (!timeline) {
      throw new Error(`no animation ${name}`);
    }

    return { timeline, frame: 0 };
  }

  private step(seconds: number) {
    this.body.advance(seconds);
    this.blink.advance(seconds);
    this.transitions();
    this.triggers.clear();

    const { pose, rig } = this.rest();

    this.body.apply(pose, rig);
    this.blink.apply(pose, rig);
    this.render(pose, rig);
  }

  /** Mirrors the Dino state machine in scene.rml, plus the Dead slump that goes with the knocked-out face drawn here and a blink when ducking or stretching. */
  private transitions() {
    const { body, blink, timelines } = this;
    const at = body.current.timeline;

    if (!body.blending) {
      const moving = at === timelines.Run || at === timelines.Jump || at === timelines.Duck || at === timelines.Dead;
      const pose =
        this.face === "dead" ? "Dead" : this.running ? (this.airborne ? "Jump" : this.ducking ? "Duck" : "Run") : undefined;

      if (pose && at !== timelines[pose]) {
        body.go(this.play(pose), pose === "Run" ? 100 : 80);

        if (pose === "Duck") {
          this.blinkNow();
        }
      } else if (!pose && moving) {
        body.go(this.idle, 150);
      } else if (!moving) {
        if (at !== timelines.Stretch && this.triggers.has("stretch")) {
          body.go(this.play("Stretch"), 120);
          this.blinkNow();
        } else if (at === timelines.Idle && this.triggers.has("happy")) {
          body.go(this.play("Happy"), 120);
        } else if (at !== timelines.Idle && at.done(body.current.frame)) {
          body.go(this.idle, 200);
        }
      }
    }

    if (blink.current.timeline.done(blink.current.frame)) {
      const after = blink.current.timeline;
      blink.go(this.play(after === timelines.Blink ? this.pick() : after === timelines["Blink twice"] ? "Wait 4s" : "Blink"), 0);
    }
  }

  /** Blinks on a big head move, as animators do to mark it; a blink already under way is left to finish. */
  private blinkNow() {
    const { blink, timelines } = this;

    if (blink.current.timeline !== timelines.Blink && blink.current.timeline !== timelines["Blink twice"]) {
      blink.go(this.play("Blink"), 0);
    }
  }

  /** The blink state's random exits and their weights. */
  private pick() {
    const choices: [string, number][] = [["Wait 2s", 2], ["Wait 4s", 3], ["Wait 6s", 2], ["Blink twice", 1]];
    let roll = Math.random() * 8;

    for (const [name, weight] of choices) {
      roll -= weight;

      if (roll < 0) {
        return name;
      }
    }

    return "Wait 4s";
  }

  private render(pose: Transform[], rig: Transform) {
    const { ctx, canvas, data, view } = this;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    this.scale = width / view.width;

    const rigWorld = compose(rig.x, rig.y, 0, rig.scaleX, rig.scaleY);
    const worlds: Mat[] = [];

    pose.forEach((t, i) => {
      const bone = data.bones[i];
      const parentIndex = bone?.parent ?? -1;
      const parent = worlds[bone?.attachment ?? parentIndex];
      const x = parentIndex >= 0 ? (pose[parentIndex]?.length ?? 0) : t.x;
      const local = compose(x, parentIndex >= 0 ? 0 : t.y, t.rotation, t.scaleX, t.scaleY);

      worlds.push(multiply(parent ?? rigWorld, local));
    });

    const skins = worlds.map((w, i) => multiply(w, this.binds[i] ?? w));

    this.neck?.pose(worlds, pose);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(this.scale, 0, 0, this.scale, -view.x * this.scale, -view.y * this.scale);

    for (const shape of [...data.shapes].reverse()) {
      const path = new Path2D();
      const centres = shape.paths.map(({ points, weights }) => this.trace(path, points, weights, skins));

      if (this.face === "dead" && FACE_PARTS.has(shape.name)) {
        this.drawDead(shape, centres);
        continue;
      }

      if (shape.name === "Body") {
        this.bodyPath = path;
      }

      for (const fill of shape.fills) {
        this.paint(path, fill, rigWorld);
      }
    }
  }

  /** Skins every control point, draws the closed cubic outline through them, and returns the outline's centre. */
  private trace(path: Path2D, points: number[], weights: number[][], skins: Mat[]): [number, number] {
    const out: number[] = [];

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i] ?? 0, y = points[i + 1] ?? 0, w = weights[i / 2] ?? [];

      const [a, b, c, d, e, f] = skins[w[0] ?? 0] ?? [1, 0, 0, 1, 0, 0];
      const skinned: Vec = w.length <= 2 ? [a * x + c * y + e, b * x + d * y + f] : blend(skins, w, x, y);

      out.push(...(this.neck?.place(w, x, y, skinned) ?? skinned));
    }

    const n = out.length / 6;
    const p = (v: number, k: number) => out[(v % n) * 6 + k] ?? 0;
    path.moveTo(p(0, 2), p(0, 3));

    for (let v = 0; v < n; v++) {
      path.bezierCurveTo(p(v, 4), p(v, 5), p(v + 1, 0), p(v + 1, 1), p(v + 1, 2), p(v + 1, 3));
    }

    path.closePath();

    let cx = 0, cy = 0;

    for (let v = 0; v < n; v++) {
      cx += p(v, 2) / n;
      cy += p(v, 3) / n;
    }

    return [cx, cy];
  }

  /** The knocked-out face: a cross over each eye and a small round mouth, in the face's own ink. */
  private drawDead(shape: Shape, centres: [number, number][]) {
    const { ctx } = this;
    const ink = rgba(shape.fills[0]?.color ?? [54, 47, 54, 1]);

    if (shape.name === "Eyes") {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";

      for (const [x, y] of centres) {
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 8);
        ctx.lineTo(x + 8, y + 8);
        ctx.moveTo(x + 8, y - 8);
        ctx.lineTo(x - 8, y + 8);
        ctx.stroke();
      }
    } else if (shape.name === "Mouth") {
      ctx.fillStyle = ink;

      for (const [x, y] of centres) {
        ctx.beginPath();
        ctx.ellipse(x, y - 2, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private paint(path: Path2D, { color, feather, gradient }: Fill, rigWorld: Mat) {
    const { ctx, scale } = this;

    if (gradient) {
      const [a, b, c, d, e, f] = rigWorld;
      const [x0 = 0, y0 = 0] = gradient.from, [x1 = 0, y1 = 0] = gradient.to;
      const fill = ctx.createLinearGradient(a * x0 + c * y0 + e, b * x0 + d * y0 + f, a * x1 + c * y1 + e, b * x1 + d * y1 + f);

      for (const [offset = 0, ...rgb] of gradient.stops) {
        fill.addColorStop(offset, rgba(rgb));
      }

      ctx.fillStyle = fill;
      ctx.fill(path);
      return;
    }

    if (!feather) {
      ctx.fillStyle = rgba(color);
      ctx.fill(path);
      return;
    }

    // An inner feather: clip to the shape, then cast a blurred shadow of everything outside it, shifted by the offset.
    // The outside is a mask with the whole shape cut out under the nonzero rule, so overlapping parts count as inside.
    const { canvas } = this;
    const margin = Math.ceil((feather.strength * 3 + Math.max(Math.abs(feather.x), Math.abs(feather.y))) * scale);
    const mask = this.mask(canvas.width + margin * 2, canvas.height + margin * 2);
    const transform = ctx.getTransform();

    mask.setTransform(1, 0, 0, 1, 0, 0);
    mask.globalCompositeOperation = "source-over";
    mask.fillStyle = "#000";
    mask.fillRect(0, 0, mask.canvas.width, mask.canvas.height);
    mask.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e + margin, transform.f + margin);
    mask.globalCompositeOperation = "destination-out";
    mask.fill(path);

    ctx.save();
    ctx.clip(path);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.shadowColor = rgba(color);
    ctx.shadowBlur = feather.strength * scale;
    // Draw the mask a canvas-width off to the left and throw its shadow back, so only the shadow lands.
    ctx.shadowOffsetX = feather.x * scale + mask.canvas.width;
    ctx.shadowOffsetY = feather.y * scale;
    ctx.drawImage(mask.canvas, -margin - mask.canvas.width, -margin);
    ctx.restore();
  }

  /** A scratch canvas for feather masks, grown to the size asked for. */
  private mask(width: number, height: number) {
    this.maskContext ??= document.createElement("canvas").getContext("2d");

    if (!this.maskContext) {
      throw new Error("no 2d context");
    }

    const { canvas } = this.maskContext;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    return this.maskContext;
  }

  private hit(e: PointerEvent) {
    const dpr = window.devicePixelRatio || 1;

    return this.bodyPath !== undefined && this.ctx.isPointInPath(this.bodyPath, e.offsetX * dpr, e.offsetY * dpr);
  }

  private setHovering(hovering: boolean) {
    if (hovering && !this.hovering) {
      this.fire("happy");
    }

    this.hovering = hovering;
  }
}
