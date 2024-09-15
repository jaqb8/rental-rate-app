import dynamic from "next/dynamic";
import { type MapProps } from "./Map";

export const Map = dynamic<MapProps>(() => import("./Map"), {
  ssr: false,
});

export default Map;