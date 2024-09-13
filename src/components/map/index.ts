import dynamic from "next/dynamic";
import { type AddressSuggestion } from "../autosuggest-input/AutosuggestInput";

export const Map = dynamic<{ sidebarOpen?: boolean; selectedQuery?: AddressSuggestion | null, width?: string, height?: string }>(() => import("./Map"), {
  ssr: false,
});

export default Map;