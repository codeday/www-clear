import React, {useEffect, useState} from 'react';
import Page from '../../components/Page'
import {Heading} from '@codeday/topo/Atom/Text'
import Box from '@codeday/topo/Atom/Box'
import Button from '@codeday/topo/Atom/Button'
import { UiAdd } from '@codeday/topocons/Icon'
import Content from '@codeday/topo/Molecule/Content'
import {useLocalhostFetcher} from "../../fetch";
import EventGroup from '../../components/EventGroup'
import  { getEventGroups }from './groups.graphql'
import {useToasts} from '@codeday/topo/utils'
import Spinner from '@codeday/topo/Atom/Spinner'

export default function Groups(){
    const fetch = useLocalhostFetcher()
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts()
    const refresh = async () => {
        setLoading(true)
        const result = await fetch(getEventGroups)
        setGroups(result.eventGroups)
        setLoading(false)
    }
    useEffect(async () => {
        if (typeof window === 'undefined' || !fetch ) return;
        try {
            await refresh();
        } catch(ex) {
            error(ex.toString())
        }
    }, [typeof window])
    return (
        <>
            <Page title="Event Groups" slug="/admin/groups">
                <Content>
                    <Heading>
                        Event Groups
                        <Button ml={50} as="a" href="/admin/groups/create">
                            <UiAdd /> New Event Group
                        </Button>
                    </Heading>
                    {loading && <Spinner />}
                            <Box display="flex">
                                {groups.map((group) => (
                                    <EventGroup m={4} group={group}/>
                                ))}
                            </Box>

                </Content>
            </Page>
        </>
    )
}
