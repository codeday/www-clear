import React, {useState} from "react";
import {Box, Switch, Text, Checkbox, Stack, Tooltip, Divider} from "@codeday/topo/Atom"

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import { UiInfo } from "@codeday/topocons/Icon"
import Alert, {WarningAlert} from "./Alert"
import InfoBox from "./InfoBox"
import {useFetcher} from "../fetch";
import {useToasts} from "@codeday/topo/utils"

// @ts-expect-error TS(2307) FIXME: Cannot find module './RegistrationsToggleWithCheck... Remove this comment to see the full error message
import {RegistrationsToggleMutation} from "./RegistrationsToggleWithChecklist.gql"
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

function CheckListItem({
  item,
  nested=false
}: any) {
  if(item.hide) return <></>
  if (!item.checklist || !item.check || !item.checklist.map((c: any) => c.check).includes(false)) {
    return (
      <Checkbox
        colorScheme="red"
        size={nested? "md" : "lg"}
        isFocusable={false}
        isReadOnly={true}
        isChecked={item.check}
      >
        <Tooltip label={item.description} ><Box>{item.name} { item.description ? <UiInfo /> : null }</Box></Tooltip>
      </Checkbox>)
  }
  return <>
    <Checkbox
      colorScheme="red"
      size={ nested? "md" : "lg"}
      isFocusable={false}
      isReadOnly={true}
      isIndeterminate={true}
    >
      {item.name}
    </Checkbox>
    <Stack pl={6} spacing={0}>
      {item.checklist.map((i: any) => <CheckListItem item={i} nested={true} />)}
    </Stack>
  </>;
}



export default function RegistrationsToggleWithChecklist({
  event,
  children,
  ...props
}: any) {
  const checklist = [
    {
      name: "Find a venue",
      check: Boolean(event.venue),
      requiredToOpen: true,
      checklist: [
        {
          name: "Enter Address",
          check: Boolean(event.venue?.address)
        },
        {
          name: "Enter Capacity",
          check: Boolean(event.venue?.capacity > 0)
        },
        {
          name: "Enter Contact Details",
          check: Boolean(event.venue?.contactName &&
            (event.venue?.contactEmail ||
              event.venue?.contactPhone))
        },
        {
          name: "Enter Map Link",
          check: Boolean(event.venue?.mapLink)
        }
      ]
    },
    {
      name: "Configure event restrictions",
      hide: Boolean(!event.venue),
      check: Boolean(event.eventRestrictions?.length > 0)
    },
    {
      name: "Create initial schedule",
      hide: Boolean(!event.venue),
      description: "This does not have to be the entire final schedule for your event! However, at a minimum, publish events for the start, end, and meals.",
      check: Boolean(event.schedule.filter((item: any) => {
        return item.finalized
      }).length > 0)
    },
    {
      name: "Open Registrations",
      check: Boolean(event.registrationsOpen)
    },
    {
      name: "Promote Event",
      check: Boolean(event.registrationsOpen),
      checklist: [
        {
          name: "Create a promo code",
          description: "Very few CodeDay attendees end up paying full price, and this is 100% intended! We recommend creating different promo codes for different schools/groups/etc you reach out to, this helps them feel special, as well as helps you track the most effective outreach methods!",
          check: Boolean(event.promoCodes.length > 0)
        },
        {
          name: "Your first registration!",
          check: Boolean(event.studentRegistrations.length > 0)
        },
        {
          name: "50% of capacity sold out!",
          check: Boolean(event.studentRegistrations.length > (event.venue?.capacity / 2))
        },
        {
          name: "100% of capacity sold out - wow!",
          check: Boolean(event.allRegistrations.length >= event.venue?.capacity )
        }

      ]
    }
  ]
  const disabled = Boolean(checklist.filter(c => c.requiredToOpen).map(c => c.check).includes(false))
  const [loading, setLoading] = useState(false);
  const {success, error} = useToasts();
  const { data: session } = useSession();

  // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
  const fetch = useFetcher(session);
  const router = useRouter();
  return (
    <InfoBox heading="Event Status" headingSize="xl">
      <Box fontSize="2xl" fontWeight="bold">
        <Text as="span">Registrations are&nbsp;</Text>
        {event.tickets.length >= event.venue?.capacity ? (
          <Text as="span" color="red.500">sold out.</Text>
        ) : (
          event.registrationsOpen ?
            <Text as="span" color="green">open.</Text> :
            <Text as="span" color="gray.500">closed.</Text>
        )}
      </Box>
      <Switch
        m={2}
        isChecked={event.registrationsOpen}
        isDisabled={(disabled && !event.registrationsOpen || loading)}
        size="lg"
        colorScheme="green"
        onChange={async (e) => {
          setLoading(true)
          try {

            // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
            await fetch(RegistrationsToggleMutation, {
              eventWhere: {id: event.id},
              data: e.target.checked
            })
            await router.replace(router.asPath); // kind of clunky solution to refresh serverSideProps after update; https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
            success(`Registrations ${e.target.checked ? "opened" : "closed"}`)
          } catch (ex) {

            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
            error(ex.toString())
          }
          setLoading(false)
        }}
      />
      {event.registrationsOpen && (
        <Text fontSize="sm">
          WARNING: Closing registrations will show the event as canceled. Registrations close as sold-out
          automatically when the venue capacity is reached.
        </Text>
      )}
      <Divider my={3} />
        {
          checklist.map(item => <CheckListItem item={item} />)
        }
    </InfoBox>
  )
}
