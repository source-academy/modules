import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import { type Curve, CurvePlot, type Point } from './plotly';
import { x_of, y_of, z_of } from './curve_functions';
import context from 'js-slang/context';


const drawnPlots: (CurvePlot)[] = [];
context.moduleContexts.plotly.state = {
  drawnPlots,
};


/**
 * 
 * @param frames number of frames used in the animation.
 * The initialState defines the current frames to be rendered for the given curves
 * and the next_frame_logic defines how to generate the next frames in the animation
 * @returns function of type Curve[] -> (initialState: number[]) -> (next_frame_logic: (state:number[])->any)
 * @example
 * ```
 * 
 * ```
 */

export const generate_art = (frames: number) => (curves: Curve[])  => {
    return (initialState: any[]) => {
        const generate_next_frame =  (next_frame_logic: (state:any[]) => any[]) => {
            let points: Point[][] = []
            for(let i = 0;i < initialState.length;++i) {
                points.push([]);
                for(let j = 0; j < initialState[i].length; ++j) {
                const point: Point = curves[i](initialState[i][j]/frames)
                points[i].push(point);
                }
            }
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
                draw_new_art(frames, initialState, curves, next_frame_logic),
                {
                    ...plotlyData
                },
                {}
            )
            drawnPlots.push(plotDrawn);
        } 
        return generate_next_frame;
    }
}

let intervalId;
let intervalIds = {}

// TODO: will try to stop animation if required
//
// Work on your Final Report with prof, figure out what content is required, figure
// out the outline
//
// Make the curves plotly better lol

/**
 * 
 * @param frames 
 * @param initialState 
 * @param curves 
 * @param next_frame_logic 
 * @returns 
 */

const draw_new_art = (frames:number, initialState :any[], curves: Curve[], next_frame_logic:(state:any[])=>any[]) => (divId: string, data: Data, layout: Partial<Layout>) => {
    Plotly.react(divId, [data], layout);
    clearInterval(intervalIds[divId])
    let curState = initialState
    const draw_and_upate_frames = ():void => {
        let points: Point[][] = []
        for(let i = 0;i < curState.length;++i) {
            points.push([]);
            for(let j = 0; j < curState[i].length; ++j) {
            const point: Point = curves[i](curState[i][j]/frames)
            points[i].push(point);
            }
        }
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
        curState = next_frame_logic(curState);
        //@ts-ignore
        Plotly.animate(divId, 
            {data: [plotlyData]},{
            transition: {
              duration: 0,
            },
              frame: {
                  duration: 0
              }
          })
    }
    draw_and_upate_frames()
    intervalId = setInterval(draw_and_upate_frames, 100);
    intervalIds[divId] = intervalId
}