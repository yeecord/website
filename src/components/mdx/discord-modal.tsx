import type { ReactNode } from "react";
import { BotAvatar, DiscordButton } from "~/components/mdx/discord";
import {
  AlertTriangleIcon,
  CheckboxMark,
  CrossIcon,
  FileIllustration,
  UploadIcon,
} from "~/components/mdx/discord-icons";
import { cn } from "~/utils/cn";

/// An interaction modal: the app's title, the submit warning, its components 24px apart,
/// then Cancel and Submit sharing the footer.
export function DiscordModal({
  title,
  warning,
  cancel,
  submit,
  submitPressed,
  submitHint,
  className,
  children,
}: {
  title: string;
  /** The notice Discord pins above every modal, naming the app the form goes to. */
  warning: ReactNode;
  cancel: string;
  submit: string;
  submitPressed?: boolean;
  /** Drawn over the submit button, such as the cursor of a demo. */
  submitHint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[480px] rounded-xl border border-discord-hairline bg-discord-card pt-2 pb-4 font-discord text-discord-text shadow-[0_12px_24px_rgb(0_0_0/0.24)]",
        className,
      )}
    >
      <div className="flex items-end gap-3 pt-4 pr-14 pb-2 pl-6">
        <BotAvatar className="mb-[3px] size-6 p-0" />
        <h2 className="m-0 min-w-0 text-2xl leading-[30px] font-semibold text-discord-strong">
          {title}
        </h2>
      </div>
      <span className="absolute top-2 right-2 flex size-10 cursor-pointer items-center justify-center rounded-lg text-discord-subtle hover:bg-[rgb(151_151_159/0.161)] hover:text-discord-strong active:bg-discord-selected">
        <CrossIcon span={16} className="size-5" />
      </span>
      <div className="px-6 pt-4 pb-2">
        <div className="mb-4 flex gap-2 rounded-lg border border-discord-warning bg-[rgb(248_163_0/0.078)] p-2">
          <AlertTriangleIcon className="size-5 shrink-0 text-discord-warning" />
          <p className="m-0 text-sm leading-[18px] font-medium text-pretty text-discord-text [&_strong]:font-bold">
            {warning}
          </p>
        </div>
        <div className="flex flex-col gap-6">{children}</div>
      </div>
      <div className="flex gap-2 px-6 pt-4 pb-2">
        <DiscordButton size="md" className="flex-1">
          {cancel}
        </DiscordButton>
        <span className="relative flex flex-1">
          <DiscordButton
            size="md"
            variant="primary"
            pressed={submitPressed}
            className="flex-1"
          >
            {submit}
          </DiscordButton>
          {submitHint}
        </span>
      </div>
    </div>
  );
}

