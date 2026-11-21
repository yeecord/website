// Plays the mascot rig on a canvas: skins the outline each frame and runs the two state machine layers of mascot/scene.rml.
type Key = [frame: number, value: number, type: string, x1?: number, y1?: number, x2?: number, y2?: number];
type Track = { object: number; property: Property; keys: Key[] };
type Anim = { duration: number; loop: boolean; tracks: Track[] };
type Fill = { color: number[]; feather?: { strength: number; x: number; y: number }; gradient?: { from: number[]; to: number[]; stops: number[][] } };
type Shape = { name: string; paths: { points: number[]; weights: number[][] }[]; fills: Fill[] };
type Bone = { name: string; parent: number; x: number; y: number; length: number; rotation: number; bind: Mat };
export type Rig = { rig: { x: number; y: number }; bones: Bone[]; shapes: Shape[]; animations: Record<string, Anim> };

type Property = "x" | "y" | "rotation" | "scaleX" | "scaleY" | "length";
type Transform = Record<Property, number>;
/** Rive's Mat2D order: x axis (a, b), y axis (c, d), translation (e, f). */
type Mat = [number, number, number, number, number, number];

const FAR = 4096;

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
/** The part of the 512 × 512 artboard to show. */
export type View = { x: number; y: number; width: number; height: number };

export class MascotPlayer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly timelines: Record<string, Timeline>;
  private readonly binds: Mat[];
  private readonly idle: Playing;
  private readonly body: Layer;
  private readonly blink: Layer;
  private readonly triggers = new Set<Trigger>();
  private bodyPath: Path2D | undefined;
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

  /** Mirrors the Dino state machine in scene.rml. */
  private transitions() {
    const { body, blink, timelines } = this;
    const at = body.current.timeline;

    if (!body.blending) {
      if (at !== timelines.Stretch && this.triggers.has("stretch")) {
        body.go(this.play("Stretch"), 120);
      } else if (at === timelines.Idle && this.triggers.has("happy")) {
        body.go(this.play("Happy"), 120);
      } else if (at !== timelines.Idle && at.done(body.current.frame)) {
        body.go(this.idle, 200);
      }
    }

    if (blink.current.timeline.done(blink.current.frame)) {
      const after = blink.current.timeline;
      blink.go(this.play(after === timelines.Blink ? this.pick() : after === timelines["Blink twice"] ? "Wait 4s" : "Blink"), 0);
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
      const parentIndex = data.bones[i]?.parent ?? -1;
      const parent = worlds[parentIndex];
      const local = parent ? compose(pose[parentIndex]?.length ?? 0, 0, t.rotation, t.scaleX, t.scaleY) : compose(t.x, t.y, t.rotation, t.scaleX, t.scaleY);

      worlds.push(multiply(parent ?? rigWorld, local));
    });

    const skins = worlds.map((w, i) => multiply(w, this.binds[i] ?? w));

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(this.scale, 0, 0, this.scale, -view.x * this.scale, -view.y * this.scale);

    for (const shape of [...data.shapes].reverse()) {
      const path = new Path2D();

      for (const { points, weights } of shape.paths) {
        this.trace(path, points, weights, skins);
      }

      if (shape.name === "Body") {
        this.bodyPath = path;
      }

      for (const fill of shape.fills) {
        this.paint(path, fill, rigWorld);
      }
    }
  }

  /** Skins every control point, then draws the closed cubic outline through them. */
  private trace(path: Path2D, points: number[], weights: number[][], skins: Mat[]) {
    const out: number[] = [];

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i] ?? 0, y = points[i + 1] ?? 0, w = weights[i / 2] ?? [];
      let px = 0, py = 0;

      for (let j = 0; j < w.length; j += 2) {
        const [a, b, c, d, e, f] = skins[w[j] ?? 0] ?? [1, 0, 0, 1, 0, 0];
        const weight = w[j + 1] ?? 0;
        px += (a * x + c * y + e) * weight;
        py += (b * x + d * y + f) * weight;
      }

      out.push(px, py);
    }

    const n = out.length / 6;
    const p = (v: number, k: number) => out[(v % n) * 6 + k] ?? 0;
    path.moveTo(p(0, 2), p(0, 3));

    for (let v = 0; v < n; v++) {
      path.bezierCurveTo(p(v, 4), p(v, 5), p(v + 1, 0), p(v + 1, 1), p(v + 1, 2), p(v + 1, 3));
    }

    path.closePath();
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
    const outside = new Path2D();
    outside.rect(-FAR, -FAR, FAR * 2, FAR * 2);
    outside.addPath(path);
    ctx.save();
    ctx.clip(path);
    ctx.shadowColor = rgba(color);
    ctx.shadowBlur = feather.strength * scale;
    ctx.shadowOffsetX = (feather.x + FAR * 2) * scale;
    ctx.shadowOffsetY = feather.y * scale;
    ctx.translate(-FAR * 2, 0);
    ctx.fillStyle = "#000";
    ctx.fill(outside, "evenodd");
    ctx.restore();
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
