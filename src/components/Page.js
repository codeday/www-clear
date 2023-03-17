/* eslint-disable react/jsx-curly-brace-presence */
import React, { } from 'react';
import {
  Box, Button, Clear, Heading, Skelly, Spinner, NextLink,
} from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import {
  Header, Menu, SiteLogo, Footer, CustomLinks,
} from '@codeday/topo/Organism';
import { DefaultSeo } from 'next-seo';
import { signIn, signOut, useSession } from 'next-auth/react';
import HeadwayWidget from '@headwayapp/react-widget';

export default function Page({
  children, title, slug, ...props
}) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (!session) {
    return (
      <Box position="relative" paddingLeft="calc(100vw - 100%)">
        <Header underscore position="relative">
          <SiteLogo>
            <NextLink href={'/'}>
              <Clear withText />
            </NextLink>
          </SiteLogo>
        </Header>
        <Content>
          {loading ? (
            <Box textAlign="center">
              <Spinner />
            </Box>
          ) : (
            <>
              <Heading>Log in with your CodeDay Account to continue</Heading>
              <Button size="lg" m={10} onClick={() => signIn('auth0')}>Log In</Button>
            </>
          )}
        </Content>
      </Box>
    );
  }
  const menuItems = (
    <Menu>
      <NextLink href="/events">
        <Button variant="ghost" key="events">My Events</Button>
      </NextLink>
      <Button
        variant="ghost"
        onClick={() => {
          signOut();
        }}
      >Sign Out
      </Button>
    </Menu>
  );
  return (
    <>
      <DefaultSeo
        title={`${title ? `${title} ~ ` : ''}Clear`}
        canonical={`https://clear.codeday.org${slug}`}
      />
      {/* padding on left is to prevent scroll bar from shifting content */}
      <Box position="relative" paddingLeft="calc(100vw - 100%)" {...props}>
        <Header underscore position="relative">
          <SiteLogo>
            <NextLink href={session.isAdmin ? '/' : '/events'}>
              <Clear withText />
            </NextLink>
            <div style={{
              display: 'inline-block', marginLeft: '0.4em', position: 'relative', top: '-0.15em',
            }}
            >
              <HeadwayWidget account="xaBzA7" />
            </div>
          </SiteLogo>
          <Menu>
            {loading ? <Skelly /> : menuItems}
          </Menu>
        </Header>
        <Content mt={-8}>
          {children}
        </Content>
        <Footer repository="www-clear" branch="master" mt={16}>
          <CustomLinks>
            <NextLink href="/events" display="block">Events</NextLink>
            <NextLink href="/token" display="block">API Token</NextLink>
          </CustomLinks>
        </Footer>
      </Box>
    </>
  );
}
