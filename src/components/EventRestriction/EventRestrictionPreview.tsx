import React from 'react';
import { Box, Button, Image, Link, Text, TextProps, Skeleton } from '@codeday/topo/Atom';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import ReactHtmlParser, { Transform } from 'react-html-parser';
import { CmsEventRestriction } from 'generated/gql/graphql';
import { graphql } from 'generated/gql';
import { BoxProps } from '@chakra-ui/react';
import { useQuery } from 'urql';
import assert from 'assert';

function Highlight({ children, ...props }: TextProps) {
  return (
    <Text as="span" bold color="brand.700" {...props}>
      {children}
    </Text>
  );
}

const transform: Transform = (node) => {
  if (node.type === 'tag' && node.name === 'strong') {
    return <Highlight>{node.children[0].data}</Highlight>;
  }
  if (node.type === 'tag' && node.name === 'a' && node.attribs.href) {
    if (node.children[0].data.startsWith('btn ')) {
      return (
        <Button as="a" href={node.attribs.href}>
          {node.children[0].data.slice(3)}
        </Button>
      );
    }
    return <Link href={node.attribs.href}>{node.children[0].data}</Link>;
  }
};

// TODO: make this better, we should use sys { id } instead (this change also needs to happen on clear-gql side)
const query = graphql(`
  query EventRestrictionPreview($where: CmsEventRestrictionFilter!) {
    cms {
      eventRestrictions(where: $where) {
        items {
          id
          title
          details
          icon {
            url
          }
        }
      }
    }
  }
`);

export type EventRestrictionPreviewProps = {
  eventRestriction: PropFor<CmsEventRestriction>;
} & BoxProps;

export function EventRestrictionPreview({
  eventRestriction: eventRestrictionData,
  ...props
}: EventRestrictionPreviewProps) {
  assert(eventRestrictionData.id);
  const [{ data }] = useQuery({ query, variables: { where: { id: eventRestrictionData.id } } });
  const eventRestriction = data?.cms?.eventRestrictions?.items[0];
  if (!eventRestriction) return <Skeleton h="100" />;
  return (
    <Box {...props}>
      <Image src={eventRestriction.icon?.url || undefined} width={24} display="block" ml="auto" mr="auto" mb={5} />
      <Text bold>{ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.title || '')), { transform })}</Text>
      <Text>{ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.details || '')), { transform })}</Text>
    </Box>
  );
}
