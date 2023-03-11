import React, { useState, useRef, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  TextInput,
  InputGroup,
  InputRightElement,
  FormControl,
  Select,
  HStack,
  Switch,
  Spinner,
} from "@codeday/topo/Atom";
import useSwr from 'swr';
import { getEvent, getTickets, getWaiverBook } from "./index.gql";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import Ticket from "../../../../components/Ticket";
import Page from "../../../../components/Page";
import { getFetcher, useFetcher } from "../../../../fetch";
import { CreateTicketModal } from "../../../../components/forms/Ticket";
import CheckinCounter from '../../../../components/CheckinCounter';
import { CSVLink } from "react-csv";
import { UiDownload, Camera } from "@codeday/topocons/Icon";
import { useColorModeValue } from "@codeday/topo/Theme";
import { useRouter } from "next/router";
import { Icon } from "@chakra-ui/react";

function sortFn(sort, tickets) {
  switch (sort) {
    case "alphabetical-last":
      return [...tickets].sort((a, b) => a.lastName.localeCompare(b.lastName));
    case "alphabetical-first":
      return [...tickets].sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );
    case "age-dec":
      return [...tickets].sort((a, b) => b.age - a.age);
    case "age-asc":
      return [...tickets].sort((a, b) => a.age - b.age);
    case "date-dec":
      return [...tickets].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
    case "date-asc":
      return [...tickets].sort(
        (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
      );
  }
}

export default function Tickets({ event }) {
  const router = useRouter();
  const fetcher = useFetcher();
  const { data, isValidating } = useSwr([getTickets, { data: { id: event.id } }], fetcher, { revalidateOnFocus: true, refreshInterval: 60 * 1000 });
  const [waiversLoading, setWaiversLoading] = useState(false);
  const [waiverBookUrl, setWaiverBookUrl] = useState(null);
  const headers = [
    "firstName",
    "lastName",
    "age",
    "email",
    "phone",
    "whatsApp",
    "type",
    "guardianFirstName",
    "guardianLastName",
    "guardianEmail",
    "guardianPhone",
    "guardianWhatsApp",
    "waiverSigned",
    "waiverUrl",
    "organization"
  ];
  const csv = (data?.clear?.event?.tickets || [])
    .map((t) =>
      [
        t.firstName,
        t.lastName,
        t.age,
        t.email,
        t.phone,
        t.whatsApp,
        t.type,
        t.guardian?.firstName || "",
        t.guardian?.lastName || "",
        t.guardian?.email || "",
        t.guardian?.phone || "",
        t.guardian?.whatsApp || "",
        t.waiverSigned ? 'signed' : 'not signed',
        t.waiverUrl,
        t.organization || "",
      ].join(",")
    )
    .join(`\n`);
  const [tickets, setTickets] = useState(
    (data?.clear?.event?.tickets || []).sort((a, b) => a.lastName.localeCompare(b.lastName))
  );
  if (!event) return <Page />;
  return (
    <Page title={`${event.name} Tickets`}>
      <Breadcrumbs event={event} />
      <Heading>{event.name} Tickets {isValidating && <Spinner />}</Heading>
      <CreateTicketModal event={event} display="inline" pr={4} />
      <CSVExport
        display="inline"
        mr={4}
        data={csv}
        headers={headers}
        filename="tickets.csv"
      />
      <Button
        isLoading={waiversLoading}
        mr={4}
        onClick={async () => {
          if (waiverBookUrl) {
            window.open(waiverBookUrl);
            return;
          }
          setWaiversLoading(true);
          const resp = await fetcher(getWaiverBook, { data: { id: event.id } });
          setWaiverBookUrl(resp.clear.event.waiverBook);
          window.open(resp.clear.event.waiverBook);
          setWaiversLoading(false);
        }}
      >
        <Icon mr={2} as={UiDownload} />
        Download All Waivers
      </Button>
      <Button
        mr={4}
        onClick={() => router.push({ pathname: "tickets/scan/", query: { event: event?.id } })}
      >
        <Icon mr={2} as={Camera} />Scan Tickets
      </Button>
      <CheckinCounter event={event} borderWidth={1} mt={4} p={4} />
      <SortAndFilter
        tickets={data?.clear?.event?.tickets || []}
        setTickets={setTickets}
        event={event}
      ></SortAndFilter>

      <HStack spacing={4}>
        <Text>
          Avg Student Age:&nbsp;
          {Math.round(
            (tickets
              .filter((ticket) => ticket.type == "STUDENT")
              .reduce((partialSum, ticket) => partialSum + ticket.age, 0) /
              (data?.clear?.event?.tickets.filter((ticket) => ticket.type == "STUDENT") || [])
                .length) *
              10
          ) / 10}
        </Text>
        <Text>Total Tickets:&nbsp;{tickets.length}</Text>
        <Text>
          Students:&nbsp;
          {tickets.filter((ticket) => ticket.type == "STUDENT").length}
        </Text>
        <Text>
          Staff:&nbsp;
          {tickets.filter((ticket) => ticket.type != "STUDENT").length}
        </Text>
      </HStack>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
      >
        {tickets.map((ticket) => (
          <Ticket id={ticket.id} ticket={ticket} />
        ))}
      </Grid>
    </Page>
  );
}

