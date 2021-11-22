import React from 'react';
import Box from '@codeday/topo/Atom/Box';
import {Heading} from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import {Clear} from '@codeday/topo/Atom/Logo';
import Header, {Menu, SiteLogo} from '@codeday/topo/Organism/Header';
import Skelly from '@codeday/topo/Atom/Skelly';
import getConfig from 'next/config';
import {DefaultSeo} from 'next-seo';
import {signIn, signOut, useSession} from 'next-auth/client';
import Content from '@codeday/topo/Molecule/Content';
import Spinner from '@codeday/topo/Atom/Spinner';
import {useColorMode} from "@codeday/topo/Theme";

const {publicRuntimeConfig} = getConfig();

export default function Page({
                                 children, title, slug, ...props
                             }) {
    const [session, loading] = useSession();
    // dumb hack because dark mode doesn't work with antd css
    const {setColorMode} = useColorMode()
    if(setColorMode) setColorMode("light")

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
