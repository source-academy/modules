import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import { type Curve, CurvePlot, type Point } from './plotly';
import { x_of, y_of, z_of } from './curve_functions';
import context from 'js-slang/context';

console.log(context, "inside gen art")

const drawnPlots: (CurvePlot)[] = [];
context.moduleContexts.plotly.state = {
  drawnPlots,
};

console.log(drawnPlots, "inside gen art")

export const generate_art = (frames: number) => (curves: Curve[])  => {
    return (initialState: any[]) => {
        let curState = initialState
        console.log(initialState, 'this is the initial state');
        const generate_next_frame =  (next_frame_logic: (state:any[]) => any[]) => {
            const draw_and_upate_frames = ():void => {
                console.log(curState, "this is the cur state");
                let points: Point[][] = []
                for(let i = 0;i < curState.length;++i) {
                    points.push([]);
                    for(let j = 0; j < curState[i].length; ++j) {
                       const point: Point = curves[i](curState[i][j]/frames)
                       points[i].push(point);
                    }
                }
                console.log(points, "these are the points")
                let xs: any[] = []
                let ys: any[] = []
                let zs: any[] = []
                for(let i = 0; i < points[0].length; ++i) {
                    for(let j = 0; j < points.length; ++j) {
                        xs.push(x_of(points[j][i]));
                        ys.push(y_of(points[j][i]));
                        zs.push(z_of(points[j][i]));

                    }
                    xs.push(null);
                    ys.push(null);
                    zs.push(null);
                }
                const plotlyData: Data = {
                    x: xs,
                    y: ys,
                    z: zs,
                }
                const plotDrawn = new CurvePlot(
                    draw_new_art,
                    {
                        ...plotlyData
                    },
                    {}
                )
                console.log(plotDrawn, "this is the plotdranw")
                drawnPlots.push(plotDrawn);
                console.log(drawnPlots, "this is all he plots")

                curState = next_frame_logic(curState);
            }
            draw_and_upate_frames()
            const intervalId = setInterval(draw_and_upate_frames, 2000);
        }
        return generate_next_frame;
    }
}

function draw_new_art(divId: string, data: Data, layout: Partial<Layout>) {
  Plotly.newPlot(divId, [data], layout);
}