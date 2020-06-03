import React from 'react';
import { Button, ButtonGroup, Box, Text } from '@blockstack/ui';
import { AppContext } from '@common/context';
import { getAuthOrigin, getRPCClient } from '@common/utils';
import { useConnect } from '@blockstack/connect';
import { deserializeCV, IntCV } from '@blockstack/stacks-transactions';
import { ExplorerLink } from '@components/explorer-link';

export const CounterActions: React.FC = () => {
  const { userData } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [txId, setTxId] = React.useState('');
  const [counter, setCounter] = React.useState<number | null>(null);
  const { doContractCall } = useConnect();

  const callMethod = async (method: string) => {
    setLoading(true);
    const authOrigin = getAuthOrigin();
    await doContractCall({
      authOrigin,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      functionName: method,
      functionArgs: [],
      contractName: 'counter',
      finished: data => {
        setTxId(data.txId);
        console.log('finished!', data);
        setLoading(false);
      },
    });
  };

  const getCounter = async () => {
    const client = getRPCClient();
    setLoading(true);
    const data = await client.callReadOnly({
      contractName: 'counter',
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      args: [],
      functionName: 'get-counter',
    });
    const cv = deserializeCV(Buffer.from(data.result.slice(2), 'hex')) as IntCV;
    console.log(cv.value);
    setCounter(cv.value.toNumber());
    setLoading(false);
  };

  return (
    <Box>
      {!userData && <Text display="block">Log in to change the state of this smart contract.</Text>}
      <ButtonGroup spacing={4} my={5}>
        <Button onClick={() => callMethod('increment')}>Increment</Button>
        <Button onClick={() => callMethod('decrement')}>Decrement</Button>
        <Button onClick={getCounter}>Get Current Value</Button>
      </ButtonGroup>
      {txId && !loading && <ExplorerLink txId={txId} />}
      {counter !== null && !loading && (
        <Text display="block">Current counter value: {counter}</Text>
      )}
    </Box>
  );
};
