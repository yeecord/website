import { createMetadataImage } from "fumadocs-core/server";
import { docs } from "@/app/source";

export const metadataImage = createMetadataImage({
  imageRoute: "/og",
  source: docs,
});
