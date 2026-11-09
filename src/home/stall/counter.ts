import type Matter from "matter-js";

type MatterModule = typeof Matter;

const WALL = 200;
const TAP_DISTANCE = 8;
const TAP_MS = 300;
const MAX_SPEED = 26;
/** 鍋口上方這麼高以內都算掉進鍋裡 */
const POT_MOUTH = 64;

export type Spawn = {
  /** 0 到 1，佔檯面寬度的比例 */
  x: number;
  /** 離檯面多高，單位是像素 */
  lift: number;
  vx: number;
  vy: number;
};

type Token = {
  body: Matter.Body;
  radius: number;
  element: HTMLElement;
  disc: HTMLElement | null;
  held: Matter.Constraint | null;
  release: () => void;
};

type Events = {
  /** 掉進鍋口的食材，回傳 false 代表鍋子滿了要彈出去 */
  onPot: (key: string) => boolean;
  onTap: (key: string) => void;
};

/** 檯面上的物理世界：食材是會滾的圓，鍋子是擋路的方塊，鍋口上方是感應區 */
export class Counter {
  private readonly engine: Matter.Engine;
  private readonly tokens = new Map<string, Token>();
  private statics: Matter.Body[] = [];
  private frame = 0;
  private width = 0;
  private height = 0;
  private potRect = { left: 0, right: 0, top: 0 };
  private visible = true;
  private readonly observer: IntersectionObserver;
  private readonly resizer: ResizeObserver;

