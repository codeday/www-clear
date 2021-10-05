import React, {useState} from 'react';
import Box from '@codeday/topo/Atom/Box';
import TextInput from '@codeday/topo/Atom/Input/Text';
import {Email, IdCard, UiCheck, UiEdit, UiTrash,} from '@codeday/topocons/Icon';
import Button from '@codeday/topo/Atom/Button';
import Text from '@codeday/topo/Atom/Text';

export default function CreatePerson({
                                         person, onChange, onRemove, ...props
                                     }) {
    const [editor, setEditor] = useState(true);
    if (editor) {
        return (
            <Box {...props}>
                <TextInput
                    placeholder="First Name"
                    width="50%"
                    value={person.firstName || ''}
                    onChange={(e) => {
                        person.firstName = e.target.value;
                        onChange(person);
                    }}
                />
                <TextInput
                    placeholder="Last Name"
                    width="50%"
                    value={person.lastName || ''}
                    onChange={(e) => {
                        person.lastName = e.target.value;
                        onChange(person);
                    }}
                />
                <TextInput
                    placeholder="Email"
                    value={person.email || ''}
                    onChange={(e) => {
                        person.email = e.target.value;
                        onChange(person);
                    }}
                />
                <TextInput
                    placeholder="Pronouns"
                    width="40%"
                    value={person.pronouns || ''}
                    onChange={(e) => {
                        person.pronouns = e.target.value;
                        onChange(person);
                    }}
                />
                <Button width="10%"
                        ml="40%"
                        onClick={() => setEditor(!editor)}
                        variant="ghost"
                        colorScheme="green"><UiCheck/></Button>
                <Button width="10%" onClick={onRemove} variant="ghost" colorScheme="red"><UiTrash/></Button>
            </Box>
        );
    }
    return (
        <Box {...props}>
            <Text><IdCard/>&nbsp;
                <b>{person.firstName} {person.lastName}</b> {person.pronouns ? `(${person.pronouns})` : null}</Text>
            {person.email ? <Text d="inline"><Email/>&nbsp;{person.email}</Text> : null}
            <Button width="10%" onClick={() => setEditor(!editor)} variant="ghost"><UiEdit/></Button>
            <Button width="10%" onClick={onRemove} variant="ghost" colorScheme="red"><UiTrash/></Button>
        </Box>
    );
}
