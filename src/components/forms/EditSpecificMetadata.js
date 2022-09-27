import React, {useState} from "react";
import InfoBox from "../InfoBox";
import {Box, Button, Text, Textarea as TextareaInput} from "@codeday/topo/Atom";
import * as Icon from "@codeday/topocons/Icon"
import {useToasts} from "@codeday/topo/utils";
import {useFetcher} from "../../fetch";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

export default function EditSpecificMetadata({ metadataKey, value, setMutation, updateId, displayKeyAs, description, placeholder, children, ...props}) {
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tempValue, setTempValue] = useState(value) // Temporary value while the user is editing
    const {success, error} = useToasts();
    const { data: session } = useSession();
    const fetch = useFetcher(session);
    const router = useRouter()

    const okButton = <Button
        h={6}
        disabled={loading}
        isLoading={loading}
        onClick={async () => {
            setLoading(true)
            try {
                await fetch(setMutation, {key: metadataKey, value: tempValue || '', id: updateId})
                await router.replace(router.asPath); // kind of clunky solution to refresh serverSideProps after update; https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
                setEditing(false) // wait to set editing until after request, so that in case of failure no data is lost
            } catch (ex) {
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
                value?.split("\n").map((val) => <Text>{val}</Text>)}
            {children}
          </Box>
        </InfoBox>
    )
}
