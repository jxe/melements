import { Crosshair1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { styled } from "../stitches.config";

const Accessory = styled("div", {
  display: "flex",
  gap: "4px",
  alignItems: "center",
  color: "$gray11",
  padding: "8px",
  fontSize: "$2",
  fontWeight: "500",
})

export function GeolocationAccessory({ onCoordsChange }: { onCoordsChange: (coords?: GeolocationCoordinates) => void }) {
  const [state, setState] = useState<GeolocationCoordinates>()
  const [watchId, setWatchId] = useState<number>()
  let mounted = true;
  const onEvent = ({ coords }: { coords: GeolocationCoordinates }) => {
    if (mounted) {
      setState(coords)
      if (onCoordsChange) onCoordsChange(coords)
    }
  };

  useEffect(
    () => {
      navigator.geolocation.getCurrentPosition(onEvent);
      setWatchId(navigator.geolocation.watchPosition(onEvent));

      return () => {
        mounted = false;
        watchId && navigator.geolocation.clearWatch(watchId);
      };
    }, []
  );

  return (
    <Accessory>
      <Crosshair1Icon />
      {state && `Sharing location, accurate to ${state.accuracy}m`}
    </Accessory>
  );
}