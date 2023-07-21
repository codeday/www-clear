import React, {useState} from "react";
import InfoBox from "../InfoBox";
import {Box, Button, Text, Textarea as TextareaInput} from "@codeday/topo/Atom";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import * as Icon from "@codeday/topocons"
import {useToasts} from "@codeday/topo/utils";
import {useFetcher} from "../../fetch";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

export default function EditSpecificMetadata({
    metadataKey,
    value,
    setMutation,
    updateId,
    displayKeyAs,
    description,
    placeholder,
    children,
    ...props
}: any) {
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tempValue, setTempValue] = useState(value) // Temporary value while the user is editing
    const {success, error} = useToasts();
    const { data: session } = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);
    const router = useRouter()

    const okButton = <Button
        h={6}
        disabled={loading}
        isLoading={loading}
        onClick={async () => {
            setLoading(true)
            try {

                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                await fetch(setMutation, {key: metadataKey, value: tempValue || '', id: updateId})
                await router.replace(router.asPath); // kind of clunky solution to refresh serverSideProps after update; https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
                setEditing(false) // wait to set editing until after request, so that in case of failure no data is lost
            } catch (ex) {

                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                error(ex.toString())
            }
            setLoading(false)


        }}><Icon.UiOk/></Button>
    const trashButton = <Button
        h={6}
        onClick={() => {
            setEditing(false)
        }}><Icon.UiX/></Button>
    const editButton = <Button
        h={6}
        onClick={() => {
            setEditing(true);
            setTempValue(value);
        }}><Icon.UiEdit/></Button>
    const buttons = editing ? <Box>{okButton} {trashButton}</Box> : editButton;
    return (
        <InfoBox
          heading={displayKeyAs? displayKeyAs : metadataKey}
          subHeading={description}
          buttons={buttons}
          mb={4}
          {...props}
        >
          <Box p={1}>
            {editing ?
                <TextareaInput
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder={placeholder}
                /> :
                value?.split("\n").map((val: any) => <Text>{val}</Text>)}
            {children}
          </Box>
        </InfoBox>
    );
}
