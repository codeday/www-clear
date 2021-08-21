import React, {useEffect, useState} from 'react';
import Page from '../../components/Page'
import {Heading} from '@codeday/topo/Atom/Text'
import Box from '@codeday/topo/Atom/Box'
import Button from '@codeday/topo/Atom/Button'
import { UiAdd } from '@codeday/topocons/Icon'
import Content from '@codeday/topo/Molecule/Content'
import {useLocalhostFetcher} from "../../fetch";
import Event from '../../components/Event'
import  { getEvents }from './events.graphql'
import {useToasts} from '@codeday/topo/utils'
import Spinner from '@codeday/topo/Atom/Spinner'
import {print} from 'graphql';

export default function Events({events}){
    const fetch = useLocalhostFetcher()
    const [loading, setLoading] = useState(false)
    const {success, error} = useToasts()
    return (
        <>
            <Page title="Events" slug="/admin/events">
                <Content>
                    <Heading>
                        My Events
                    </Heading>
                    {loading && <Spinner />}
                    <Box display="flex">
                        {events.map((event) => (
                            <Event m={4} event={event}/>
                        ))}
                    </Box>
                </Content>
            </Page>
        </>
    )
}

export async function getServerSideProps({req, res, query}) {
    const fetch = useLocalhostFetcher()
    const eventResults = await fetch(print(getEvents))
    return {
        props: {
            events: eventResults.events
        }
    }

}
