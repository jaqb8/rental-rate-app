"use client";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type LatLngTuple } from "leaflet";
import { env } from "@/env";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import { useSize } from "@/hooks";
import { type Landlord } from "@prisma/client";
import { useSelectedQuery, useSelectedLandlord } from "@/stores";
import { api } from "@/trpc/react";
import Loading from "../loading";
import { cn } from "@/lib/utils";

const getMarkerIcon = ({ temp } = { temp: false }) =>
  L.icon({
    iconUrl: `./marker${temp ? "1" : "2"}.svg`,
    iconSize: [28, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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

export interface MapProps {
  sidebarOpen?: boolean;
}

function Map({ sidebarOpen }: MapProps) {
  const [key, setKey] = useState(uuidv4());
  const containerRef = useRef(null);
  const [selectedBoundingBox, setSelectedBoundingBox] = useState<
    [number, number, number, number]
  >([49.0020468, 55.03605, 14.0696389, 24.145783]); // Poland
  const [markers, setMarkers] = useState<
    {
      id: string;
      position: LatLngTuple;
      eventHandlers?: L.LeafletEventHandlerFnMap;
      temp: boolean;
      icon: L.Icon<L.IconOptions> | L.DivIcon | undefined;
    }[]
  >([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: landlords, isLoading: isLandlordsLoading } =
    api.landlord.getAll.useQuery();
  const { selectedQuery, setSelectedQuery } = useSelectedQuery();
  const { setSelectedLandlord, selectedLandlord } = useSelectedLandlord();

  const focusLandlord = useCallback(
    (landlord: Landlord) => {
      router.push(`/?landlordId=${landlord.id}`);
      setSelectedBoundingBox([
        parseFloat(landlord.lat),
        parseFloat(landlord.lat),
        parseFloat(landlord.lng),
        parseFloat(landlord.lng),
      ]);
      setSelectedLandlord(landlord);
      setSelectedQuery(null);
    },
    [router, setSelectedLandlord, setSelectedQuery],
  );

  useEffect(() => {
    if (!landlords) {
      return;
    }
    const positions = landlords.map((landlord) => ({
      id: landlord.id,
      position: [
        parseFloat(landlord.lat),
        parseFloat(landlord.lng),
      ] as LatLngTuple,
      eventHandlers: {
        click: () => focusLandlord(landlord),
      },
      temp: false,
      icon: getMarkerIcon(),
    }));
    setMarkers(positions);
  }, [landlords, focusLandlord]);

  useEffect(() => {
    setKey(uuidv4());
  }, [sidebarOpen]);

  useEffect(() => {
    if (landlords && searchParams.get("landlordId")) {
      const landlordId = searchParams.get("landlordId");
      const landlord = landlords.find((landlord) => landlord.id === landlordId);
      if (landlord) {
        setSelectedLandlord(landlord);
        setSelectedBoundingBox([
          parseFloat(landlord.lat),
          parseFloat(landlord.lat),
          parseFloat(landlord.lng),
          parseFloat(landlord.lng),
        ]);
      }
    }
  }, [searchParams, landlords, setSelectedLandlord]);

  useEffect(() => {
    setMarkers((m) => m.filter((marker) => !marker.temp));
    if (selectedQuery?.boundingbox) {
      setSelectedBoundingBox(selectedQuery.boundingbox);
      setMarkers((m) => [
        ...m,
        {
          id: selectedQuery.place_id.toString(),
          position: [
            parseFloat(selectedQuery.lat),
            parseFloat(selectedQuery.lon),
          ] as LatLngTuple,
          temp: true,
          icon: getMarkerIcon({ temp: true }),
        },
      ]);
    } else if (!selectedQuery && !selectedLandlord) {
      setSelectedBoundingBox([49.0020468, 55.03605, 14.0696389, 24.145783]); // Poland
    }
  }, [selectedQuery, selectedLandlord]);

  if (isLandlordsLoading) {
    return (
      <div className="h-[100vh] w-[100vw] bg-card-foreground">
        <Loading />
      </div>
    );
  }

  return (
    <div className={cn("z-1 h-[100vh] w-[100vw]")} ref={containerRef}>
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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={marker.eventHandlers}
            icon={marker.icon}
          ></Marker>
        ))}
        <BoundingBoxZoom boundingBox={selectedBoundingBox} />
      </MapContainer>
    </div>
  );
}

export default Map;
