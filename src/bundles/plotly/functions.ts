/**
 * The module `plotly` provides functions for drawing plots using the plotly.js library.
 * @module plotly
 */

import context from "js-slang/context";
import Plotly, {
    SliderStep,
    type Data,
    type Layout,
    UpdateMenuButton,
    PlotData,
} from "plotly.js-dist";
import {
    type Curve,
    CurvePlot,
    type CurvePlotFunction,
    DrawnPlot,
    type ListOfPairs,
} from "./plotly";
import { generatePlot } from "./curve_functions";
import {
    Body,
    BoundingBox,
    G_const,
    QuadTree,
    euclidean_distance,
} from "./n_body_functions";

const drawnPlots: (DrawnPlot | CurvePlot)[] = [];
context.moduleContexts.plotly.state = {
    drawnPlots,
};

/**
 * TODO: figure out a dataset,
 * figure out how to change coordinate systems to fit the lagrange points
 */

/**
 * Adds a new plotly plot to the context which will be rendered in the Plotly Tabs
 * @example
 * ```typescript
 * const z1 = [
 *   [8.83,8.89,8.81,8.87,8.9,8.87],
 *   [8.89,8.94,8.85,8.94,8.96,8.92],
 *   [8.84,8.9,8.82,8.92,8.93,8.91],
 *   [8.79,8.85,8.79,8.9,8.94,8.92],
 *   [8.79,8.88,8.81,8.9,8.95,8.92],
 *   [8.8,8.82,8.78,8.91,8.94,8.92],
 *   [8.75,8.78,8.77,8.91,8.95,8.92],
 *   [8.8,8.8,8.77,8.91,8.95,8.94],
 *   [8.74,8.81,8.76,8.93,8.98,8.99],
 *   [8.89,8.99,8.92,9.1,9.13,9.11],
 *   [8.97,8.97,8.91,9.09,9.11,9.11],
 *   [9.04,9.08,9.05,9.25,9.28,9.27],
 *   [9,9.01,9,9.2,9.23,9.2],
 *   [8.99,8.99,8.98,9.18,9.2,9.19],
 *   [8.93,8.97,8.97,9.18,9.2,9.18]
 *  ];
 *  new_plot(list(pair("z", z1), pair("type", "surface"))) // creates a surface plot in Plotly Tab
 * ```
 *
 *
 * @Types
 * ``` typescript
 * // The data format for input [{field_name}, value] from among the following fields
 *  data = {
 *    type: PlotType;
 *    x: Datum[] | Datum[][];
 *    y: Datum[] | Datum[][];
 *    z: Datum[] | Datum[][] | Datum[][][];
 *    mode:
 *       | 'lines'
 *       | 'markers'
 *       | 'text'
 *       | 'lines+markers'
 *       | 'text+markers'
 *       | 'text+lines'
 *       | 'text+lines+markers'
 *  }
 *
 *
 *  type Datum = string | number | Date | null;
 *  type PlotType =
 *  | 'bar'
 *  | 'barpolar'
 *  | 'box'
 *  | 'candlestick'
 *  | 'carpet'
 *  | 'choropleth'
 *  | 'choroplethmapbox'
 *  | 'cone'
 *  | 'contour'
 *  | 'contourcarpet'
 *  | 'densitymapbox'
 *  | 'funnel'
 *  | 'funnelarea'
 *  | 'heatmap'
 *  | 'heatmapgl'
 *  | 'histogram'
 *  | 'histogram2d'
 *  | 'histogram2dcontour'
 *  | 'image'
 *  | 'indicator'
 *  | 'isosurface'
 *  | 'mesh3d'
 *  | 'ohlc'
 *  | 'parcats'
 *  | 'parcoords'
 *  | 'pie'
 *  | 'pointcloud'
 *  | 'sankey'
 *  | 'scatter'
 *  | 'scatter3d'
 *  | 'scattercarpet'
 *  | 'scattergeo'
 *  | 'scattergl'
 *  | 'scattermapbox'
 *  | 'scatterpolar'
 *  | 'scatterpolargl'
 *  | 'scatterternary'
 *  | 'splom'
 *  | 'streamtube'
 *  | 'sunburst'
 *  | 'surface'
 *  | 'table'
 *  | 'treemap'
 *  | 'violin'
 *  | 'volume'
 *  | 'waterfall';
 *
 * ```
 * @param data The data in the form of list of pair, with the first term in the pair is
 *             the name of the field as a string and the second term is the value of the field
 *             among the fields mentioned above
 */
export function new_plot(data: ListOfPairs): void {
    drawnPlots.push(new DrawnPlot(draw_new_plot, data));
}

