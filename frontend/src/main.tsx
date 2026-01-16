import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { AppProvider } from './appProvider/AppProvider';
import './index.css';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AppProvider />
  </Provider>,
);
