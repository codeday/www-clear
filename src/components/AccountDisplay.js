import React, {useEffect, useState} from 'react';
import {print} from 'graphql';
import {useToasts} from '@codeday/topo/utils';
import Box from '@codeday/topo/Atom/Box';
import Skelly from '@codeday/topo/Atom/Skelly';
import Image from '@codeday/topo/Atom/Image';
import Text from '@codeday/topo/Atom/Text';
import {getAccountByUsername} from './AccountDisplay.graphql';
import {useFetcher} from '../fetch';

// TODO(@Lola): Make this better, move fetch outside (not sure best way to do this atm)
export function AccountDisplayFromUsername({username, children, props}) {
    const fetch = useFetcher();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);
    const {success, error} = useToasts();
    const refresh = async () => {
        setLoading(true);
        const userResults = await fetch(print(getAccountByUsername), {username});
        if (userResults.account.getUser === null) {
            setUserNotFound(true);
            setLoading(false);
            return false;
        }
        setUser(userResults.account.getUser);
        setLoading(false);
    };

    useEffect(async () => {
        if (typeof window === 'undefined' || !fetch) return;
        try {
            await refresh();
        } catch (ex) {
            error(ex.toString());
            setLoading(false);
        }
    }, [typeof window, username]);

    return (
        <Box bg="gray.50" display="inline-flex" p={4} m={2} rounded={5} {...props}>
            {loading ? <Skelly width={75} height={75} rounded="full"/> : <Image src={user.picture}
                                                                                display="inline-flex"
                                                                                maxHeight={75}
                                                                                rounded="full"
                                                                                fallback={<Skelly size={75}/>}/>}
            {loading ? <Skelly width={100}/> : (
                <Box display="inline-block" p={2}>
                    <Text><b>{user.name}</b></Text>
                    {children}
                </Box>
            )}

        </Box>
    );
}
