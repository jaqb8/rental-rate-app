"use client";
import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { env } from "@/env";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSize } from "@/app/hooks";
import { type AddressSuggestion } from "../autosuggest-input/AutosuggestInput";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface MapProps {
  sidebarOpen: boolean;
  selectedQuery: AddressSuggestion | null;
}

const ResizeMap = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const map = useMap();
  const { width, height } = useSize(containerRef);

  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [height, width, map]);

  return null;
};

const BoundingBoxZoom = ({
  boundingBox,
}: {
  boundingBox: [number, number, number, number];
}) => {
  const map = useMap();
  useEffect(() => {
    if (map && boundingBox) {
      const [south, west, north, east] = boundingBox;
      map.fitBounds([
        [south, north],
        [west, east],
      ]);
    }
  }, [boundingBox, map]);
  return null;
};

function Map({ sidebarOpen, selectedQuery }: MapProps) {
  const [key, setKey] = useState(uuidv4());
  const containerRef = useRef(null);

  useEffect(() => {
    setKey(uuidv4());
  }, [sidebarOpen]);

  return (
    <div className="z-1 h-[100%] w-[100%]" ref={containerRef}>
      <MapContainer
        key={key}
        center={[40.609787846393196, 20.7890265133657]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <ResizeMap containerRef={containerRef} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${env.NEXT_PUBLIC_JAWG_ACCESS_TOKEN}`}
        />
        <Marker position={[40.609787846393196, 20.7890265133657]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {selectedQuery?.boundingbox && (
          <BoundingBoxZoom boundingBox={selectedQuery.boundingbox} />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
