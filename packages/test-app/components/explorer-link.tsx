import React from 'react';
import { Link } from '@blockstack/connect';
import { getRPCClient } from '@common/utils';

interface LinkProps {
  txId: string;
  text?: string;
  skipConfirmCheck?: boolean;
}

export const ExplorerLink: React.FC<LinkProps> = ({ txId, text, skipConfirmCheck }) => {
  const [confirmed, setConfirmed] = React.useState(!!skipConfirmCheck);

  const checkStatus = async (tx: string) => {
    const client = getRPCClient();
    const txUrl = `${client.url}/sidecar/v1/tx/${tx}`;
    const res = await fetch(txUrl);
    if (res.ok) {
      setConfirmed(true);
      return;
    }
    setTimeout(() => {
      checkStatus(tx);
    }, 1000);
  };

  React.useEffect(() => {
    if (!skipConfirmCheck) {
      setConfirmed(false);
      checkStatus(txId);
    }
  }, [txId]);

  const url = `https://testnet-explorer.now.sh/txid/${txId.replace('"', '')}`;
  return (
    <Link onClick={() => window.open(url, '_blank')} color="blue" display="block" my={3}>
      {confirmed ? text || 'View transaction in explorer' : 'Waiting for TX to confirm...'}
    </Link>
  );
};
