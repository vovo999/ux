import React, { useState, useEffect } from 'react';
import { Screen, ScreenBody, ScreenActions, Title, PoweredBy, ScreenFooter, AuthOptions } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { Button, Box, Text, ExternalIcon } from '@blockstack/ui';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { decodeToken } from 'jsontokens';
import { useWallet } from '@common/hooks/use-wallet';
// import { makeContractCall, TransactionVersion, BufferCV } from '@blockstack/stacks-transactions';
// import BN from 'bn.js';
import { TestnetBanner } from '@components/transactions/testnet-banner';
import { TabbedCard, Tab } from '@components/tabbed-card';
import { broadcastTX } from '@blockstack/rpc-client';
// import { Toast } from '@components/toast';

interface RequestState {
  contractAddress: string;
  functionName: string;
  contractName: string;
  functionArgs: any[];
  appDetails?: AuthOptions['appDetails'];
  publicKey: string;
}

interface TabContentProps {
  json: any;
}

const TabContent: React.FC<TabContentProps> = ({ json }) => {
  return (
    <Box whiteSpace="pre" overflow="scroll" color="gray" maxHeight="200px">
      {JSON.stringify(json, null, 2)}
    </Box>
  );
};

const Textarea = styled.textarea`
  position: absolute;
  left: -999px;
`;

export const Transaction: React.FC = () => {
  const location = useLocation();
  const { wallet } = useWallet();
  const [requestState, setRequestState] = useState<RequestState | undefined>();
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(true);
  // const [tx, setTx] = useState<StacksTransaction | null>(null);
  // const [copied, setCopied] = useState(false);
  // const dispatch = useDispatch();

  const getInputJSON = () => {
    if (requestState) {
      const { appDetails, publicKey, ...rest } = requestState;
      return rest;
    }
    return {};
  };

  const tabs: Tab[] = [
    {
      title: 'Inputs',
      content: <TabContent json={getInputJSON()} />,
      key: 'inputs',
    },
    // {
    //   title: 'Outputs',
    //   content: <TabContent json={tx} />,
    //   key: 'outputs',
    // },
    {
      title: (
        <>
          View Source
          <ExternalIcon display="inline-block" width="9px" ml={1} />
        </>
      ),
      content: <span>src</span>,
      key: 'source',
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const requestToken = urlParams.get('request');
    if (requestToken && wallet) {
      const token = decodeToken(requestToken);
      const reqState = (token.payload as unknown) as RequestState;
      setLoading(false);
      setRequestState(reqState);
    }
  }, []);

  const handleButtonClick = async () => {
    if (requestState && wallet) {
      setLoading(true);
      const [identity] = wallet.identities;
      const { contractName, contractAddress, functionName, functionArgs } = requestState;
      console.log('about to sign');
      const tx = await identity.signContractCall({
        contractName,
        contractAddress,
        functionName,
        functionArgs,
      });
      const serialized = tx.serialize().toString('hex');
      console.log(serialized);
      setTxHash(serialized);
      const res = await broadcastTX(tx.serialize());
      console.log(res);
      const data = await res.json();
      console.log(data);
      setLoading(false);
    }
  };

  return (
    <>
      <Screen isLoading={loading}>
        {/* TODO: only show testnet banner if in testnet mode */}
        <TestnetBanner />
        <ScreenHeader
          rightContent={
            <Text textStyle="caption.small" color="gray" fontSize={0}>
              {/* TODO: use RPC API to get balance */}
              100.00 STX available
            </Text>
          }
        />
        <ScreenBody
          mt={6}
          body={[
            <Title>Confirm Transaction</Title>,
            <Text mt={2} display="inline-block">
              with {requestState?.appDetails?.name}
            </Text>,
            <TabbedCard mt={4} mb={4} tabs={tabs} />,
            <Box width="100%" mt={5}>
              <Text fontWeight={600}>
                <Text>Total</Text>
                <Text style={{ float: 'right' }}>0 STX</Text>
              </Text>
            </Box>,
          ]}
        />
        <ScreenActions>
          <Button
            width="100%"
            mt={5}
            size="lg"
            onClick={async () => {
              // event.preventDefault();
              await handleButtonClick();
            }}
          >
            Confirm Transaction
          </Button>
        </ScreenActions>
        <ScreenFooter>
          <PoweredBy />
        </ScreenFooter>
      </Screen>
      <Textarea className="hidden-tx-hash" value={txHash} readOnly />
      {/* <Toast show={copied} text="Copied TX hash to clipboard" /> */}
    </>
  );
};
