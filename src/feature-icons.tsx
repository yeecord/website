import {
  Bell,
  ChartColumn,
  ClipboardList,
  Eraser,
  Gamepad2,
  Gift,
  Globe,
  Lock,
  type LucideIcon,
  ShieldCheck,
  Sprout,
  Tags,
  UserCheck,
  Users,
  Volume2,
} from "lucide-react";

/** 以 src/features.ts 的功能和預設組合 id 對應 */
const ICONS: Record<string, LucideIcon> = {
  giveaway: Gift,
  poll: ChartColumn,
  notification: Bell,
  voice: Volume2,
  "auto-role": UserCheck,
  "role-menu": Tags,
  lock: Lock,
  clear: Eraser,
  form: ClipboardList,
  defense: ShieldCheck,
  friends: Users,
  community: Gamepad2,
  public: Globe,
  basic: Sprout,
};

export function FeatureIcon({ id }: { id: string }) {
  const Icon = ICONS[id];

  return Icon ? <Icon className="feature-icon" aria-hidden /> : null;
}
