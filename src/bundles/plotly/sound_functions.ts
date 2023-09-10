import context from 'js-slang/context';
import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import { get_duration, get_wave, is_sound } from '../sound';
import { type Sound } from '../sound/types';
import { CurvePlot, type DrawnPlot } from './plotly';

const FS: number = 44100; // Output sample rate

const drawnPlots: (DrawnPlot | CurvePlot)[] = [];
context.moduleContexts.plotly.state = {
  drawnPlots,
};

/**
 * Visualizes the sound on a 2d line graph
 * @param sound the sound which is to be visualized on plotly
 */
export function draw_sound_2d(sound: Sound) {
  if (!is_sound(sound)) {
    throw new Error(`draw_sound_2d is expecting sound, but encountered ${sound}`);
    // If a sound is already displayed, terminate execution.
  } else if (get_duration(sound) < 0) {
    throw new Error('draw_sound_2d: duration of sound is negative');
  } else {
    // Instantiate audio context if it has not been instantiated.

    // Create mono buffer
    const channel: number[] = [];
    const time_stamps: number[] = [];
    const len = Math.ceil(FS * get_duration(sound));


    const wave = get_wave(sound);
    for (let i = 0; i < len; i += 1) {
      time_stamps[i] = i / FS;
      channel[i] = wave(i / FS);
    }

    let x_s: number[] = [];
    let y_s: number[] = [];

    for (let i = 0; i < channel.length; i += 1) {
      x_s.push(time_stamps[i]);
      y_s.push(channel[i]);
    }

    const plotlyData: Data = {
      x: x_s,
      y: y_s,
    };
    const plot = new CurvePlot(
      draw_new_curve,
      {
        ...plotlyData,
        type: 'scattergl',
        mode: 'lines',
        line: { width: 0.5 },
      } as Data,
      {
        xaxis: {
          type: 'linear',
          title: 'Time',
          anchor: 'y',
          position: 0,
          rangeslider: { visible: true },
        },
        yaxis: {
          type: 'linear',
          visible: false,
        },
        bargap: 0.2,
        barmode: 'stack',
      },
    );
    drawnPlots.push(plot);
  }
}

function draw_new_curve(divId: string, data: Data, layout: Partial<Layout>) {
  Plotly.newPlot(divId, [data], layout);
}
