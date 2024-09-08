"use client";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { env } from "@/env";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface MapProps {
  sidebarOpen: boolean;
}

function Map({ sidebarOpen }: MapProps) {
  const [key, setKey] = useState(uuidv4());

  useEffect(() => {
    setKey(uuidv4());
  }, [sidebarOpen]);

  return (
    <div className="z-1 h-full w-full bg-cover">
      {/*leaflet and react-leaflet*/}
      <div>
        <MapContainer key={key} center={[40.609787846393196, 20.7890265133657]} zoom={5}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={`https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${env.NEXT_PUBLIC_JAWG_ACCESS_TOKEN}`}
          />

          <CircleMarker
            className="n h-[150px] w-[150px]"
            center={[40.609787846393196, 20.7890265133657]}
            radius={10}
            color="transparent"
            fillColor="green"
            fillOpacity={0.5}
          >
            <Popup className="h-[150px] w-[460px]">
              <p className="text-[25px]">My Location </p>
            </Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
