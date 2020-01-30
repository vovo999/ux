import { ThunkAction } from 'redux-thunk';
import { Wallet } from '@blockstack/keychain';
import { WalletActions, RESTORE_WALLET, IS_RESTORING_WALLET, GENERATE_WALLET, LOG_OUT } from './types';

export function didRestoreWallet(wallet: Wallet): WalletActions {
  return {
    type: RESTORE_WALLET,
    payload: wallet,
  };
}

export function didGenerateWallet(wallet: Wallet): WalletActions {
  return {
    type: GENERATE_WALLET,
    payload: wallet,
  };
}

function isRestoringWallet(): WalletActions {
  return {
    type: IS_RESTORING_WALLET,
  };
}

export function doLogOut(): WalletActions {
  return {
    type: LOG_OUT,
  };
}

export function doStoreSeed(seed: string, password: string): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.restore(password, seed);
    dispatch(didRestoreWallet(wallet));
    return wallet;
  };
}

export function doGenerateWallet(password: string): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.generate(password);
    dispatch(didGenerateWallet(wallet));
    return wallet;
  };
}
