import React from 'react';
import { CSSReset, ThemeProvider, theme } from '@blockstack/ui';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@components/mdx-components';
import { DocsLayout } from '@components/docs-layout';
import { AppStateProvider } from '@components/app-state';
import { ColorModeProvider } from '@components/color-modes';

const AppWrapper = ({ children, version }: any) => (
  <ThemeProvider theme={theme}>
    <ColorModeProvider>
      <MDXProvider components={MDXComponents}>
        <AppStateProvider version={version}>
          <DocsLayout>
            <CSSReset />
            {children}
          </DocsLayout>
        </AppStateProvider>
      </MDXProvider>
    </ColorModeProvider>
  </ThemeProvider>
);

const MyApp = ({ Component, pageProps, ...rest }: any) => {
  return (
    <AppWrapper version={pageProps?.version}>
      <Component {...pageProps} />
    </AppWrapper>
  );
};

export default MyApp;
