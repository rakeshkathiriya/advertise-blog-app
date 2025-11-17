import { createRoot } from 'react-dom/client';
import './index.css';

import { Provider } from 'react-redux';
import { AppProvider } from './appProvider/AppProvider';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AppProvider />
  </Provider>,
);
