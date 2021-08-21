import moment from 'moment';

export default function prettyDateRange(startDate, endDate){
    startDate = moment(startDate)
    endDate = moment(endDate)
    if (startDate.month() === endDate.month()) {
        return `${startDate.format('MMM Do')}`
    }
    return (
        <Box id={event.id} bg={"gray.50"} p={4} rounded={10} width="fit-content" {...props} as="a" href={`/events/${event.id}`} >
            <b>{event.name}</b>
            <Text>{event.eventGroup?.name || null}</Text>
            { (event.startDate && event.endDate)?
                startDate.month() === endDate.month()?
                    <Text>{startDate.format('MMM Do')}-{endDate.format('Do YYYY')}</Text> :
                    <Text>{startDate.format('MMM Do')}-{endDate.format('MMM Do YYYY')}</Text>: <></>
            }
        </Box>
    )
}
