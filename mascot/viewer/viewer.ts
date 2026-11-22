// Draws the mascot rig's bones and weights over the live player. Run `portless run --name mascot-rig bun mascot/viewer/index.html --port '$PORT'`.
import { type Mat, MascotPlayer, type View } from "../../src/home/mascot/player";
import { rig } from "../../src/home/mascot/rig";

const VIEW: View = { x: 48, y: 30, width: 500, height: 434 };
const POSES = [
  ["Idle", "站著"],
  ["Run", "跑步"],
  ["Jump", "跳躍"],
  ["Duck", "蹲下"],
  ["Dead", "昏倒"],
  ["Happy", "開心"],
  ["Stretch", "伸脖子"],
] as const;
const COLORS = ["#8a8f98", "#e0603a", "#f08a3c", "#f7c157", "#326ed0", "#7c4ddb", "#2fb6a8", "#4fa3e0", "#9ccf3f", "#d9488f", "#a05bd6", "#c99a2e", "#1f8f6a"];

const element = <T extends HTMLElement>(id: string, type: new () => T): T => {
  const el = document.getElementById(id);

  if (!(el instanceof type)) {
    throw new Error(`missing #${id}`);
  }

  return el;
};

const skinCanvas = element("skin", HTMLCanvasElement);
const overlay = element("overlay", HTMLCanvasElement);
const ctx = (() => {
  const context = overlay.getContext("2d");

  if (!context) {
    throw new Error("no 2d context");
  }

  return context;
})();

const player = new MascotPlayer(skinCanvas, rig, VIEW);
const show = { bones: true, weights: true };
let selected: number | undefined;

const hex = (color: string) => [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
const colorOf = (bone: number) => COLORS[bone % COLORS.length] ?? "#000000";
const apply = ([a, b, c, d, e, f]: Mat, x: number, y: number): [number, number] => [a * x + c * y + e, b * x + d * y + f];

/** A Spine-style bone: a long diamond from its origin to its tip. */
function drawBone(world: Mat, length: number, color: string, faded: boolean) {
  const [x0, y0] = apply(world, 0, 0);
  const [x1, y1] = apply(world, length, 0);
  const width = Math.min(7, Math.max(3, length * 0.14));
  const [nx, ny] = apply(world, length * 0.18, width);
  const [sx, sy] = apply(world, length * 0.18, -width);

  ctx.globalAlpha = faded ? 0.25 : 1;
  ctx.fillStyle = color;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(nx, ny);
  ctx.lineTo(x1, y1);
  ctx.lineTo(sx, sy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x0, y0, width * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;
}

type Skinned = { x: number; y: number; w: number[] };

/** Every anchor point of every path, skinned like the player does, with the bones that move it. */
function* skinned(skins: Mat[]): Generator<Skinned> {
  for (const shape of rig.shapes) {
    for (const { points, weights } of shape.paths) {
      for (let i = 2; i < points.length; i += 6) {
        const w = weights[i / 2] ?? [];
        const x = points[i] ?? 0, y = points[i + 1] ?? 0;
        let px = 0, py = 0;

        for (let j = 0; j < w.length; j += 2) {
          const [sx, sy] = apply(skins[w[j] ?? 0] ?? [1, 0, 0, 1, 0, 0], x, y);
          const weight = w[j + 1] ?? 0;

          px += sx * weight;
          py += sy * weight;
        }

        yield { x: px, y: py, w };
      }
    }
  }
}

/** Every vertex coloured by the mix of the bones that move it. */
function drawWeights(points: Skinned[]) {
  for (const { x, y, w } of points) {
    const rgb = [0, 0, 0];
    let own = 0;

    for (let j = 0; j < w.length; j += 2) {
      const bone = w[j] ?? 0, weight = w[j + 1] ?? 0;
      const [r, g, b] = hex(colorOf(bone));

      rgb[0] += (r ?? 0) * weight;
      rgb[1] += (g ?? 0) * weight;
      rgb[2] += (b ?? 0) * weight;

      if (bone === selected) {
        own = weight;
      }
    }

    ctx.globalAlpha = selected === undefined ? 1 : 0.15 + own * 0.85;
    ctx.fillStyle = `rgb(${rgb.map(Math.round).join(",")})`;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, selected === undefined ? 3 : 1.5 + own * 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

const heightOut = element("height", HTMLElement);

player.onFrame = ({ worlds, skins }) => {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.round(overlay.clientWidth * dpr);
  const height = Math.round(overlay.clientHeight * dpr);
  const scale = width / VIEW.width;

  if (overlay.width !== width || overlay.height !== height) {
    overlay.width = width;
    overlay.height = height;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(scale, 0, 0, scale, -VIEW.x * scale, -VIEW.y * scale);

  const points = [...skinned(skins)];

  if (show.weights) {
    drawWeights(points);
  }

  heightOut.textContent = String(Math.round(rig.rig.y - Math.min(...points.map((point) => point.y))));

  if (show.bones) {
    rig.bones.forEach((bone, i) => {
      const world = worlds[i];

      if (world) {
        drawBone(world, bone.length, colorOf(i), selected !== undefined && selected !== i);
      }
    });
  }
};

const poseButtons = POSES.map(([name, label]) => {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-pressed", String(name === "Idle"));
  button.addEventListener("click", () => {
    player.setFace(name === "Dead" ? "dead" : "normal");
    player.pin(name);
    poseButtons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
  });
  element("poses", HTMLDivElement).append(button);

  return button;
});

const boneButtons = rig.bones.map((bone, i) => {
  const item = document.createElement("li");
  const button = document.createElement("button");
  const swatch = document.createElement("span");

  swatch.style.background = colorOf(i);
  button.type = "button";
  button.append(swatch, bone.name);
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    selected = selected === i ? undefined : i;
    boneButtons.forEach((other, j) => other.setAttribute("aria-pressed", String(j === selected)));
  });
  item.append(button);
  element("bones", HTMLUListElement).append(item);

  return button;
});

const pause = element("pause", HTMLButtonElement);
let paused = false;

pause.addEventListener("click", () => {
  paused = !paused;
  pause.textContent = paused ? "繼續" : "暫停";

  if (paused) {
    player.stop();
  } else {
    player.start();
  }
});

const slow = element("slow", HTMLButtonElement);

slow.addEventListener("click", () => {
  player.timeScale = player.timeScale === 1 ? 0.25 : 1;
  slow.setAttribute("aria-pressed", String(player.timeScale !== 1));
});

const toggle = (id: string, onChange: (on: boolean) => void) => {
  const input = element(id, HTMLInputElement);

  input.addEventListener("change", () => onChange(input.checked));
};

toggle("show-bones", (on) => {
  show.bones = on;
});
toggle("show-weights", (on) => {
  show.weights = on;
});
toggle("show-skin", (on) => {
  skinCanvas.style.opacity = on ? "1" : "0";
});

const initial = POSES.findIndex(([name]) => name === new URLSearchParams(location.search).get("pose"));

player.pin("Idle");
player.start();
poseButtons[initial]?.click();
