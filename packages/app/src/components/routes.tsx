import React, { useEffect } from 'react';
import { Home } from '../pages/home';
import { Create, SaveKey } from '../pages/sign-up';
import { SignIn, DecryptRecoveryCode } from '../pages/sign-in';

import { Username } from '../pages/username';
import { UsernameRegistryError } from '../pages/registery-error';
import { SecretKey } from '../pages/secret-key';

import { ChooseAccount } from '../pages/connect';

import { doSaveAuthRequest } from '@store/onboarding/actions';
import { useDispatch } from 'react-redux';
import { ScreenPaths } from '@store/onboarding/types';
import { doFinishSignIn as finishSignIn } from '@store/onboarding/actions';
import { authenticationInit } from '@common/utils';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { Routes as RoutesDom, Route, Navigate } from 'react-router-dom';

export const Routes: React.FC = () => {
  const dispatch = useDispatch();
  const { doChangeScreen } = useAnalytics();
  const { identities } = useWallet();
  const { isOnboardingInProgress } = useOnboardingState();
  const authRequest = authenticationInit();

  useEffect(() => {
    if (authRequest) {
      dispatch(doSaveAuthRequest(authRequest));
    }
  }, [authRequest]);

  const doFinishSignIn = ({ identityIndex }: { identityIndex: number } = { identityIndex: 0 }) =>
    dispatch(finishSignIn({ identityIndex }));

  const isSignedIn = !isOnboardingInProgress && identities.length;

  return (
    <RoutesDom>
      <Route path="/" element={<Home />} />
      {/*Sign Up*/}
      <Route
        path="/sign-up"
        element={
          isSignedIn ? (
            <Navigate to={{ pathname: '/', hash: `connect/choose-account?${location.hash.split('?')[1]}` }} />
          ) : (
            <Create next={() => doChangeScreen(ScreenPaths.SECRET_KEY)} />
          )
        }
      />
      <Route path="/sign-up/secret-key" element={<SecretKey next={() => doChangeScreen(ScreenPaths.SAVE_KEY)} />} />
      <Route
        path="/sign-up/save-secret-key"
        element={
          <SaveKey
            next={() => {
              doChangeScreen(ScreenPaths.USERNAME);
            }}
          />
        }
      />
      <Route
        path="/sign-up/username"
        element={
          isSignedIn ? (
            <Navigate to={'/connect/choose-account'} />
          ) : (
            <Username next={() => doChangeScreen(ScreenPaths.GENERATION)} />
          )
        }
      />
      {/*Sign In*/}
      <Route
        path="/sign-in"
        element={
          isSignedIn ? (
            <Navigate to={ScreenPaths.CHOOSE_ACCOUNT} />
          ) : (
            <SignIn
              next={() => doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT)}
              back={() => doChangeScreen(ScreenPaths.SECRET_KEY)}
            />
          )
        }
      />
      <Route
        path="/sign-in/recover"
        element={<DecryptRecoveryCode next={() => doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT)} />}
      />
      <Route path="/sign-in/add-account" element={<Username next={() => doChangeScreen(ScreenPaths.GENERATION)} />} />;
      <Route
        path="/connect/choose-account"
        element={
          <ChooseAccount
            next={(identityIndex: number) => {
              doFinishSignIn({ identityIndex });
            }}
          />
        }
      />
      {/*Error/Misc*/}
      <Route path="/username-error" element={<UsernameRegistryError />} />
      <Route path="/settings/secret-key" element={<SecretKey next={() => doChangeScreen(ScreenPaths.HOME)} />} />
    </RoutesDom>
  );
};