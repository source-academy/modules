import React from 'react';
import ReactDOM from 'react-dom';

import Playground from './components/Playground';
import './styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <div className="Application">
      <div className="Application__main">
        <Playground />
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')!
);
