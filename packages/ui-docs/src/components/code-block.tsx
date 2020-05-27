import React, { useState, useContext } from 'react';

import theme from 'prism-react-renderer/themes/oceanicNext';
import { LiveProvider, withLive, LiveError, LiveContext, LivePreview } from 'react-live';
import { mdx } from '@mdx-js/react';
import * as BlockstackUI from '@blockstack/ui';
import 'prismjs/components/prism-jsx';
import { CodeEditor } from '@components/code-editor';
import { Caption } from '@components/typography';

const { Box, Button, CodeBlock: BaseCodeBlock } = BlockstackUI;

const Error = (props: any) => {
  const { error } = useContext(LiveContext);

  return error ? <BaseCodeBlock code={error} /> : null;
};

export const liveEditorStyle = {
  fontSize: 14,
  marginBottom: 24,
  marginTop: 24,
  overflowX: 'auto',
  fontFamily: 'Menlo,monospace',
  borderRadius: 10,
};

export const liveErrorStyle = {
  fontFamily: 'Fira Mono, monospace',
  fontSize: 14,
  padding: '1em',
  overflowX: 'auto',
  color: 'white',
  marginTop: '16px',
  border: '1px solid var(--colors-border)',
  backgroundColor: 'var(--colors-bg-light)',
};

const LiveCodePreview = (props: any) => (
  <Box
    as={LivePreview}
    fontFamily="body"
    borderRadius="6px"
    p="base"
    border="1px solid var(--colors-border)"
    {...props}
  />
);

const CopyButton = props => (
  <Button
    size="sm"
    position="absolute"
    textTransform="uppercase"
    variantColor="teal"
    fontSize="xs"
    height="24px"
    top={0}
    zIndex="1"
    right="1.25em"
    {...props}
  />
);

const EditableNotice = props => {
  return (
    <>
      <Box
        position="absolute"
        top={0}
        py="2"
        zIndex="0"
        color="ink.250"
        right={0}
        fontSize={0}
        textAlign="right"
        px={3}
        pointerEvents="none"
        fontFamily="body"
        fontWeight="medium"
        {...props}
      >
        Editable Example
      </Box>
    </>
  );
};

const StarIcon = props => {
  return (
    <Box m="2px" as="svg" fill="current" size="3" viewBox="0 0 24 24" {...props}>
      <path d="M23.555 8.729a1.505 1.505 0 0 0-1.406-.98h-6.087a.5.5 0 0 1-.472-.334l-2.185-6.193a1.5 1.5 0 0 0-2.81 0l-.005.016-2.18 6.177a.5.5 0 0 1-.471.334H1.85A1.5 1.5 0 0 0 .887 10.4l5.184 4.3a.5.5 0 0 1 .155.543l-2.178 6.531a1.5 1.5 0 0 0 2.31 1.684l5.346-3.92a.5.5 0 0 1 .591 0l5.344 3.919a1.5 1.5 0 0 0 2.312-1.683l-2.178-6.535a.5.5 0 0 1 .155-.543l5.194-4.306a1.5 1.5 0 0 0 .433-1.661z"></path>
    </Box>
  );
};

const CodeBlock = ({ className, live = true, isManual, render, children, ...props }) => {
  const [editorCode, setEditorCode] = useState(children.trim());

  const language = className && className.replace(/language-/, '');
  const onCopy = () => console.log('copy');
  const hasCopied = false;

  const liveProviderProps = {
    theme,
    language,
    code: editorCode,
    transformCode: code => '/** @jsx mdx */' + code,
    scope: {
      ...BlockstackUI,
      mdx,
    },
    noInline: isManual,
    ...props,
  };

  const handleCodeChange = (newCode: string) => setEditorCode(newCode.trim());

  if (language === 'jsx' && live === true) {
    return (
      <LiveProvider {...liveProviderProps}>
        <Box mt="base" pl="base">
          <Caption fontFamily="body">Preview</Caption>
        </Box>
        <LiveCodePreview />
        <Box mt="base" tabIndex={-1} position="relative">
          <Box pl="base">
            <Caption fontFamily="body">Editable example</Caption>
          </Box>
          <CodeEditor value={editorCode} onChange={handleCodeChange} language={language} />
        </Box>
        <Error />
      </LiveProvider>
    );
  }

  if (render) {
    return (
      <Box>
        <LiveProvider {...liveProviderProps}>
          <LiveCodePreview />
        </LiveProvider>
      </Box>
    );
  }

  return (
    <BaseCodeBlock
      border="1px solid var(--colors-border)"
      code={editorCode}
      language={language}
      my="base"
    />
  );
};

CodeBlock.defaultProps = {
  mountStylesheet: false,
};

export default CodeBlock;
