import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner, Flex, Text } from '@blockstack/ui';
import { Screen, ScreenBody, PoweredBy, ScreenFooter } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';

import { doCreateSecretKey, doSetOnboardingProgress } from '@store/onboarding/actions';
import { useAppDetails } from '@common/hooks/useAppDetails';

import { useWallet } from '@common/hooks/use-wallet';

interface ExplainerCardProps {
  title: string;
  imageUrl: string;
}

const ExplainerCard = ({ title, imageUrl }: ExplainerCardProps) => (
  <Flex height="250px" flexDirection="column" justifyContent="space-between">
    <Flex mx="auto" height="120px" alignItems="flex-start">
      <img src={imageUrl} />
    </Flex>
    <Flex flex={1} mt={3} justifyContent="center">
      <Text textStyle="display.small">{title}</Text>
    </Flex>
    <Flex width="100%" flexDirection="column" alignItems="center">
      <Spinner thickness="3px" size="lg" color="blue" />
    </Flex>
  </Flex>
);

const createTimeoutLoop = (
  setCardIndex: (cardIndex: number) => void,
  length: number,
  onEnd: () => void
) => {
  for (let index = 1; index < length; index++) {
    setTimeout(() => {
      setCardIndex(index);
    }, index * 2400);
  }
  setTimeout(() => {
    onEnd();
  }, length * 2400);
};

const preloadImages = (images: { imageUrl: string }[]) => {
  images.forEach(({ imageUrl }) => {
    const img = new Image();
    img.src = imageUrl;
  });
};

interface CreateProps {
  next: () => void;
}
export const Create: React.FC<CreateProps> = props => {
  const [cardIndex, setCardIndex] = useState(0);
  const { wallet, isRestoringWallet } = useWallet();
  const { name } = useAppDetails();
  const dispatch = useDispatch();

  const explainerData: ExplainerCardProps[] = [
    {
      title: 'Generating your Secret Key...',
      imageUrl: '/assets/images/icon-delay-key.svg',
    },
    {
      title: `Everything you do in ${name} is protected with encryption`,
      imageUrl: '/assets/images/icon-delay-padlock.svg',
    },
    {
      title: `${name} can't see or track your activity`,
      imageUrl: '/assets/images/icon-delay-private.svg',
    },
  ];

  useEffect(() => {
    preloadImages(explainerData);
  }, []);

  useEffect(() => {
    // This timeout is important because if the app is navigated to as a sign in, the
    // create page will be rendered momentarily, and we need to cancel these
    // functions if we're on a different screen
    const timeout = setTimeout(() => {
      createTimeoutLoop(setCardIndex, explainerData.length, () => props.next());
      // We have this check for `wallet`, because this is the
      // default first screen rendered. We don't want to accidentally create a new
      // seed if a logged-in user gets into this hook.
      if (!wallet && !isRestoringWallet) {
        dispatch(doSetOnboardingProgress(true));
        dispatch(doCreateSecretKey());
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  const offCenterOffset = '3';
  const card = explainerData[cardIndex];

  return (
    <Screen textAlign="center">
      <ScreenHeader />
      <ScreenBody
        flex={offCenterOffset}
        justifyContent="center"
        body={[<ExplainerCard title={card.title} imageUrl={card.imageUrl} />]}
      />
      <ScreenFooter>
        <PoweredBy />
      </ScreenFooter>
    </Screen>
  );
};
