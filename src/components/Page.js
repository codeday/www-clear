import React from 'react';
import {Box, Button, Clear, Heading, Skelly, Spinner} from '@codeday/topo/Atom';
import {Content} from '@codeday/topo/Molecule';
import {Header, Menu, SiteLogo} from '@codeday/topo/Organism';
import {DefaultSeo} from 'next-seo';
import {signIn, signOut, useSession} from 'next-auth/react';

export default function Page({
                                 children, title, slug, ...props
                             }) {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    if (!session) {
        return (
            <Box position="relative">
                <Header underscore position="relative">
                    <SiteLogo>
                        <a href="/">
                            <Clear withText/>
                        </a>
                    </SiteLogo>
                </Header>
                <Content>
                    {loading ? <Spinner/> : (
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
            <Button variant="ghost" key="events" as="a" href="/events">My Events</Button>
            <Button variant="ghost" onClick={() => {
                signOut();
            }}>Sign Out</Button>
        </Menu>
    );
    return (
        <>
            <DefaultSeo
                title={`${title ? `${title} ~ ` : ''}Clear`}
                canonical={`https://clear.codeday.org${slug}`}
            />
            <Box position="relative" {...props}>
                <Header underscore position="relative">
                    <SiteLogo>
                        <a href="/">
                            <Clear withText/>
                        </a>
                    </SiteLogo>
                    <Menu>
                        {loading ? <Skelly/> : menuItems}
                    </Menu>
                </Header>
                <Content mt={-8}>
                    {children}
                </Content>
            </Box>
        </>
    );
}
