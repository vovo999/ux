import { Box, Flex, PseudoBox } from '@blockstack/ui';
import { Text } from '@components/typography';
import { useRouter } from 'next/router';
import React from 'react';
import { routes } from '@common/routes';
import { slugify } from '@common/utils';
import Link from 'next/link';
import { ContentWrapper } from './content-wrapper';

const PaginationLink = ({ slug, label, prev }: any) => (
  <Link href={`/${slug}`} passHref>
    <PseudoBox
      _hover={{
        color: 'blue',
      }}
      as="a"
      textAlign="left"
    >
      <Text display="block" textStyle="caption" color="ink.250">
        {prev ? '← Previous' : 'Next →'}
      </Text>
      <Text display="block" textStyle="display.large">
        {label}
      </Text>
    </PseudoBox>
  </Link>
);

const Pagination = (props: any) => {
  const router = useRouter();
  const routesAsSlugs = routes.map(r => slugify(r));
  const route = router.asPath.replace('/', '');
  const index = routesAsSlugs.indexOf(route);
  const previous = routes[index - 1];
  const previousSlug = routesAsSlugs[index - 1];
  const next = routes[index + 1];
  const nextSlug = routesAsSlugs[index + 1];
  return (
    <Flex
      borderTop="1px solid"
      borderColor="var(--colors-border)"
      alignItems="baseline"
      justify="space-between"
    >
      {previous && (
        <Box p="extra-loose" textAlign="left">
          <PaginationLink slug={previousSlug} label={previous} prev />
        </Box>
      )}
      {next && (
        <Box p="extra-loose" textAlign="right" ml={!previous ? 'auto' : undefined}>
          <PaginationLink slug={nextSlug} label={next} />
        </Box>
      )}
    </Flex>
  );
};

export { Pagination };
