import assert from "node:assert/strict";
import { rig } from "../src/home/mascot/rig";

const head = rig.bones.findIndex(({ name }) => name === "Head");
const eyes = rig.bones.findIndex(({ name }) => name === "Eyes");
const mouth = rig.bones.findIndex(({ name }) => name === "Mouth");
/** Face parts ride their own children of Head, so a blink or a mouth shape squashes them without bending the head. */
const faceBone: Record<string, number> = { Eyes: eyes, Mouth: mouth, Tongue: mouth };
const neck = new Set(rig.bones.flatMap(({ name }, index) => /^Neck[123]$/.test(name) ? [index] : []));
const rigScales = new Set(["scaleX", "scaleY"]);

assert(head >= 0 && neck.size === 3);

const joint = (b: number) => rig.bones[b]?.attachment ?? rig.bones[b]?.parent ?? -1;

/** Whether `a` is `b` or one of its ancestors. */
function above(a: number, b: number): boolean {
  return a === b || (joint(b) >= 0 && above(a, joint(b)));
}

let maxInfluences = 0, controlPoints = 0, headPoints = 0;

for (const { name, paths } of rig.shapes) {
  for (const { points, weights } of paths) {
    for (let i = 0; i < weights.length; i += 3) {
      const [x, y] = points.slice(2 * i + 2, 2 * i + 4);
      // Everything above the jaw joint is head.
      const inHead = name === "Body"
        ? y < 188
        : name !== "Far legs";

      for (const w of weights.slice(i, i + 3)) {
        const bones = w.filter((_, j) => j % 2 === 0);
        const total = w.filter((_, j) => j % 2 === 1).reduce((sum, v) => sum + v, 0);
        const [a, before] = w;
        const count = bones.length;
        const at = `${name} at (${x}, ${y})`;

        assert(count >= 1 && count <= 4, `${at} has ${count} influences`);
        assert(bones.every((b) => rig.bones[b]) && w.every((v, j) => j % 2 === 0 || v > 0) && Math.abs(total - 1) < 1e-6, `${at} has invalid weights`);
        assert(bones.every((b) => bones.every((c) => above(b, c) || above(c, b) || joint(b) === joint(c))), `${at} blends unrelated bones`);
        if (inHead) {
          assert(count === 1 && a === (faceBone[name] ?? head) && before === 1, `${at} is in the head and must be rigid`);
          headPoints++;
        }

        maxInfluences = Math.max(maxInfluences, count);
        controlPoints++;
      }
    }
  }
}

let minNeckLength = Infinity;

for (const [name, { tracks }] of Object.entries(rig.animations)) {
  for (const { object, property, keys } of tracks) {
    if (rigScales.has(property) && object !== eyes && object !== mouth) {
      assert(keys.every(([, v]) => v === 1), `${name} scales the rig or a bone`);
    }
    if (property !== "length" || !neck.has(object)) {
      continue;
    }

    const { length, name: bone } = rig.bones[object];

    for (const [, value, type, , y1 = 0, , y2 = 1] of keys) {
      assert(value >= length && (name === "Stretch" || value === length), `${name} changes ${bone} to an invalid length`);
      // Bounded Bézier y controls keep the interpolated length between the keys.
      assert(type !== "cubic" || (y1 >= 0 && y1 <= 1 && y2 >= 0 && y2 <= 1), `${name} can overshoot a ${bone} length key`);
      minNeckLength = Math.min(minNeckLength, value);
    }
  }
}

const duckScale = rig.animations.Duck.tracks.find(({ object, property }) => object === -1 && property === "scaleY");

assert(duckScale?.keys.every(([, value]) => value === 1), "Duck needs a unit rig scaleY");
console.log(`${controlPoints} control points checked. Max ${maxInfluences} related influences. ${headPoints} rigid head control points.`);
console.log(`Minimum keyed neck length ${minNeckLength}. Duck and Dead at rest length. Duck rig scaleY 1.`);
