import React from 'react';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button'
import { Clear } from '@codeday/topo/Atom/Logo'
import Header, {SiteLogo, Menu} from '@codeday/topo/Organism/Header'
import Skelly from '@codeday/topo/Atom/Skelly';
import getConfig from 'next/config';
import { DefaultSeo } from 'next-seo';
import {signIn, signOut, useSession} from 'next-auth/client'

const { publicRuntimeConfig } = getConfig()

export default function Page ({
                    children, title, slug, ...props
                              }) {
    const [session, loading] = useSession();
    const menuItems = (
        <Menu>
            {!session
                ? (<Button variant="ghost" onClick={() => signIn('auth0')}>Log In</Button>)
            : (
                <>
                <Button variant="ghost" key="events" as="a" href="/events">My Events</Button>
                </>
                )
            }
        </Menu>
    )
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
                        {loading ? <Skelly /> : menuItems}
                    </Menu>
                </Header>
                {children}
            </Box>
        </>
    )
}
