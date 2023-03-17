import React, { useRef, useState } from 'react';
import {
  Box, Button, Image, NextLink, Text,
} from '@codeday/topo/Atom';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import ReactHtmlParser from 'react-html-parser';
import { useSession } from 'next-auth/react';
import { UiUpload } from '@codeday/topocons';
import { useToasts } from '@codeday/topo/utils';
import InfoBox from './InfoBox';
import { DeleteEventRestrictionModal, UpdateEventRestrictionModal } from './forms/EventRestriction';
import Notes from './forms/Notes';
import { SetEventRestrictionNotesMutation } from './forms/Notes.gql';
import { useFetcher } from '../fetch';
import { UploadEventRestrictionIconMutation } from './forms/EventRestriction.gql';
import Alert from './Alert';

const WARN_FILE_SIZE = 1024 * 1024 * 5;
const MAX_FILE_SIZE = 1024 * 1024 * 125;
const MIME_IMAGE = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];

function Highlight({ children }) {
  return <Text as="span" bold color="brand.700">{children}</Text>;
}

function transform(node) {
  if (node.type === 'tag' && node.name === 'strong') {
    return <Highlight>{node.children[0].data}</Highlight>;
  }
  if (node.type === 'tag' && node.name === 'a' && node.attribs.href) {
    if (node.children[0].data.startsWith('btn ')) {
      return <Button as="a" href={node.attribs.href}>{node.children[0].data.slice(3)}</Button>;
    }
    return <NextLink to={node.attribs.href}>{node.children[0].data}</NextLink>;
  }
}

export default function EventRestriction({ eventRestriction, ...props }) {
  const session = useSession();
  const fetch = useFetcher(session);
  const uploaderRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState(eventRestriction.iconUri);
  const [uploading, setUploading] = useState(false);
  const { success, error, info } = useToasts();

  return (
    <InfoBox
      id={eventRestriction.id}
      heading={eventRestriction.name}
      buttons={(
        <>
          <UpdateEventRestrictionModal eventrestriction={eventRestriction} />
          <DeleteEventRestrictionModal eventrestriction={eventRestriction} />
        </>
)}
    >
      <InfoBox heading="Preview" nested>
        <Image
          src={eventRestriction.iconUri}
          width={24}
          display="block"
          ml="auto"
          mr="auto"
          mb={5}
          onClick={
                        () => uploaderRef.current.click()
                    }
        />
        <input
          type="file"
          ref={uploaderRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            let type = null;
            if (MIME_IMAGE.includes(file.type)) type = 'IMAGE';
            if (!type) {
              error('Only images are supported.');
              return;
            }

            if (file.size > MAX_FILE_SIZE) {
              error(`You might have a problem uploading files larger than ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`);
            }

            const reader = new FileReader();
            reader.onload = function (el) {
              setLogoUrl(el.target.result.iconUri);
            };
            reader.readAsDataURL(file);

            if (file.size > WARN_FILE_SIZE) {
              info(`Your file is uploading, but at ${Math.floor(file.size / (1024 * 1024))}MB, it might take a while.`);
            } else {
              info(`Your file is uploading.`);
            }
            try {
              setUploading(true);
              const result = await fetch(UploadEventRestrictionIconMutation, { where: { id: eventRestriction.id }, file });
              success('Icon Uploaded!');
              setLogoUrl(result.iconUri);
            } catch (e) {
              error(e.toString());
            }
            setUploading(false);
          }}
        />
        {!eventRestriction.iconUri ? (
          <>
            <Alert>No Icon </Alert>
            <Button onClick={() => uploaderRef.current.click()}>
              <UiUpload /> Upload Icon
            </Button>
          </>
        ) : null}
        <Text bold>
          {ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.title || '')), { transform })}
        </Text>
        <Text>
          {ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.details || '')), { transform })}
        </Text>
      </InfoBox>
      <br />
      <Notes
        nested
        notes={eventRestriction.notes}
        updateMutation={SetEventRestrictionNotesMutation}
        updateId={eventRestriction.id}
      />
    </InfoBox>
  );
}

export function EventRestrictionPreview({ eventRestriction, ...props }) {
  return (
    <Box>
      <Image
        src={eventRestriction.icon.url}
        width={24}
        display="block"
        ml="auto"
        mr="auto"
        mb={5}
      />
      <Text bold>
        {ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.title || '')), { transform })}
      </Text>
      <Text>
        {ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.details || '')), { transform })}
      </Text>
    </Box>
  );
}
