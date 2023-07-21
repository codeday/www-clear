import React, { useState } from "react";
import dynamic from "next/dynamic";
import Page from "../../../../components/Page";
import {
  Button,
  TextInput,
  InputGroup,
  InputRightElement,
  FormControl,
} from "@codeday/topo/Atom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useColorModeValue } from "@codeday/topo/Theme";
import Ticket from "../../../../components/Ticket";

// @ts-expect-error TS(2307) FIXME: Cannot find module './scan.gql' or its correspondi... Remove this comment to see the full error message
import { getEventWithTickets } from "./scan.gql";
import { getSession } from "next-auth/react";
import { getFetcher } from "../../../../fetch";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import UiSearch from "@codeday/topocons/UiSearch";

const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

export default function Scan({
  event
}: any) {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState(null);

  const [stopStream, setStopStream] = useState(false);
  const dismissQrReader = () => {
    setStopStream(true);
    setTimeout(() => setOpen(false), 0);
  };

  return (
    <Page>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTickets(
            event?.tickets?.filter((ticket: any) => ticket.lastName.toLowerCase().startsWith(search.toLowerCase())
            )
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
        w={"100%"}
        onClick={() => {
          setOpen(true);
        }}
      >
        Scan New Ticket
      </Button>

      {tickets &&
        event &&

        // @ts-expect-error TS(2339) FIXME: Property 'length' does not exist on type 'never'.
        tickets?.length > 0 &&

        // @ts-expect-error TS(2339) FIXME: Property 'map' does not exist on type 'never'.
        tickets.map((ticket: any) => <Ticket ticket={ticket} eventId={event?.id}></Ticket>)}
      // @ts-expect-error TS(2339): Property 'length' does not exist on type 'never'.
      // @ts-expect-error TS(2339) FIXME: Property 'length' does not exist on type 'never'.
      {tickets && event && !(tickets?.length > 0) && "Ticket not found"}

      <Modal
        open={open}
        onClose={onCloseModal}
        center
        styles={{
          modal: {
            background: useColorModeValue(
              "white",
              "var(--chakra-colors-gray-1100)"
            ),
          },
        }}
      >
        <BarcodeScannerComponent
          onUpdate={async (e, result) => {
            if (result) {

              // @ts-expect-error TS(2345) FIXME: Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
              setTickets([
                event.tickets.find((ticket: any) => ticket.id == result.getText()),
              ].filter(n => n));
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

export async function getServerSideProps({
  req,
  res,
  query: { event: eventId }
}: any) {
  const session = await getSession({ req });

  // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
  const fetch = getFetcher(session);
  if (!session) return { props: {} };

  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
  const eventResult = await fetch(getEventWithTickets, {
    data: { id: eventId },
  });
  return {
    props: {
      event: eventResult.clear.event,
    },
  };
}
