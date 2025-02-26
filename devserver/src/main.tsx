import React from 'react';
import ReactDOM from 'react-dom/client';
import Playground from './components/Playground';
import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<React.StrictMode>
  <div className="Application">
    <div className="Application__main">
      <Playground />
    </div>
  </div>
</React.StrictMode>);