/**
 * Adds a new plotly plot to the context which will be rendered in the Plotly Tabs
 * @example
 * ```typescript
 *
 * const z1 = [
 *   [8.83,8.89,8.81,8.87,8.9,8.87],
 *   [8.89,8.94,8.85,8.94,8.96,8.92],
 *   [8.84,8.9,8.82,8.92,8.93,8.91],
 *   [8.79,8.85,8.79,8.9,8.94,8.92],
 *   [8.79,8.88,8.81,8.9,8.95,8.92],
 *   [8.8,8.82,8.78,8.91,8.94,8.92],
 *   [8.75,8.78,8.77,8.91,8.95,8.92],
 *   [8.8,8.8,8.77,8.91,8.95,8.94],
 *   [8.74,8.81,8.76,8.93,8.98,8.99],
 *   [8.89,8.99,8.92,9.1,9.13,9.11],
 *   [8.97,8.97,8.91,9.09,9.11,9.11],
 *   [9.04,9.08,9.05,9.25,9.28,9.27],
 *   [9,9.01,9,9.2,9.23,9.2],
 *   [8.99,8.99,8.98,9.18,9.2,9.19],
 *   [8.93,8.97,8.97,9.18,9.2,9.18]
 *  ];
 *
 * let z2 = [];
 * for (var i=0;i<z1.length;i++ ) {
 *   let z2_row = [];
 *     for(var j=0;j<z1[i].length;j++) {
 *       z2_row.push(z1[i][j]+1);
 *     }
 *     z2.push(z2_row);
 * }
 * const data = [{z: z1, type: 'surface'}, {z: z2 , type: 'surface'}];
 * new_plot_json(data) // creates a surface plot in Plotly Tab
 *
 *
 *
 * ```
 *
 *
 * @Types
 * ``` typescript
 * // The data format for input [{field_name}, value] from among the following fields
 *  data = {
 *    type: PlotType;
 *    x: Datum[] | Datum[][];
 *    y: Datum[] | Datum[][];
 *    z: Datum[] | Datum[][] | Datum[][][];
 *    mode:
 *       | 'lines'
 *       | 'markers'
 *       | 'text'
 *       | 'lines+markers'
 *       | 'text+markers'
 *       | 'text+lines'
 *       | 'text+lines+markers'
 *  }[]
 *
 *
 *  type Datum = string | number | Date | null;
 *  type PlotType =
 *  | 'bar'
 *  | 'barpolar'
 *  | 'box'
 *  | 'candlestick'
 *  | 'carpet'
 *  | 'choropleth'
 *  | 'choroplethmapbox'
 *  | 'cone'
 *  | 'contour'
 *  | 'contourcarpet'
 *  | 'densitymapbox'
 *  | 'funnel'
 *  | 'funnelarea'
 *  | 'heatmap'
 *  | 'heatmapgl'
 *  | 'histogram'
 *  | 'histogram2d'
 *  | 'histogram2dcontour'
 *  | 'image'
 *  | 'indicator'
 *  | 'isosurface'
 *  | 'mesh3d'
 *  | 'ohlc'
 *  | 'parcats'
 *  | 'parcoords'
 *  | 'pie'
 *  | 'pointcloud'
 *  | 'sankey'
 *  | 'scatter'
 *  | 'scatter3d'
 *  | 'scattercarpet'
 *  | 'scattergeo'
 *  | 'scattergl'
 *  | 'scattermapbox'
 *  | 'scatterpolar'
 *  | 'scatterpolargl'
 *  | 'scatterternary'
 *  | 'splom'
 *  | 'streamtube'
 *  | 'sunburst'
 *  | 'surface'
 *  | 'table'
 *  | 'treemap'
 *  | 'violin'
 *  | 'volume'
 *  | 'waterfall';
 *
 * ```
 * @param data The data as an array of json objects having some or all of the given fields
 */
export function new_plot_json(data: any): void {
    drawnPlots.push(new DrawnPlot(draw_new_plot_json, data));
}

/**
 * @param data The data which plotly will use
 * @param divId The id of the div element on which the plot will be displayed
 */
function draw_new_plot(data: ListOfPairs, divId: string) {
    const plotlyData = convert_to_plotly_data(data);
    Plotly.newPlot(divId, [plotlyData]);
}

/**
 *
 * @param data The data object in json to be used by plotly
 * @param divId The id of the div element on which the plot will be displayed
 */
function draw_new_plot_json(data: any, divId: string) {
    Plotly.newPlot(divId, data);
}

/**
 * @param data The list of pairs given by the user
 * @returns The converted data that can be used by the plotly.js function
 */
function convert_to_plotly_data(data: ListOfPairs): Data {
    let convertedData: Data = {};
    if (Array.isArray(data) && data.length === 2) {
        add_fields_to_data(convertedData, data);
    }
    return convertedData;
}

