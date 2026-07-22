import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { FC, ImgHTMLAttributes } from "react";
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
};
