import React, {useRef, useState} from 'react';
import {Box, Button, Image, Link, Text} from "@codeday/topo/Atom";
import InfoBox from "./InfoBox";
import {DeleteEventRestrictionModal, UpdateEventRestrictionModal} from "./forms/EventRestriction";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'mark... Remove this comment to see the full error message
import {marked} from "marked";
import DOMPurify from 'isomorphic-dompurify';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ReactHtmlParser from 'react-html-parser';
import Notes from "./forms/Notes";

// @ts-expect-error TS(2307) FIXME: Cannot find module './forms/Notes.gql' or its corr... Remove this comment to see the full error message
import {SetEventRestrictionNotesMutation} from "./forms/Notes.gql"
import {useSession} from "next-auth/react";
import {useFetcher} from "../fetch";

// @ts-expect-error TS(2307) FIXME: Cannot find module './forms/EventRestriction.gql' ... Remove this comment to see the full error message
import {UploadEventRestrictionIconMutation} from "./forms/EventRestriction.gql";
import Alert from "./Alert";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import {UiUpload} from "@codeday/topocons/Icon";
import {useToasts} from "@codeday/topo/utils";

const WARN_FILE_SIZE = 1024 * 1024 * 5
const MAX_FILE_SIZE = 1024 * 1024 * 125
const MIME_IMAGE = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml']

function Highlight({
    children
}: any) {
    return <Text as="span" bold color="brand.700">{children}</Text>;
}

function transform(node: any) {
    if(node.type === "tag" && node.name === "strong") {
        return <Highlight>{node.children[0].data}</Highlight>
    }
    if(node.type === "tag" && node.name === "a" && node.attribs.href) {
        if(node.children[0].data.startsWith('btn ')) {
            return <Button as="a" href={node.attribs.href}>{node.children[0].data.slice(3)}</Button>
        }
        return <Link to={node.attribs.href}>{node.children[0].data}</Link>
    }
}

export default function EventRestriction({
    eventRestriction,
    ...props
}: any) {
    const session = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const uploaderRef = useRef(null);
    const [logoUrl, setLogoUrl] = useState(eventRestriction.iconUri);
    const [uploading, setUploading] = useState(false);
    const { success, error, info } = useToasts();

    return (
        <InfoBox
            id={eventRestriction.id}
            heading={eventRestriction.name}
            buttons={<>
                <UpdateEventRestrictionModal eventrestriction={eventRestriction} />
                <DeleteEventRestrictionModal eventrestriction={eventRestriction} />
                </>}
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

                        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                        () => uploaderRef.current.click()
                    }/>
                <input
                    type="file"
                    ref={uploaderRef}
                    accept="image/*"
                    style={{display: 'none'}}
                    onChange={async (e) => {

                        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
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

                        var reader = new FileReader();
                        reader.onload = function(el) {

                            // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                            setLogoUrl(el.target.result.iconUri)
                        }
                        reader.readAsDataURL(file);

                        if (file.size > WARN_FILE_SIZE) {
                            info(`Your file is uploading, but at ${Math.floor(file.size / (1024 * 1024))}MB, it might take a while.`)
                        } else {
                            info(`Your file is uploading.`);
                        }
                        try {
                            setUploading(true);

                            // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                            const result = await fetch(UploadEventRestrictionIconMutation, { where: {id: eventRestriction.id}, file })
                            success('Icon Uploaded!')
                            setLogoUrl(result.iconUri);
                        } catch (e) {

                            // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                            error(e.toString())
                        }
                        setUploading(false)
                    }}
                />
                {!eventRestriction.iconUri? <>
                    <Alert>No Icon </Alert>
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                    <Button onClick={() => uploaderRef.current.click()}>
                        <UiUpload/> Upload Icon
                    </Button>
                </> : null}
                 <Text bold>
                        {ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.title || '')), {transform})}
                </Text>
                <Text>
                        {ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.details || '')), {transform})}
                </Text>
            </InfoBox>
            <br/>
            <Notes
                nested
                notes={eventRestriction.notes}
                updateMutation={SetEventRestrictionNotesMutation}
                updateId={eventRestriction.id}
            />
        </InfoBox>
    );
}

export function EventRestrictionPreview({
    eventRestriction,
    ...props
}: any) {
    return (
            <Box>
                <Image
                    src={eventRestriction?.icon?.url}
                    width={24}
                    display="block"
                    ml="auto"
                    mr="auto"
                    mb={5}/>
                <Text bold>
                    {ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.title || '')), {transform})}
                </Text>
                <Text>
                    {ReactHtmlParser(DOMPurify.sanitize(marked.parse(eventRestriction.details || '')), {transform})}
                </Text>
            </Box>
    );
}