/**
 * @param convertedData Stores the Javascript object which is used by plotly.js
 * @param data The list of pairs data used by source
 */

function add_fields_to_data(convertedData: Data, data: ListOfPairs) {
    if (Array.isArray(data) && data.length === 2 && data[0].length === 2) {
        const field = data[0][0];
        const value = data[0][1];
        convertedData[field] = value;
        add_fields_to_data(convertedData, data[1]);
    }
}

function createPlotFunction(
    type: string,
    config: Data,
    layout: Partial<Layout>,
    is_colored: boolean = false
): (numPoints: number) => CurvePlotFunction {
    return (numPoints: number) => {
        const func = (curveFunction: Curve) => {
            const plotDrawn = generatePlot(
                type,
                numPoints,
                config,
                layout,
                is_colored,
                curveFunction
            );

            drawnPlots.push(plotDrawn);
            return plotDrawn;
        };

        return func;
    };
}

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points and connecting each pair with a line.
 * The parts between (0,0) and (1,1) of the resulting Drawing are shown in the window.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_connected(100)(t => make_point(t, t));
 * ```
 */
export const draw_connected_2d = createPlotFunction(
    "scatter",
    { mode: "lines" },
    {
        xaxis: { visible: false },
        yaxis: {
            visible: false,
            scaleanchor: "x",
        },
    }
);

export const draw_3D_points = createPlotFunction(
    "scatter3d",
    { mode: "markers" },
    {},
    true
);

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

export const create_random_bodies = (): Body[] => {
    // const G = G_const;
    // let b1 = new Body("m1", [0, 0], 1e20, [0, 0], [0, 0]);
    // let b2 = new Body(
    //     "m2",
    //     [0, -1e5],
    //     1e16,
    //     [Math.sqrt((G * 1e20) / 1e5), 0],
    //     [0, 0]
    // );
    // return [b1, b2];
    let body: Body[] = [];
    for (var i = 0; i < 1000; i++) {
        body.push(
            new Body(
                i.toString(),
                [getRandomInt(1e2), getRandomInt(1e2)],
                getRandomInt(1),
                [0, 0],
                [0, 0]
            )
        );
    }
    return body;
};

export const figure_eight_system = () => {
    // for G = 1;
    let b1 = new Body(
        "m1",
        [-0.97000436, 0.24308753],
        1,
        [0.466203685, 0.43236573],
        [0, 0]
    );
    let b2 = new Body(
        "m2",
        [0.97000436, -0.24308753],
        1,
        [0.466203685, 0.43236573],
        [0, 0]
    );
    let b3 = new Body(
        "m3",
        [0, 0],
        1,
        [-2 * 0.466203685, -2 * 0.43236573],
        [0, 0]
    );
    return [b1, b2, b3];
};

export const solar_system_bodies = () => {
    let sun: Body = new Body("sun", [0, 0], 2e30, [0, 0], [0, 0]);
    let mercury: Body = new Body(
        "mercury",
        [0, 5.7e10],
        2e30,
        [47000, 0],
        [0, 0]
    );
    let venus: Body = new Body(
        "venus",
        [0, 1.1e11],
        4.8e24,
        [35000, 0],
        [0, 0]
    );
    let earth: Body = new Body("earth", [0, 1.5e11], 6e24, [30000, 0], [0, 0]);
    let mars: Body = new Body(
        "mercury",
        [0, 2.2e11],
        2.4e24,
        [24000, 0],
        [0, 0]
    );
    // let mars = {"location":point(0,2.2e11,0), "mass":2.4e24, "velocity":point(24000,0,0)}
    // let jupiter = {"location":point(0,7.7e11,0), "mass":1e28, "velocity":point(13000,0,0)}
    // let saturn = {"location":point(0,1.4e12,0), "mass":5.7e26, "velocity":point(9000,0,0)}
    // let uranus = {"location":point(0,2.8e12,0), "mass":8.7e25, "velocity":point(6835,0,0)}
    // let neptune = {"location":point(0,4.5e12,0), "mass":1e26, "velocity":point(5477,0,0)}
    // let pluto = {"location":point(0,3.7e12,0), "mass":1.3e22, "velocity":point(4748,0,0)}
    return [sun, mercury, venus, earth, mars];
    return [sun, earth];
};

// const bodies = create_random_bodies();
// const bodies = solar_system_bodies();
const bodies = figure_eight_system();

let animationId: number | null = null;

export const simulate_points = (is_lagrange: boolean) => {
    const x_s = bodies.map((body) => body.pos[0]);
    const y_s = bodies.map((body) => body.pos[1]);
    const mass_s = bodies.map((body) => body.mass);
    const data = { x: x_s, y: y_s };

    drawnPlots.push(
        new CurvePlot(
            draw_new_simulation(is_lagrange),
            {
                ...data,
                mode: "markers",
                marker: {
                    color: "rgba(17, 157, 255,0.5)",
                },
            },
            {
                yaxis: {
                    visible: false,
                    scaleanchor: "x",
                },
            }
        )
    );
};

const draw_new_simulation =
    (is_lagrange: boolean) =>
    (divId: string, data: PlotData, layout: Partial<Layout>) => {
        const line_data_x: (number | null)[] = [];
        const line_data_y: (number | null)[] = [];
        for (let i = 0; i < data.x.length; ++i) {
            line_data_x.push(data.x[i] as number);
            line_data_x.push(data.x[i] as number);
            line_data_y.push(data.y[i] as number);
            line_data_y.push(data.y[i] as number);
            line_data_x.push(null);
            line_data_y.push(null);
        }
        var steps: Partial<SliderStep>[] = [];
        for (var i = 0.01; i <= 10000; i *= 10)
            steps.push({
                label: i.toString(),
                method: "skip",
            });
        layout = {
            ...layout,
            sliders: [{ steps, active: 0 }],
        };
        Plotly.react(
            divId,
            [data, { x: line_data_x, y: line_data_y, mode: "lines" }],
            layout
        );
        // logic for quad
        const qt = new QuadTree(1e2);
        const framesPerSecond = 60;
        if (animationId != null) return;
        function update() {
            const dt =
                0.01 *
                Math.pow(
                    10,
                    parseInt(
                        // @ts-ignore
                        document.getElementById(divId)?.layout?.sliders[0]
                            .active
                    )
                );
            // const dt = 0.01;
            qt.build_tree(bodies);
            let prev_x = qt.bodies.map((body) => body.pos[0]);
            let prev_y = qt.bodies.map((body) => body.pos[1]);
            qt.simulateForces();
            qt.bodies.forEach((body, i) => {
                body.updateBodyState(dt / framesPerSecond);
            });

            let new_x = qt.bodies.map((body) => body.pos[0]);
            let new_y = qt.bodies.map((body) => body.pos[1]);

            // add logic for transformation
            const change_frame = (x_s: number[], y_s: number[]) => {
                const x_t = Array(x_s.length);
                const y_t = Array(y_s.length);
                x_t[0] = y_t[0] = 0;
                y_t[1] = 0;
                x_t[1] = euclidean_distance([x_s[0], y_s[0]], [x_s[1], y_s[1]]);
                const theta_1 = Math.atan2(y_s[1] - y_s[0], x_s[1] - x_s[0]);
                const theta_2 = Math.atan2(y_s[2] - y_s[0], x_s[2] - x_s[0]);
                const d = euclidean_distance(
                    [x_s[0], y_s[0]],
                    [x_s[2], y_s[2]]
                );

                x_t[2] = d * Math.cos(theta_2 - theta_1);
                y_t[2] = d * Math.sin(theta_2 - theta_1);

                return { x_s: x_t, y_s: y_t };
            };

            if (is_lagrange) {
                ({ x_s: new_x, y_s: new_y } = change_frame(new_x, new_y));
                ({ x_s: prev_x, y_s: prev_y } = change_frame(prev_x, prev_y));
            }

            const bounding_boxes: BoundingBox[] = qt.getBoundingBoxes();
            const shapes = bounding_boxes.map((box) => {
                return {
                    type: "rect" as const,
                    x0: box.bottomLeft[0],
                    y0: box.bottomLeft[1],
                    x1: box.topRight[0],
                    y1: box.topRight[1],
                    line: {
                        width: 0.1,
                        color: "rgba(128,0,128,1)",
                    },
                };
            });

            if (line_data_x.length > 50 * 3 * bodies.length) {
                for (let i = 0; i < bodies.length; ++i) {
                    for (let j = 0; j < 3; ++j) {
                        line_data_x.shift();
                        line_data_y.shift();
                    }
                }
            }

            for (let i = 0; i < new_x.length; ++i) {
                line_data_x.push(prev_x[i]);
                line_data_x.push(new_x[i]);
                line_data_y.push(prev_y[i]);
                line_data_y.push(new_y[i]);
                line_data_x.push(null);
                line_data_y.push(null);
            }
            //@ts-ignore
            Plotly.animate(
                divId,
                {
                    data: [
                        { x: new_x, y: new_y },
                        { x: line_data_x, y: line_data_y, mode: "lines" },
                    ],
                    traces: [0, 1],
                },
                {
                    transition: {
                        duration: 0,
                    },
                    frame: {
                        duration: 0,
                        redraw: false,
                    },
                }
            );
            // Plotly.relayout(divId, { shapes: shapes });
            animationId = requestAnimationFrame(update);
        }
        update();
    };
