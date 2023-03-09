import { context } from 'js-slang/moduleHelpers'
import Plotly, { Data, Layout } from 'plotly.js-dist'
import { get_duration, get_wave, is_sound } from '../sound'
import { Sound } from '../sound/types'
import { CurvePlot, DrawnPlot } from './plotly'

const FS: number = 44100 // Output sample rate

const drawnPlots: (DrawnPlot | CurvePlot)[] = []
context.moduleContexts.plotly.state = {
  drawnPlots,
}

export function draw_sound_2d(sound: Sound) {
  if (!is_sound(sound)) {
    throw new Error(`play is expecting sound, but encountered ${sound}`)
    // If a sound is already playing, terminate execution.
  } else if (get_duration(sound) < 0) {
    throw new Error('play: duration of sound is negative')
  } else {
    // Instantiate audio context if it has not been instantiated.

    // Create mono buffer
    const channel: number[] = []
    const time_stamps: number[] = []
    const len = Math.ceil(FS * get_duration(sound))

    let temp: number
    let prev_value = 0

    const wave = get_wave(sound)
    for (let i = 0; i < len; i += 1) {
      temp = wave(i / FS)
      time_stamps[i] = i / FS
      // clip amplitude
      // channel[i] = temp > 1 ? 1 : temp < -1 ? -1 : temp;
      if (temp > 1) {
        channel[i] = 1
      } else if (temp < -1) {
        channel[i] = -1
      } else {
        channel[i] = temp
      }

      // smoothen out sudden cut-outs
      if (channel[i] === 0 && Math.abs(channel[i] - prev_value) > 0.01) {
        channel[i] = prev_value * 0.999
      }

      prev_value = channel[i]
    }

    let x_s: number[] = []
    let y_s: number[] = []

    for (let i = 0; i < channel.length; i += 1) {
      x_s.push(time_stamps[i])
      y_s.push(channel[i])
    }

    const plotlyData: Data = {
      x: x_s,
      y: y_s,
    }
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
        yaxis: { type: 'linear', visible: false },
        bargap: 0.2,
        barmode: 'stack',
      },
    )
    drawnPlots.push(plot)
  }
}

function draw_new_curve(divId: string, data: Data, layout: Partial<Layout>) {
  Plotly.newPlot(divId, [data], layout)
}
