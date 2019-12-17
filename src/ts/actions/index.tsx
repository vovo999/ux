import 'react-hot-loader';
import React from 'react';
import ExtStore from '@store/ext-store';
import ReactDOM from 'react-dom';
import { Store as ReduxStore } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../background/store';
import OnboardingApp from './containers/Onboarding';
import DevStore from '../dev/store';

const buildApp = (store: ReduxStore | typeof ExtStore) => {
  ReactDOM.render(
    <Provider store={store as any}>
      <PersistGate loading={null} persistor={persistor}>
        <OnboardingApp />
      </PersistGate>
    </Provider>,
    document.getElementById('actions-root')
  );
};

if (EXT_ENV === 'web') {
  const store = DevStore;
  buildApp(store);
} else {
  const store = ExtStore;
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.ready().then(() => buildApp(store));
}
