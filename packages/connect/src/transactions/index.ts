import { UserSession, AppConfig } from 'blockstack';
import { SECP256K1Client, TokenSigner } from 'jsontokens';
import { defaultAuthURL, AuthOptions } from '../auth';
import { popupCenter, setupListener } from '../popup';

export interface FinishedTxData {
  txId: string;
  txRaw: string;
}

export interface ContractCallOptions {
  contractAddress: string;
  functionName: string;
  contractName: string;
  functionArgs?: any[];
  authOrigin?: string;
  userSession?: UserSession;
  appDetails?: AuthOptions['appDetails'];
  finished?: (data: FinishedTxData) => void;
}

export const makeContractCallToken = async (opts: ContractCallOptions) => {
  const { contractAddress, functionName, contractName, functionArgs, appDetails } = opts;
  let { userSession } = opts;
  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    // eslint-disable-next-line no-param-reassign
    userSession = new UserSession({ appConfig });
  }
  const privateKey = userSession.loadUserData().appPrivateKey;
  const publicKey = SECP256K1Client.derivePublicKey(privateKey);

  const payload: any = {
    contractAddress,
    contractName,
    functionName,
    functionArgs: functionArgs || [],
    publicKey,
  };

  if (appDetails) {
    payload.appDetails = appDetails;
  }

  const tokenSigner = new TokenSigner('ES256k', privateKey);
  const token = await tokenSigner.signAsync(payload);
  return token;
};

export const openContractCall = async (opts: ContractCallOptions) => {
  const token = await makeContractCallToken(opts);
  const extensionURL = await window.BlockstackProvider?.getURL();
  const authURL = new URL(extensionURL || opts.authOrigin || defaultAuthURL);
  const urlParams = new URLSearchParams();
  urlParams.set('request', token);
  const popup = popupCenter({
    url: `${authURL.origin}/#/transaction?${urlParams.toString()}`,
  });

  setupListener<FinishedTxData>({
    popup,
    authURL,
    finished: data => {
      if (opts.finished) {
        opts.finished(data);
      }
    },
    messageParams: {},
  });
  return popup;
};
