import React, { useState } from "react";
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
} from "@codeday/topo/Atom";
import { getEventWithTickets } from "./index.gql";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import Ticket from "../../../../components/Ticket";
import Page from "../../../../components/Page";
import { getFetcher } from "../../../../fetch";
import { CreateTicketModal } from "../../../../components/forms/Ticket";
import { CSVLink } from "react-csv";
import { UiDownload, UiSearch } from "@codeday/topocons/Icon";
import { useColorModeValue } from "@codeday/topo/Theme";

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
  }
}

export default function Tickets({ event }) {
  if (!event) return <Page />;
  const headers = [
    "firstName",
    "lastName",
    "age",
    "email",
    "phone",
    "type",
    "guardianFirstName",
    "guardianLastName",
    "guardianEmail",
    "guardianPhone",
  ];
  const csv = event.tickets
    .map((t) =>
      [
        t.firstName,
        t.lastName,
        t.age,
        t.email,
        t.phone,
        t.type,
        t.guardian?.firstName || "",
        t.guardian?.lastName || "",
        t.guardian?.email || "",
        t.guardian?.phone || "",
      ].join(",")
    )
    .join(`\n`);
  const [tickets, setTickets] = useState(
    [...event.tickets].sort((a, b) => a.lastName.localeCompare(b.lastName))
  );
  return (
    <Page title={event.name}>
      <Breadcrumbs event={event} />
      <Heading>{event.name} Tickets</Heading>
      <CreateTicketModal event={event} d="inline" pr={4} />
      <Button d="inline">
        <CSVLink data={csv} headers={headers} filename="tickets.csv">
          <UiDownload />
          Download as CSV
        </CSVLink>
      </Button>
      <SortAndFilter
        tickets={tickets}
        setTickets={setTickets}
        event={event}
      ></SortAndFilter>
      <HStack spacing={4}>
        <Text>
          Avg Student Age:&nbsp;
          {Math.round(
            (event.tickets
              .filter((ticket) => ticket.type == "STUDENT")
              .reduce((partialSum, ticket) => partialSum + ticket.age, 0) /
              event.tickets.filter((ticket) => ticket.type == "STUDENT")
                .length) *
              10
          ) / 10}
        </Text>
        <Text>Total Tickets:&nbsp;{event.tickets.length}</Text>
        <Text>
          Students:&nbsp;
          {event.tickets.filter((ticket) => ticket.type == "STUDENT").length}
        </Text>
        <Text>
          Staff:&nbsp;
          {event.tickets.filter((ticket) => ticket.type != "STUDENT").length}
        </Text>
      </HStack>

      <Box
        p={4}
        mt={8}
        mb={4}
        backgroundColor={useColorModeValue("blue.50", "blue.500")}
        borderColor={useColorModeValue("blue.500", "blue.50")}
        borderWidth={1}
        fontSize="lg"
      >
        <Text>
          Attendees/parents can e-sign missing waivers on their own phone. Have
          them show you the confirmation screen!
        </Text>
        <Text mb={0}>
          <Text as="span" bold>
            CodeDay.to/Waiver
          </Text>{" "}
          (under 18)
        </Text>
        <Text>
          <Text as="span" bold>
            CodeDay.to/AdultWaiver
          </Text>{" "}
          (over 18)
        </Text>
      </Box>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
      >
        {tickets.map((ticket) => (
          <Ticket ticket={ticket} />
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
  const eventResult = await fetch(getEventWithTickets, {
    data: { id: eventId },
  });
  return {
    props: {
      event: eventResult.clear.event,
    },
  };
}

function SortAndFilter({ tickets, setTickets, event }) {
  const [waiver, setWaiver] = useState(true);
  const [checkedIn, setCheckedIn] = useState(true);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("alphabetical-last");
  return (
    <HStack mt={4} w="100%" spacing={5}>
      <HStack>
        <Text w="fit-content">{"Sort By: "}</Text>
        <Select
          width="fit-content"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setTickets(sortFn(e.target.value, tickets));
          }}
        >
          <option value={"alphabetical-last"}>alphabetical, last name</option>
          <option value={"alphabetical-first"}>alphabetical, first name</option>
          <option value={"age-dec"}>age high-low</option>
          <option value={"age-asc"}>age low-high</option>
        </Select>
      </HStack>
      <HStack>
        <Text w="fit-content">{"Filter By: "}</Text>
        <Select
          width="fit-content"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            switch (e.target.value) {
              case "all":
                setTickets(sortFn(sort, event.tickets));
                break;
              case "student":
                setTickets(
                  sortFn(
                    sort,
                    event.tickets.filter((t) => t.type === "STUDENT")
                  )
                );
                break;
              case "staff":
                setTickets(
                  sortFn(
                    sort,
                    event.tickets.filter((t) => t.type !== "STUDENT")
                  )
                );
                break;
              case "waiver":
                setTickets(
                  sortFn(
                    sort,
                    event.tickets.filter((t) => t.waiverSigned !== waiver)
                  )
                );
                break;

              case "checked-in":
                setTickets(
                  sortFn(
                    sort,
                    event.tickets.filter((t) =>
                      checkedIn
                        ? t.checkedIn && !t.checkedOut
                        : (t.checkedIn && t.checkedOut) ||
                          (!t.checkedIn && !t.checkedOut)
                    )
                  )
                );
                break;
            }
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
                setTickets(
                  sortFn(
                    sort,
                    event.tickets.filter((t) => t.waiverSigned === waiver)
                  )
                );
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
                setTickets(
                  sortFn(
                    sort,
                    event.tickets.filter((t) =>
                      checkedIn
                        ? (t.checkedIn && t.checkedOut) ||
                          (!t.checkedIn && !t.checkedOut)
                        : t.checkedIn && !t.checkedOut
                    )
                  )
                );
              }}
            ></Switch>
          </>
        )}
      </HStack>
    </HStack>
  );
}
