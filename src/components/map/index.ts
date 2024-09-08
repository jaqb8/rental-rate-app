import dynamic from "next/dynamic";

export const Map = dynamic<{ sidebarOpen: boolean }>(() => import("./Map"), {
  ssr: false,
});

export default Map;