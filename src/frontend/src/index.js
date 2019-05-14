import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './rwd.css';
import App from './v2/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
