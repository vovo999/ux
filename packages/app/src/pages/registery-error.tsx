import React from 'react';
import { Screen, ScreenBody, PoweredBy, ScreenFooter, Title } from '@blockstack/connect';
import { Flex, Box, Button } from '@blockstack/ui';
import { ScreenHeader } from '@components/connected-screen-header';

export const UsernameRegistryError: React.FC = () => (
  <Screen textAlign="center">
    <ScreenHeader />
    <ScreenBody
      flex="5"
      justifyContent="center"
      body={[
        <Flex flexDirection="column" mx={4}>
          <Box>
            <Title>
              There was a problem registering your username. We&apos;ve alerted our team to the
              issue.
            </Title>
            <Button
              mt={6}
              onClick={() =>
                window.open(
                  'mailto:support@blockstack.org?subject=Error%20when%20registering%20username'
                )
              }
            >
              Contact Support
            </Button>
          </Box>
        </Flex>,
      ]}
    />
    <ScreenFooter>
      <PoweredBy />
    </ScreenFooter>
  </Screen>
);
