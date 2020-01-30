import Wallet from '@blockstack/keychain/dist/wallet';
import Identity from '@blockstack/keychain/dist/identity';

export const RESTORE_WALLET = 'WALLET/RESTORE_WALLET';
export const IS_RESTORING_WALLET = 'WALLET/IS_RESTORING';
export const GENERATE_WALLET = 'WALLET/GENERATE';
export const LOG_OUT = 'WALLET/LOG_OUT';

interface StoreSeedAction {
  type: typeof RESTORE_WALLET;
  payload: Wallet;
}

interface IsRestoringWalletAction {
  type: typeof IS_RESTORING_WALLET;
}

interface GenerateWalletAction {
  type: typeof GENERATE_WALLET;
  payload: Wallet;
}

interface LogOutAction {
  type: typeof LOG_OUT;
}

export interface WalletState {
  seed: string | null;
  isRestoringWallet: boolean;
  currentWallet: Wallet | null;
  identities: Identity[] | null;
}

export type WalletActions = StoreSeedAction | IsRestoringWalletAction | GenerateWalletAction | LogOutAction;