  constructor(
    private readonly matter: MatterModule,
    private readonly root: HTMLElement,
    private readonly pot: HTMLElement,
    private readonly events: Events,
  ) {
    this.engine = matter.Engine.create({ gravity: { x: 0, y: 1.35, scale: 0.001 } });
    this.layout();
    this.resizer = new ResizeObserver(() => this.layout());
    this.resizer.observe(root);
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry?.isIntersecting ?? true;
    });
    this.observer.observe(root);
    this.frame = requestAnimationFrame(this.step);
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    this.resizer.disconnect();
    this.observer.disconnect();

    for (const token of this.tokens.values()) {
      token.release();
    }

    this.matter.Engine.clear(this.engine);
  }

  /** 鍋口正上方，給從鍋裡跳出來的食材當起點 */
  get potMouth(): Spawn {
    return {
      x: (this.potRect.left + this.potRect.right) / 2 / Math.max(this.width, 1),
      lift: this.height - this.potRect.top + POT_MOUTH,
      vx: 0,
      vy: 0,
    };
  }

  attach(key: string, element: HTMLElement, spawn: Spawn) {
    const { Bodies, Body, Composite } = this.matter;
    const radius = element.offsetWidth / 2;
    const body = Bodies.circle(
      Math.min(Math.max(spawn.x * this.width, radius), this.width - radius),
      this.height - spawn.lift - radius,
      radius,
      { restitution: 0.38, friction: 0.5, frictionAir: 0.012, density: 0.002 },
    );

    Body.setVelocity(body, { x: spawn.vx, y: spawn.vy });
    Body.setAngularVelocity(body, spawn.vx * 0.02);
    Composite.add(this.engine.world, body);

    const token: Token = {
      body,
      radius,
      element,
      disc: element.querySelector<HTMLElement>("[data-disc]"),
      held: null,
      release: () => {},
    };

    token.release = this.listen(key, token);
    this.tokens.set(key, token);
    this.paint(token);
  }

  detach(key: string) {
    const token = this.tokens.get(key);

    if (!token) {
      return;
    }

    token.release();
    this.drop(token);
    this.matter.Composite.remove(this.engine.world, token.body);
    this.tokens.delete(key);
  }

  private layout() {
    const { Bodies, Body, Composite } = this.matter;
    const rootRect = this.root.getBoundingClientRect();
    const potRect = this.pot.getBoundingClientRect();

    this.width = rootRect.width;
    this.height = rootRect.height;
    this.potRect = {
      left: potRect.left - rootRect.left,
      right: potRect.right - rootRect.left,
      top: potRect.top - rootRect.top,
    };

    Composite.remove(this.engine.world, this.statics);

    const wall = (x: number, y: number, w: number, h: number) =>
      Bodies.rectangle(x, y, w, h, { isStatic: true, friction: 0.6 });

    this.statics = [
      wall(this.width / 2, this.height + WALL / 2, this.width + WALL * 2, WALL),
      wall(this.width / 2, -WALL * 2, this.width + WALL * 2, WALL),
      wall(-WALL / 2, this.height / 2, WALL, this.height * 6),
      wall(this.width + WALL / 2, this.height / 2, WALL, this.height * 6),
      wall(
        (this.potRect.left + this.potRect.right) / 2,
        (this.potRect.top + this.height) / 2 + 6,
        this.potRect.right - this.potRect.left - 12,
        this.height - this.potRect.top,
      ),
    ];
    Composite.add(this.engine.world, this.statics);

    for (const token of this.tokens.values()) {
      if (token.body.position.x > this.width - token.radius) {
        Body.setPosition(token.body, {
          x: this.width - token.radius,
          y: token.body.position.y,
        });
      }
    }
  }

  private point(event: PointerEvent): Matter.Vector {
    const rect = this.root.getBoundingClientRect();

    return {
      x: Math.min(Math.max(event.clientX - rect.left, 0), this.width),
      y: Math.min(Math.max(event.clientY - rect.top, -this.height), this.height),
    };
  }

  private listen(key: string, token: Token): () => void {
    const { Constraint, Composite, Sleeping } = this.matter;
    const { element } = token;
    let start = { x: 0, y: 0, time: 0 };

    const down = (event: PointerEvent) => {
      if (token.held || event.button !== 0) {
        return;
      }

      const point = this.point(event);

      start = { x: event.clientX, y: event.clientY, time: event.timeStamp };
      element.setPointerCapture(event.pointerId);
      element.dataset.held = "";
      Sleeping.set(token.body, false);
      token.held = Constraint.create({
        pointA: point,
        bodyB: token.body,
        pointB: {
          x: point.x - token.body.position.x,
          y: point.y - token.body.position.y,
        },
        length: 0,
        stiffness: 0.16,
        damping: 0.25,
      });
      Composite.add(this.engine.world, token.held);
    };
    const move = (event: PointerEvent) => {
      if (token.held) {
        token.held.pointA = this.point(event);
      }
    };
    const up = (event: PointerEvent) => {
      if (!token.held) {
        return;
      }

      this.drop(token);

      const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);

      if (moved < TAP_DISTANCE && event.timeStamp - start.time < TAP_MS) {
        this.events.onTap(key);
      }
    };
    const press = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.events.onTap(key);
      }
    };

    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("keydown", press);

    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("keydown", press);
    };
  }

  private drop(token: Token) {
    if (token.held) {
      this.matter.Composite.remove(this.engine.world, token.held);
      token.held = null;
      delete token.element.dataset.held;
    }
  }

  private paint(token: Token) {
    const { x, y } = token.body.position;

    token.element.style.transform = `translate(${x - token.radius}px, ${y - token.radius}px)`;

    if (token.disc) {
      token.disc.style.transform = `rotate(${token.body.angle}rad)`;
    }
  }

  private readonly step = () => {
    this.frame = requestAnimationFrame(this.step);

    if (!this.visible || this.tokens.size === 0) {
      return;
    }

    const { Body, Engine } = this.matter;

    Engine.update(this.engine, 1000 / 60);

    for (const [key, token] of this.tokens) {
      const { body } = token;
      const speed = Math.hypot(body.velocity.x, body.velocity.y);

      if (speed > MAX_SPEED) {
        Body.setVelocity(body, {
          x: (body.velocity.x / speed) * MAX_SPEED,
          y: (body.velocity.y / speed) * MAX_SPEED,
        });
      }

      const overPot =
        !token.held &&
        body.velocity.y >= -0.5 &&
        body.position.x > this.potRect.left &&
        body.position.x < this.potRect.right &&
        body.position.y > this.potRect.top - POT_MOUTH &&
        body.position.y < this.potRect.top + token.radius;

      if (overPot && !this.events.onPot(key)) {
        Body.setVelocity(body, { x: -5 - Math.random() * 3, y: -9 });
      }

      this.paint(token);
    }
  };
}
