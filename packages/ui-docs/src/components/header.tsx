import React from 'react';
import { Flex } from '@blockstack/ui';
import { Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';

import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { SideNav } from './side-nav';

const MenuButton = ({ ...rest }: any) => {
  const { isOpen, handleOpen, handleClose } = useMobileMenuState();
  const Icon = isOpen ? CloseIcon : MenuIcon;
  const handleClick = isOpen ? handleClose : handleOpen;
  return (
    <Flex
      color="var(--colors-invert)"
      display={['flex', 'flex', 'none']}
      onClick={handleClick}
      px={1}
    >
      <Icon color="currentColor" />
    </Flex>
  );
};

const GithubButton = ({ ...rest }: any) => {
  return <Flex></Flex>;
};

const Header = ({ ...rest }: any) => {
  const { isOpen, handleClose } = useMobileMenuState();

  return (
    <>
      <Flex
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="var(--colors-border)"
        align="center"
        px="base"
        position="fixed"
        width="100%"
        bg="var(--colors-bg)"
        zIndex={99}
        height="50px"
      >
        <Text fontSize="14px">Blockstack Design System</Text>
        <MenuButton />
      </Flex>
      <SideNav
        position="fixed"
        top="50px"
        maxHeight="calc(100vh - 50px)"
        width="100%"
        zIndex={99}
        display={isOpen ? ['block', 'block', 'none'] : 'none'}
      />
    </>
  );
};

export { Header };
