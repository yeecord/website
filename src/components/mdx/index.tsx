import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { ComponentProps, FC, ImgHTMLAttributes } from "react";
import Adsense from "@/components/mdx/Adsense";
import {
  DiscordButton,
  DiscordChat,
  DiscordEmbed,
  DiscordMessage,
  SlashCommand,
} from "@/components/mdx/discord";
import {
  ChannelPermissionDemo,
  RoleOrderDemo,
} from "@/components/mdx/discord-demo";
import {
  AutoChannelsDemo,
  GiveawayFlowDemo,
  LockChannelDemo,
  PollFlowDemo,
  RoleMenuDemo,
} from "@/components/mdx/feature-flows";
import { FormBuilderDemo, FormFlowDemo } from "@/components/mdx/form-flow";
import { LinkButton } from "@/components/mdx/LinkButton";
import type { MdxLocale } from "@/components/mdx/locale";
import { SlashCommandTour } from "@/components/mdx/slash-tour";

export * from "./Adsense";
export * from "./discord";
export * from "./LinkButton";

export const mdxComponents = {
  ...defaultMdxComponents,
  Adsense,
  AutoChannelsDemo,
  ChannelPermissionDemo,
  DiscordButton,
  DiscordChat,
  DiscordEmbed,
  DiscordMessage,
  FormBuilderDemo,
  FormFlowDemo,
  GiveawayFlowDemo,
  LockChannelDemo,
  PollFlowDemo,
  RoleMenuDemo,
  LinkButton,
  img: ImageZoom as FC<ImgHTMLAttributes<HTMLImageElement>>,
  RoleOrderDemo,
  SlashCommand,
  SlashCommandTour,
};

// the demos carry their own copy, so bind the page locale where they are rendered
export function localeMdxComponents(locale: MdxLocale) {
  return {
    AutoChannelsDemo: () => <AutoChannelsDemo locale={locale} />,
    ChannelPermissionDemo: (
      props: ComponentProps<typeof ChannelPermissionDemo>,
    ) => <ChannelPermissionDemo locale={locale} {...props} />,
    FormBuilderDemo: () => <FormBuilderDemo locale={locale} />,
    FormFlowDemo: () => <FormFlowDemo locale={locale} />,
    GiveawayFlowDemo: () => <GiveawayFlowDemo locale={locale} />,
    LockChannelDemo: () => <LockChannelDemo locale={locale} />,
    PollFlowDemo: () => <PollFlowDemo locale={locale} />,
    RoleMenuDemo: () => <RoleMenuDemo locale={locale} />,
    RoleOrderDemo: () => <RoleOrderDemo locale={locale} />,
    SlashCommandTour: () => <SlashCommandTour locale={locale} />,
  };
}
