import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Button,
  TextInput,
  InputGroup,
  InputRightElement,
  FormControl,
} from '@codeday/topo/Atom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useColorModeValue } from '@codeday/topo/Theme';
import { getServerSession } from 'next-auth/next';
import { UiSearch } from '@codeday/topocons';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import Ticket from '../../../../components/Ticket';
import { getEventWithTickets } from './scan.gql';
import { getFetcher } from '../../../../fetch';
import Page from '../../../../components/Page';

const BarcodeScannerComponent = dynamic(
  () => import('react-qr-barcode-scanner'),
  { ssr: false },
);

export default function Scan({ event }) {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState(null);

  const [stopStream, setStopStream] = useState(false);
  const dismissQrReader = () => {
    setStopStream(true);
    setTimeout(() => setOpen(false), 0);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTickets(
            event?.tickets?.filter((ticket) => ticket.lastName.toLowerCase().startsWith(search.toLowerCase())),
          );
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

      {tickets
        && event
        && tickets?.length > 0
        && tickets.map((ticket) => (
          <Ticket ticket={ticket} eventId={event?.id} />
        ))}
      {tickets && event && tickets?.length <= 0 && 'Ticket not found'}

      <Modal
        open={open}
        onClose={onCloseModal}
        center
        styles={{
          modal: {
            background: useColorModeValue(
              'white',
              'var(--chakra-colors-gray-1100)',
            ),
          },
        }}
      >
        <BarcodeScannerComponent
          onUpdate={async (e, result) => {
            if (result) {
              setTickets([
                event.tickets.find((ticket) => ticket.id == result.getText()),
              ].filter((n) => n));
              setOpen(false);
              dismissQrReader();
            }
          }}
          stopStream={stopStream}
        />
      </Modal>
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
  query: { event: eventId },
}) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResult = await fetch(getEventWithTickets, {
    data: { id: eventId },
  });
  return {
    props: {
      event: eventResult.clear.event,
    },
  };
}
