"use client";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { env } from "@/env";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import { useSize } from "@/hooks";
import { type Landlord } from "@prisma/client";
import { api } from "@/trpc/react";
import { useSelectedQuery, useSelectedLandlord } from "@/stores";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "./marker.png",
  iconSize: [28, 45],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  // shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  // shadowSize: [41, 41],
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: landlords, isLoading } = api.landlord.getAll.useQuery();
  const { selectedQuery, setSelectedQuery } = useSelectedQuery();
  const { setSelectedLandlord, selectedLandlord } = useSelectedLandlord();
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
    if (selectedQuery?.boundingbox) {
      setSelectedBoundingBox(selectedQuery.boundingbox);
    } else if (!selectedQuery && !selectedLandlord) {
      setSelectedBoundingBox([49.0020468, 55.03605, 14.0696389, 24.145783]); // Poland
    }
  }, [selectedQuery, selectedLandlord]);

  return (
    <div className="z-1 h-[100vh] w-[100vw]" ref={containerRef}>
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
        {landlords?.map((landlord) => (
          <Marker
            key={landlord.id}
            position={[parseFloat(landlord.lat), parseFloat(landlord.lng)]}
            eventHandlers={{
              click: () => {
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
            }}
          >
            {/* <Popup>
              <div className="flex flex-col gap-1 mb-2">
                <span className="font-bold">
                  {landlord.street} {landlord.streetNumber}
                  {landlord.flatNumber ? ` / ${landlord.flatNumber}` : ""}
                </span>
                <span>
                  {landlord.city}, {landlord.zip}
                </span>
              </div>
              <Link href={`/landlord/${landlord.id}`}>Show details</Link>
            </Popup> */}
          </Marker>
        ))}
        <BoundingBoxZoom boundingBox={selectedBoundingBox} />
      </MapContainer>
    </div>
  );
}

export default Map;
