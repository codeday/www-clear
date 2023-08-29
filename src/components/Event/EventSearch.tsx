import { Box, BoxProps, Kbd, Spinner } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { OptionBase, Select } from 'chakra-react-select';
import { graphql } from 'generated/gql';
import { ClearEvent } from 'generated/gql/graphql';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery } from 'urql';

function DropdownIndicator() {
  return (
    <Box h="100%" mx={1} p={0}>
      <Kbd>ctrl</Kbd> + <Kbd>K</Kbd>
    </Box>
  );
}

const query = graphql(`
  query EventSearch($where: ClearEventWhereInput!) {
    clear {
      events(where: $where) {
        id
        name
        eventGroup {
          id
          name
        }
      }
    }
  }
`);

export type EventSearchProps = {
  events: PropFor<ClearEvent>[];
} & BoxProps;

interface SelectOption extends OptionBase {
  label: string;
  value: string;
}

export function EventSearch({ events: eventsData }: EventSearchProps) {
  const [{ data }] = useQuery({ query, variables: { where: { id: { in: eventsData.map((e) => e.id) } } } });
  const router = useRouter();
  const searchBar = useRef<React.ElementRef<typeof Select<SelectOption>>>(null);
  const isLightMode = useColorModeValue(true, false);

  useHotkeys(
    'ctrl+k',
    () => {
      if (searchBar.current) {
        searchBar.current.focus();
      }
    },
    { preventDefault: true },
  );

  useHotkeys(
    'esc',
    () => {
      if (searchBar.current) {
        searchBar.current.blur();
      }
    },
    { enableOnFormTags: true },
  );

  const events = data?.clear?.events;
  if (!events) return <Spinner />;
  const options: SelectOption[] = events.map((event) => ({
    label: `${event.name} (${event.eventGroup?.name})`,
    value: event.id,
  }));

  return (
    <Box rounded="md" boxShadow="base" mb={4}>
      <Select<SelectOption>
        useBasicStyles
        ref={searchBar}
        options={options}
        placeholder="Search Events"
        chakraStyles={{
          menuList: (provided) => ({
            ...provided,
            background: isLightMode ? 'white' : 'gray.1100',
          }),
          option: (provided, state) => ({
            ...provided,
            bg: state.isFocused ? (isLightMode ? 'gray.100' : 'gray.800') : isLightMode ? 'white' : 'gray.1100',
          }),
        }}
        components={{
          DropdownIndicator,
        }}
        onChange={async (e) => {
          if (e) {
            await router.push(`events/${e.value}`);
          }
        }}
      />
    </Box>
  );
}
