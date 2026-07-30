import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import Playground from './components/Playground2';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<React.StrictMode>
  <div className="Application">
    <div className="Application__main">
      <Playground />
    </div>
  </div>
</React.StrictMode>);