export async function getServerSideProps({
  req,
  res,
  query: { event: eventId },
}) {
  const session = await getSession({ req });
  const fetch = getFetcher(session);
  if (!session) return { props: {} };
  const eventResult = await fetch(getEvent, {
    data: { id: eventId },
  });
  return {
    props: {
      event: eventResult.clear.event,
    },
  };
}

function SortAndFilter({ tickets, setTickets }) {
  const [waiver, setWaiver] = useState(true);
  const [checkedIn, setCheckedIn] = useState(true);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("alphabetical-last");

  useEffect(() => {
    let newTickets = tickets;
    if (waiver) {
      newTickets = sortFn(
        sort,
        tickets.filter((t) => t.waiverSigned === waiver) || []
      );
    }

    if (checkedIn) {
      newTickets = sortFn(
        sort,
        tickets.filter((t) =>
          checkedIn
            ? (t.checkedIn && t.checkedOut) ||
              (!t.checkedIn && !t.checkedOut)
            : t.checkedIn && !t.checkedOut
        )
      );
    }

    switch (filter) {
      case "student":
        newTickets = sortFn(
          sort,
          tickets.filter((t) => t.type === "STUDENT") || []
        );
        break;
      case "staff":
        newTickets = sortFn(
          sort,
          tickets.filter((t) => t.type !== "STUDENT") || []
        );
        break;
      case "waiver":
        newTickets = sortFn(
          sort,
          tickets.filter((t) => t.waiverSigned !== waiver) || []
        );
        break;

      case "checked-in":
        newTickets = sortFn(
          sort,
          tickets.filter((t) =>
            checkedIn
              ? t.checkedIn && !t.checkedOut
              : (t.checkedIn && t.checkedOut) ||
                (!t.checkedIn && !t.checkedOut)
          )
        );
        break;
      case "all":
      default:
        newTickets = sortFn(sort, tickets);
        break;
    }

    setTickets(sortFn(sort, newTickets));
  }, [sort, filter, waiver, checkedIn, tickets]);
  console.log(`rerender with ${tickets.length} tickets`)
  return (
    <HStack mt={4} w="100%" spacing={5}>
      <HStack>
        <Text w="fit-content">{"Sort By: "}</Text>
        <Select
          width="fit-content"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
          }}
        >
          <option value={"alphabetical-last"}>alphabetical, last name</option>
          <option value={"alphabetical-first"}>alphabetical, first name</option>
          <option value={"age-dec"}>age high-low</option>
          <option value={"age-asc"}>age low-high</option>
          <option value={"date-dec"}>signup date newest-oldest</option>
          <option value={"date-asc"}>signup date oldest-newest</option>
        </Select>
      </HStack>
      <HStack>
        <Text w="fit-content">{"Filter By: "}</Text>
        <Select
          width="fit-content"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        >
          <option value={"all"}>all</option>
          <option value={"student"}>student</option>
          <option value={"staff"}>staff</option>
          <option value={"waiver"}>waiver</option>
          <option value={"checked-in"}>checked in</option>
        </Select>
        {filter == "waiver" && (
          <>
            <Text>Missing Waiver? </Text>
            <Switch
              isChecked={waiver}
              onChange={() => {
                setWaiver(!waiver);
              }}
            ></Switch>
          </>
        )}
        {filter == "checked-in" && (
          <>
            <Text>Checked In? </Text>
            <Switch
              isChecked={checkedIn}
              onChange={() => {
                setCheckedIn(!checkedIn);
              }}
            ></Switch>
          </>
        )}
      </HStack>
    </HStack>
  );
}

export const CSVExport = ({
  data,
  headers,
  filename = "data.csv",
  ...props
}) => {
  const ref = useRef(null);
  return (
    <Button
      onClick={() => {
        ref && ref.current && ref.current.link.click();
      }}
      {...props}
    >
      <CSVLink
        style={{ display: "none" }}
        data={data}
        headers={headers}
        filename={filename}
        ref={ref}
      />
      <Icon mr={2} as={UiDownload} />
      Download as CSV
    </Button>
  );
};
