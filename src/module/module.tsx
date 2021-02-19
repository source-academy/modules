import dayjs from "dayjs";

import SideContent, { toSpawn as toSpawnFunction } from "./SideContent";

type __Params = {};

export default function (__params: __Params) {
  return {
    functions: {
      get_time: () => dayjs(),
      get_params: () => __params,
    },
    sideContents: [
      {
        toSpawn: toSpawnFunction,
        body: SideContent,
        label: "Test Component",
        iconName: "mugshot",
      },
    ],
  };
}
