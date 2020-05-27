import React from 'react';
import GettingStarted from './_getting-started.mdx';
import npmfetch from 'npm-registry-fetch';

const Homepage = ({ version }: any) => <GettingStarted version={version} />;

export async function getStaticProps(context: any) {
  const res = await npmfetch('/@blockstack/ui');
  const data = await res.json();

  const version = data['dist-tags'].latest;

  return {
    props: { version }, // will be passed to the page component as props
  };
}

export default Homepage;
