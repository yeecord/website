import { EASE_OUT } from "~/components/mdx/flow";

/** A burst of particles flung from a point and falling away, drawn on a fixed layer and removed when done. */
export type Particle =
  | { kind: "paper"; color: string }
  | { kind: "image"; src: string; size: number };

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function layer() {
  const node = document.createElement("div");

  node.setAttribute("aria-hidden", "true");
  node.style.cssText =
    "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:60";
  document.body.append(node);

  return node;
}

function piece(particle: Particle) {
  if (particle.kind === "image") {
    const img = document.createElement("img");

    img.src = particle.src;
    img.alt = "";
    img.width = particle.size;
    img.height = particle.size;

    return img;
  }

  const paper = document.createElement("span");

  paper.style.cssText = `display:block;width:8px;height:12px;border-radius:2px;background:${particle.color}`;

  return paper;
}

/** Flings `count` particles from (`x`, `y`) in viewport pixels, picking each from `palette` in turn. */
export function burst(
  x: number,
  y: number,
  palette: readonly Particle[],
  { count = 36, spread = 1 }: { count?: number; spread?: number } = {},
) {
  if (reducedMotion()) {
    return;
  }

  const root = layer();
  const flights = Array.from({ length: count }, (_, i) => {
    const node = piece(palette[i % palette.length]);
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = (180 + Math.random() * 260) * spread;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    const spin = (Math.random() - 0.5) * 720;

    node.style.cssText += `;position:absolute;left:${x}px;top:${y}px;translate:-50% -50%`;
    root.append(node);

    return node.animate(
      [
        { transform: "translate(0, 0) rotate(0deg) scale(0.6)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(${spin / 2}deg) scale(1)`,
          opacity: 1,
          offset: 0.45,
        },
        {
          transform: `translate(${dx * 1.3}px, ${dy + 320}px) rotate(${spin}deg) scale(0.9)`,
          opacity: 0,
        },
      ],
      { duration: 1100 + Math.random() * 500, easing: `cubic-bezier(${EASE_OUT.join(", ")})` },
    ).finished;
  });

  Promise.all(flights).finally(() => root.remove());
}
