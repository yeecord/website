import assert from "node:assert/strict";
import { rig } from "../src/home/mascot/rig";

const head = rig.bones.findIndex(({ name }) => name === "Head");
const eyes = rig.bones.findIndex(({ name }) => name === "Eyes");
const neck = new Set(rig.bones.flatMap(({ name }, index) => /^Neck[123]$/.test(name) ? [index] : []));
const rigScales = new Set(["scaleX", "scaleY"]);

assert(head >= 0 && neck.size === 3);

let maxInfluences = 0, controlPoints = 0, headPoints = 0;

for (const { name, paths } of rig.shapes) {
  for (const { points, weights } of paths) {
    for (let i = 0; i < weights.length; i += 3) {
      const [x, y] = points.slice(2 * i + 2, 2 * i + 4);
      // The occiput and underside of the jaw mark the edge of the drawn head.
      const inHead = name === "Body"
        ? y - 156.1 <= 0.732 * (x - 296.5) && y < 217
        : name !== "Far legs";

      for (const w of weights.slice(i, i + 3)) {
        const [a, before, b, after = 0] = w;
        const count = w.length / 2;
        const at = `${name} at (${x}, ${y})`;

        assert(count === 1 || count === 2, `${at} has ${count} influences`);
        assert(rig.bones[a] && before > 0 && Math.abs(before + after - 1) < 1e-6, `${at} has invalid weights`);
        if (count === 2) {
          const first = rig.bones[a], second = rig.bones[b];

          assert(second && after > 0 && ((first.attachment ?? first.parent) === b || (second.attachment ?? second.parent) === a), `${at} blends non-adjacent bones`);
        }
        if (inHead) {
          // The eyes ride their own child of Head, so a blink can squash them without bending the head.
          assert(count === 1 && a === (name === "Eyes" ? eyes : head) && before === 1, `${at} is in the head and must be rigid`);
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
    if (rigScales.has(property) && object !== eyes) {
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
console.log(`${controlPoints} control points checked. Max ${maxInfluences} adjacent influences. ${headPoints} rigid head control points.`);
console.log(`Minimum keyed neck length ${minNeckLength}. Duck and Dead at rest length. Duck rig scaleY 1.`);
