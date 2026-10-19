import { type ReactNode, type SVGProps, useId } from "react";
import { cn } from "~/utils/cn";

// Discord's icons drawn from the geometry in the style spec: a 24-unit box, round caps and joins,
// and each stroke width given in units so it scales with the icon.

type IconProps = SVGProps<SVGSVGElement>;

function Icon({
  weight = 2,
  children,
  ...props
}: Omit<IconProps, "stroke"> & { weight?: number; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/** The ephemeral note's eye: an almond outline with a solid pupil, its top right bitten off. */
export function EyeIcon(props: IconProps) {
  const mask = useId();

  return (
    <Icon {...props}>
      <path d="M1 12C3.8 6.4 7.6 3 12 3s8.2 3.4 11 9c-2.8 5.6-6.6 9-11 9S3.8 17.6 1 12Z" />
      <mask id={mask}>
        <rect width="24" height="24" fill="white" />
        <circle cx="15" cy="9" r="2.5" fill="black" />
      </mask>
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" mask={`url(#${mask})`} />
    </Icon>
  );
}

/** The link button's mark: a rounded square open at its top right, with an arrow leaving it. */
export function ExternalLinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6" />
      <path d="M16 2h6v6M22 2l-8.5 8.5" />
    </Icon>
  );
}

export function ChevronIcon({ up, ...props }: IconProps & { up?: boolean }) {
  return (
    <Icon {...props}>
      <path d={up ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
    </Icon>
  );
}

/** An X whose arms each span `span` units, centred in the box. */
export function CrossIcon({ span = 12, ...props }: IconProps & { span?: number }) {
  const from = 12 - span / 2;
  const to = 12 + span / 2;

  return (
    <Icon {...props}>
      <path d={`M${from} ${from} ${to} ${to}M${to} ${from} ${from} ${to}`} />
    </Icon>
  );
}

/** A selected option's mark: a blurple disc with a white tick. */
export function SelectedIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="11" fill="#5865f2" stroke="none" />
      <path d="m7 13 3 3 7-7" stroke="#fff" />
    </Icon>
  );
}

export function TickIcon(props: IconProps) {
  return (
    <Icon weight={3} {...props}>
      <path d="m6 12 4 4 8-8" />
    </Icon>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v13M7 11l5 5 5-5M3 21h18" />
    </Icon>
  );
}

/** A solid page with a folded corner, an upward arrow cut from its lower right. */
export function UploadIcon(props: IconProps) {
  const mask = useId();

  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <mask id={mask}>
        <rect width="24" height="24" fill="white" />
        <circle cx="17" cy="17" r="6.5" fill="black" />
      </mask>
      <path
        d="M6 1h8l7 7v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z"
        fill="currentColor"
        mask={`url(#${mask})`}
      />
      <path
        d="M17 21v-7m-3 3 3-3 3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A solid disc with an exclamation mark cut out, for a failed interaction. */
export function AlertCircleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm-1.45 5h2.9L13.05 15h-2.1ZM12 16.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
      />
    </svg>
  );
}

/** A solid rounded triangle with an exclamation mark cut out, for the modal's submit warning. */
export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M10.27 3.5a2 2 0 0 1 3.46 0l8.5 14.75A2 2 0 0 1 20.5 21.25h-17a2 2 0 0 1-1.73-3l8.5-14.75ZM10.55 8h2.9l-.4 7h-2.1Zm1.45 8.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
      />
    </svg>
  );
}

/** The premium button's shop mark: a bag with a handle. */
export function ShopIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 8h16l-1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 8Z" />
      <path d="M8.5 11V6.5a3.5 3.5 0 0 1 7 0V11" />
    </Icon>
  );
}

/** A File component's page: a lavender sheet with a folded corner, its mark drawn by type. */
export function FileIllustration({
  archive,
  ...props
}: SVGProps<SVGSVGElement> & { archive?: boolean }) {
  return (
    <svg viewBox="0 0 30 40" aria-hidden {...props}>
      <path d="M2 0h18l10 10v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z" fill="#d3d6fd" />
      <path d="M20 0v8a2 2 0 0 0 2 2h8Z" fill="#a5abf7" />
      {archive ? (
        <g fill="#5865f2">
          <rect x="10" y="2" width="4" height="4" rx="1" />
          <rect x="14" y="7" width="4" height="4" rx="1" />
          <rect x="10" y="12" width="4" height="4" rx="1" />
          <rect x="14" y="17" width="4" height="4" rx="1" />
          <rect x="10" y="22" width="4" height="4" rx="1" />
          <rect x="11" y="27" width="6" height="7" rx="2" />
        </g>
      ) : (
        <g stroke="#5865f2" strokeWidth="2" strokeLinecap="round">
          <path d="M7 18h16M7 24h16M7 30h10" />
        </g>
      )}
    </svg>
  );
}

/** Three dots that light in turn, for "thinking" and loading states. */
export function ThinkingDots() {
  return (
    <span className="discord-dots" aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}

/** A checkbox square: hollow until checked, then blurple with a white tick. */
export function CheckboxMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded border transition-colors duration-150 ease-out",
        checked
          ? "border-discord-hairline bg-discord-blurple group-hover:bg-discord-blurple-hover"
          : "border-discord-control bg-black/8 group-hover:border-discord-control-hover",
      )}
    >
      <TickIcon
        className={cn(
          "size-[18px] text-white transition-[opacity,scale] duration-150 ease-out motion-reduce:transition-none",
          checked ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
      />
    </span>
  );
}
