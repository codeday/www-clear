import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, TextInput, InputGroup, InputRightElement, FormControl, Spinner } from '@codeday/topo/Atom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useColorModeValue } from '@codeday/topo/Theme';
import { UiSearch } from '@codeday/topocons';
import { TicketBox } from 'src/components/Ticket';

import { useQuery } from 'urql';
import { useRouter } from 'next/router';
import { graphql } from 'generated/gql';
import NotFound from 'src/pages/404';
import { Page } from '../../../../components/Page';

const BarcodeScannerComponent = dynamic(() => import('react-qr-barcode-scanner'), { ssr: false });

const query = graphql(`
  query ScanTicketPage($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        id
        tickets {
          id
          firstName
          lastName
        }
      }
    }
  }
`);

export default function Scan() {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query, variables: { where: { id: router.query.event as string } } });
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState(data?.clear?.event?.tickets);
  const isLightMode = useColorModeValue(true, false);
  const [stopStream, setStopStream] = useState(false);
  const dismissQrReader = () => {
    setStopStream(true);
    setTimeout(() => setOpen(false), 0);
  };

  const event = data?.clear?.event;
  if (event === null && !fetching) {
    return <NotFound />;
  }

  if (!event) {
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }

  return (
    <Page>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTickets(event.tickets.filter((ticket) => ticket.lastName.toLowerCase().startsWith(search.toLowerCase())));
        }}
      >
        <FormControl>
          <InputGroup>
            <TextInput
              value={search}
              id="lastName"
              placeholder="Last Name"
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button type="submit" h="1.75rem">
                <UiSearch />
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
      <Button
        w="100%"
        onClick={() => {
          setOpen(true);
        }}
      >
        Scan New Ticket
      </Button>
      {tickets && event && tickets.length > 0 && tickets.map((ticket) => <TicketBox ticket={ticket} />)}
      {tickets && event && !(tickets.length > 0) && 'Ticket not found'}
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        styles={{
          modal: {
            background: isLightMode ? 'white' : 'var(--chakra-colors-gray-1100)',
          },
        }}
      >
        <BarcodeScannerComponent
          onUpdate={async (e, result) => {
            if (result) {
              const foundTicket = event.tickets.find((ticket) => ticket.id === result.getText());
              setTickets(foundTicket ? [foundTicket] : []);
              setOpen(false);
              dismissQrReader();
            }
          }}
          stopStream={stopStream}
        />
      </Modal>
    </Page>
  );
}
