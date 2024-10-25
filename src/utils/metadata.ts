import { docs } from "@/app/source";
import { createMetadataImage } from "fumadocs-core/server";

export const metadataImage = createMetadataImage({
  imageRoute: "/og",
  source: docs,
});
