import bbox from "@turf/bbox";
import { VisAxis, VisGroupedBar, VisLine, VisXYContainer } from "@unovis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, LngLatBounds, MapRef, Source } from "react-map-gl";
import Map from "./components/map";
import getTrajectory from "./lib/trajectory";
import { getFileContent } from "./lib/trajectory/getFile";

function App() {
  const [trajectory, setTrajectory] = useState<GeoJSON.LineString>();
  const mapRef = useRef<MapRef>(null);

  type DataRecord = { x: number; y: number };
  const [data, setData] = useState<DataRecord[]>([]);

  useEffect(() => {
    if (!trajectory) return;

    const deltas = getFileContent(trajectory).timestamps;

    setData(
      deltas.map((d, i) => ({
        x: i,
        y: d,
      }))
    );
  }, [trajectory]);

  const minutes = Math.round(data.reduce((acc, cur) => acc + cur.y, 0));

  async function handleClick() {
    const traj = await getTrajectory();
    setTrajectory(traj);

    // @ts-ignore
    mapRef.current?.fitBounds(bbox(traj), {
      padding: 20,
    });
  }

  return (
    <div className="flex flex-col  h-full p-4 bg-stone-50 gap-4">
      <div className="flex-1 flex gap-4">
        <aside className="h-full rounded-lg shadow p-4 bg-white flex flex-col gap-4">
          <button className="btn" onClick={handleClick}>
            Go
          </button>
          <button className="btn disabled">
            {trajectory && (
              <a
                // className="btn disabled"
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(getFileContent(trajectory))
                )}`}
                download="sample-trajectory.json"
              ></a>
            )}
            Download Json
          </button>
        </aside>
        <main className="h-full flex-1 rounded-lg shadow overflow-hidden">
          <Map ref={mapRef}>
            {trajectory && (
              <Source type="geojson" data={trajectory}>
                <Layer
                  type="line"
                  paint={{
                    "line-color": "red",
                    "line-width": 2,
                  }}
                />
              </Source>
            )}
          </Map>
        </main>
      </div>
      <div className="w-full rounded-lg shadow p-4 bg-white h-80">
        <p>
          {minutes} Sekunden == {Math.round(minutes / 60)} Minuten =={" "}
          {Math.round(minutes / 60 / 60)} Stunden =={" "}
          {Math.round(minutes / 60 / 60 / 24)} Tage
        </p>
        <VisXYContainer data={data}>
          <VisGroupedBar
            x={(d: DataRecord) => d.x}
            y={(d: DataRecord) => d.y}
          />
          <VisAxis type="x" label="Index" />
          <VisAxis type="y" label="Minutes" />
        </VisXYContainer>
      </div>
    </div>
  );
}

export default App;