/// A Label: its text, an optional description, then the component it labels.
export function DiscordLabel({
  label,
  description,
  required,
  error,
  children,
}: {
  label: string;
  description?: string;
  required?: boolean;
  /** Replaces the asterisk and turns the label red. */
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p
          className={cn(
            "m-0 text-base leading-5 font-medium",
            error ? "text-discord-danger-text" : "text-discord-strong",
          )}
        >
          {label}
          {error ? (
            <span className="text-xs italic">
              <span className="mx-1">-</span>
              {error}
            </span>
          ) : required ? (
            <span className="ml-1 text-discord-danger-text">*</span>
          ) : null}
        </p>
        {description ? (
          <p className="m-0 mt-2 text-sm leading-5 text-discord-text">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function DiscordTextInput({
  value,
  placeholder,
  paragraph,
  focused,
  error,
}: {
  value?: string;
  placeholder?: string;
  paragraph?: boolean;
  focused?: boolean;
  error?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border text-base leading-5 whitespace-pre-line",
        paragraph ? "min-h-[86px] px-2.5 py-3" : "flex h-10 items-center px-3",
        error
          ? "border-discord-danger-text bg-[rgb(210_45_57/0.039)]"
          : focused
            ? "border-discord-blurple bg-discord-field shadow-[inset_0_0_0_1px_var(--color-discord-blurple)]"
            : "border-discord-border bg-discord-field",
      )}
    >
      <span className={value ? "text-discord-text" : "text-discord-placeholder"}>
        {value ?? placeholder}
      </span>
    </div>
  );
}

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
}

function Choice({
  mark,
  option,
  strong,
  onPick,
}: {
  mark: ReactNode;
  option: ChoiceOption;
  /** Checkbox labels use the strong text colour, radio labels the normal one. */
  strong?: boolean;
  onPick?: () => void;
}) {
  return (
    <div
      role={onPick ? "button" : undefined}
      tabIndex={onPick ? 0 : undefined}
      onClick={onPick}
      onKeyDown={
        onPick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onPick();
              }
            }
          : undefined
      }
      className={cn("group flex items-start gap-3 rounded-lg", onPick && "cursor-pointer")}
    >
      {mark}
      <div className="min-w-0">
        <p
          className={cn(
            "m-0 text-base leading-5",
            strong ? "text-discord-strong" : "text-discord-text",
          )}
        >
          {option.label}
        </p>
        {option.description ? (
          <p className="m-0 mt-1 text-sm leading-[18px] text-discord-subtle">
            {option.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ease-out",
        checked
          ? "border-discord-hairline bg-discord-blurple"
          : "border-discord-control bg-black/8 group-hover:border-discord-control-hover",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full bg-white transition-[scale,opacity] duration-200 ease-out motion-reduce:transition-none",
          checked ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
      />
    </span>
  );
}

export function DiscordRadioGroup({
  options,
  value,
  clear,
  onChange,
}: {
  options: ChoiceOption[];
  value?: string;
  /** The clear button's label, shown when the group is optional and has a pick. */
  clear?: string;
  onChange?: (value: string | undefined) => void;
}) {
  return (
    <div className="pt-2 pb-1">
      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <Choice
            key={option.value}
            option={option}
            mark={<RadioMark checked={option.value === value} />}
            onPick={onChange ? () => onChange(option.value) : undefined}
          />
        ))}
      </div>
      {clear && value ? (
        <div className="mt-1 flex justify-end">
          <DiscordButton
            onClick={onChange ? () => onChange(undefined) : undefined}
          >
            {clear}
          </DiscordButton>
        </div>
      ) : null}
    </div>
  );
}

export function DiscordCheckboxGroup({
  options,
  values = [],
  max = options.length,
  onChange,
}: {
  options: ChoiceOption[];
  values?: string[];
  max?: number;
  onChange?: (values: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-4 pt-2 pb-1">
      {options.map((option) => {
        const checked = values.includes(option.value);
        const blocked = !checked && values.length >= max;

        return (
          <div key={option.value} className={blocked ? "opacity-50" : undefined}>
            <Choice
              strong
              option={option}
              mark={<CheckboxMark checked={checked} />}
              onPick={
                onChange && !blocked
                  ? () =>
                      onChange(
                        checked
                          ? values.filter((item) => item !== option.value)
                          : [...values, option.value],
                      )
                  : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
}

/// A lone Checkbox, which takes its text from the Label around it and draws no Label itself.
export function DiscordCheckbox({
  checked = false,
  onChange,
  ...option
}: ChoiceOption & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <Choice
      strong
      option={option}
      mark={<CheckboxMark checked={checked} />}
      onPick={onChange ? () => onChange(!checked) : undefined}
    />
  );
}

export function DiscordFileUpload({
  prompt,
  browse,
  limit,
  files = [],
}: {
  /** The drop prompt before the browse link, such as "Drop files here or". */
  prompt: string;
  browse: string;
  limit: string;
  files?: string[];
}) {
  return (
    <div className="rounded-lg border border-discord-border bg-discord-field">
      {files.length ? (
        <div className="m-3 grid grid-cols-2 gap-2">
          {files.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-lg border border-discord-hairline bg-discord-popover p-2"
            >
              <FileIllustration className="h-8 w-6 shrink-0" />
              <span className="line-clamp-2 text-xs font-medium text-discord-strong">
                {name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
          <UploadIcon className="size-5 text-discord-strong" />
          <p className="m-0 text-base leading-5 text-discord-muted">
            {prompt}{" "}
            <span className="cursor-pointer text-discord-link hover:underline">
              {browse}
            </span>
          </p>
          <p className="m-0 text-xs leading-4 text-discord-muted">{limit}</p>
        </div>
      )}
    </div>
  );
}

export interface TextField {
  label: string;
  description?: string;
  value?: string;
  placeholder?: string;
  paragraph?: boolean;
  required?: boolean;
}

/// A modal's labelled text inputs, for the forms the bot opens.
export function DiscordTextFields({ fields }: { fields: TextField[] }) {
  return fields.map(({ label, description, required, ...input }) => (
    <DiscordLabel
      key={label}
      label={label}
      description={description}
      required={required}
    >
      <DiscordTextInput {...input} />
    </DiscordLabel>
  ));
}
