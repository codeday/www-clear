import Select from '@codeday/topo/Atom/Input/Select';
import Box from '@codeday/topo/Atom/Box';

const options = {
    STUDENT: 'Student',
    TEACHER: 'Teacher',
    STAFF: 'Staff',
    JUDGE: 'Judge',
    MENTOR: 'Mentor',
    VIP: 'VIP'
}

export default function SelectTicketType({value, placeholder, onChange, ...props}) {
    return (
        <Box d="inline-block" {...props}>
        <Select d="inline-block" onChange={onChange} placeholder={placeholder}>
            {Object.keys(options).map((k) => (
                <option selected={value === k} value={k}>{options[k]}</option>
            ))}
        </Select>
        </Box>
    )
}
