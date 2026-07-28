import type { Data, Layout } from 'plotly.js-dist';

export const PLOTLY_CHANNEL_ID = 'sourceacademy-plotly-channel';
export const PLOTLY_RUNNER_ID = 'plotly-runner';
export const PLOTLY_WEB_ID = 'plotly-web';
export const PLOTLY_TAB_ID = 'plotly';
export const PLOTLY_TAB_NAME = 'Plotly';

export type PlotlyRenderMessage = {
    type: 'render';
    data: Data;
    layout?: Partial<Layout>;
};

export type PlotlyRequestMessage = {
    type: 'request';
};

export type PlotlyChannelMessage = PlotlyRenderMessage | PlotlyRequestMessage;
