// import React, { useState } from 'react';
// import Form from '@rjsf/chakra-ui';

import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEvent } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { CreateModal } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

const eventFragment = graphql(`
  fragment EventForm on ClearEvent {
    id
    name
    startDate
    endDate
    ticketPrice
    earlyBirdPrice
    groupPrice
    earlyBirdCutoff
    registrationCutoff
    contentfulWebname
    managers
    timezone
    majorityAge
    minAge
    overnightMinAge
    maxAge
    requiresPromoCode
  }
`);

// import { Box, Button, Heading, Text } from '@codeday/topo/Atom';
// import { Modal } from 'react-responsive-modal';
// import 'react-responsive-modal/styles.css';

// import { UiAdd } from '@codeday/topocons';
// import { useColorModeValue } from '@codeday/topo/Theme';

// import { useToasts, useTheme } from '@codeday/topo/utils';
// import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/react';

// // @ts-expect-error TS(2307) FIXME: Cannot find module './Event.gql' or its correspond... Remove this comment to see the full error message
// import { CreateEventMutation, DeleteEventMutation, UpdateEventMutation } from './Event.gql';
// import { useFetcher } from '../../urqlclient';
// import { InfoAlert } from '../Alert';

// const schema = {
//   type: 'object',
//   properties: {
//     name: {
//       title: 'Name',
//       type: 'string',
//     },
//     startDate: {
//       title: 'Start Date',
//       type: 'string',
//       format: 'date',
//     },
//     endDate: {
//       title: 'End Date',
//       type: 'string',
//       format: 'date',
//     },
//     ticketPrice: {
//       title: 'Ticket Price',
//       type: 'number',
//       multipleOf: 0.01,
//     },
//     earlyBirdPrice: {
//       title: 'Early Bird Ticket Price',
//       type: 'number',
//       multipleOf: 0.01,
//     },
//     groupPrice: {
//       type: 'number',
//       multipleOf: 0.01,
//       title: 'School Group Price',
//     },
//     earlyBirdCutoff: {
//       title: 'Early Bird Registration Cutoff',
//       description: 'Usually set to a month before the event',
//       type: 'string',
//       format: 'date',
//     },
//     registrationCutoff: {
//       title: 'Registration Cutoff',
//       type: 'string',
//       format: 'date',
//     },
//     contentfulWebname: {
//       title: 'Contentful region ID',
//       type: 'string',
//     },
//     managers: {
//       title: 'Regional Managers',
//       type: 'array',
//       uniqueItems: true,
//       items: {
//         type: 'string',
//       },
//     },
//     timezone: {
//       title: 'Timezone (IANA)',
//       type: 'string',
//     },
//     majorityAge: {
//       title: 'Age of majority',
//       type: 'number',
//       default: 18,
//     },
//     overnightMinAge: {
//       title: 'Minimum age to stay overnight',
//       type: 'number',
//       default: 14,
//     },
//     minAge: {
//       title: 'Minimum age to register',
//       type: 'number',
//       default: 12,
//     },
//     maxAge: {
//       title: 'Maximum age to register',
//       type: 'number',
//       default: 25,
//     },
//     requiresPromoCode: {
//       type: 'boolean',
//       title: 'Requires Promo Code',
//     },
//   },
// };

// const uiSchema = {
//   managers: {
//     'ui:options': {
//       orderable: false,
//     },
//     'ui:description': '(CodeDay Account usernames)',
//     chakra: {
//       color: 'blue.200',
//     },
//   },
//   requiresPromoCode: {
//     'ui:help':
//       'Should people only be allowed to register if they have a promo code? (For instance if the event is invite-only) This should most of the time be false.',
//   },
// };

// export function CreateEventModal({ group, children, ...props }: any) {
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     startDate: moment(group.startDate).utc().format('YYYY-MM-DD'),
//     endDate: moment(group.endDate).utc().format('YYYY-MM-DD'),
//     ticketPrice: group.ticketPrice,
//     earlyBirdPrice: group.earlyBirdPrice,
//     groupPrice: group.groupPrice,
//     earlyBirdCutoff: moment(group.earlyBirdCutoff).utc().format('YYYY-MM-DD'),
//     registrationCutoff: moment(group.registrationCutoff).utc().format('YYYY-MM-DD'),
//   });
//   const { data: session } = useSession();

//   // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
//   const fetch = useFetcher(session);
//   const [loading, setLoading] = useState(false);
//   const { success, error } = useToasts();
//   const onOpenModal = () => setOpen(true);
//   const onCloseModal = () => setOpen(false);
//   const router = useRouter();

//   return (
//     <Box {...props}>
//       <Button onClick={onOpenModal}>
//         {children || (
//           <>
//             <Icon.UiAdd />
//             Add Event
//           </>
//         )}
//       </Button>
//       <Modal
//         open={open}
//         onClose={onCloseModal}
//         center
//         styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}
//       >
//         <Heading>Create Event</Heading>
//         <InfoAlert>Default values have been autofilled from the Event Group</InfoAlert>
//         <Form
//           uiSchema={uiSchema}
//           // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { name: { title:... Remove this comment to see the full error message
//           schema={schema}
//           formData={formData}
//           onChange={(data) => setFormData(data.formData)}
//         >
//           <Button
//             isLoading={loading}
//             disabled={loading}
//             onClick={async () => {
//               setLoading(true);
//               try {
//                 // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
//                 await fetch(CreateEventMutation, {
//                   data: {
//                     ...formData,
//                     managers: {
//                       // @ts-expect-error TS(2339) FIXME: Property 'managers' does not exist on type '{ star... Remove this comment to see the full error message
//                       set: formData.managers || [],
//                     },
//                     eventGroup: {
//                       connect: { id: group.id },
//                     },
//                   },
//                 });
//                 await router.replace(router.asPath);
//                 success('Event Created');
//                 onCloseModal();
//               } catch (ex) {
//                 // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
//                 error(ex.toString());
//               }
//               setLoading(false);
//             }}
//           >
//             Submit
//           </Button>
//         </Form>
//       </Modal>
//     </Box>
//   );
// }

// export function UpdateEventModal({ event, children, ...props }: any) {
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     ...event,
//     startDate: moment(event.startDate).utc().format('YYYY-MM-DD'),
//     endDate: moment(event.endDate).utc().format('YYYY-MM-DD'),
//     earlyBirdCutoff: moment(event.earlyBirdCutoff).utc().format('YYYY-MM-DD'),
//     registrationCutoff: moment(event.registrationCutoff).utc().format('YYYY-MM-DD'),
//   });
//   const { data: session } = useSession();

//   // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
//   const fetch = useFetcher(session);
//   const [loading, setLoading] = useState(false);
//   const { success, error } = useToasts();
//   const theme = useTheme();
//   const onOpenModal = () => setOpen(true);
//   const onCloseModal = () => setOpen(false);
//   const router = useRouter();

//   function formDataToUpdateInput(formData: any) {
//     const ret = {};
//     Object.keys(schema.properties).map((key) => {
//       // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
//       if (formData[key] !== event[key]) ret[key] = { set: formData[key] };
//     });
//     return ret;
//   }
//   return (
//     <Box display="inline" {...props}>
//       <Button display="inline" onClick={onOpenModal}>
//         {children || <Icon.UiEdit />}
//       </Button>
//       <Modal
//         open={open}
//         onClose={onCloseModal}
//         center
//         styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}
//       >
//         <Form
//           uiSchema={uiSchema}
//           // @ts-expect-error TS(2322) FIXME: Type '{ type: string; properties: { name: { title:... Remove this comment to see the full error message
//           schema={schema}
//           formData={formData}
//           onChange={(data) => setFormData(data.formData)}
//         >
//           <Button
//             isLoading={loading}
//             disabled={loading}
//             onClick={async () => {
//               setLoading(true);
//               try {
//                 // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
//                 await fetch(UpdateEventMutation, {
//                   where: { id: event.id },
//                   data: formDataToUpdateInput(formData),
//                 });
//                 await router.replace(router.asPath);
//                 success('Event Updated');
//                 onCloseModal();
//               } catch (ex) {
//                 // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
//                 error(ex.toString());
//               }
//               setLoading(false);
//             }}
//           >
//             Submit
//           </Button>
//         </Form>
//       </Modal>
//     </Box>
//   );
// }

// export function DeleteEventModal({ event, children, ...props }: any) {
//   const [open, setOpen] = useState(false);
//   const { data: session } = useSession();

//   // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
//   const fetch = useFetcher(session);
//   const [loading, setLoading] = useState(false);
//   const { success, error } = useToasts();
//   const onOpenModal = () => setOpen(true);
//   const onCloseModal = () => setOpen(false);
//   const router = useRouter();

//   return (
//     <Box display="inline">
//       <Button display="inline" onClick={onOpenModal}>
//         {children || <Icon.UiTrash />}
//       </Button>
//       <Modal
//         open={open}
//         onClose={onCloseModal}
//         center
//         styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}
//       >
//         <Heading>Remove Event</Heading>
//         <Text>
//           Are you sure you want to delete this event?
//           <br />
//           There's no turning back!
//         </Text>
//         <Button
//           colorScheme="red"
//           disabled={loading}
//           isLoading={loading}
//           onClick={async () => {
//             setLoading(true);
//             try {
//               // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
//               await fetch(DeleteEventMutation, { where: { id: event.id } });
//               await router.replace(router.asPath);
//               success('Event Deleted');
//               onCloseModal();
//             } catch (ex) {
//               // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
//               error(ex.toString());
//             }
//             setLoading(false);
//           }}
//         >
//           <Icon.UiTrash />
//           <b>Delete Event</b>
//         </Button>
//         <Button onClick={onCloseModal}>
//           <Icon.UiX />
//           Cancel
//         </Button>
//       </Modal>
//     </Box>
//   );
// }

const CreateEventMutation = graphql(`
  mutation CreateEvent($data: ClearEventCreateInput!) {
    clear {
      createEvent(data: $data) {
        ...EventForm
      }
    }
  }
`);

export function CreateEvent() {
  return (
    <CreateModal
      mutation={CreateEventMutation}
      fields={{
        data: {
          earlyBirdCutoff: {
            _type: 'date-time',
            required: true,
          },
          earlyBirdPrice: {
            _type: 'number',
            required: true,
          },
          endDate: {
            _type: 'date-time',
            required: true,
          },
          eventGroup: {
            _type: 'connect',
            required: true,
            connect: {
              id: 'test',
            },
          },
          name: {
            _type: 'string',
            required: true,
          },
          registrationCutoff: {
            _type: 'date-time',
            required: true,
          },
          startDate: {
            _type: 'date-time',
            required: true,
          },
          ticketPrice: {
            _type: 'number',
            required: true,
          },
          managers: {
            _type: 'array',
            items: {
              _type: 'string',
              required: true,
            },
          },
        },
      }}
    />
  );
}

const updateEventMutation = graphql(`
  mutation UpdateEvent($where: ClearEventWhereUniqueInput!, $data: ClearEventUpdateInput!) {
    clear {
      updateEvent(where: $where, data: $data) {
        ...EventForm
      }
    }
  }
`);

const updateEventQuery = graphql(`
  query EventForUpdate($where: ClearEventWhereUniqueInput!) {
    clear {
      event(where: $where) {
        ...EventForm
      }
    }
  }
`);

export type UpdateEventProps = {
  event: PropFor<ClearEvent>;
} & Omit<UpdateModalProps<typeof updateEventMutation>, 'fields' | 'mutation'>;

export function UpdateEvent({ event: eventData, ...props }: UpdateEventProps) {
  const [{ data }] = useQuery({ query: updateEventQuery, variables: { where: { id: eventData.id } } });
  const event = data?.clear?.event;
  if (!event) return <Spinner />;

  return (
    <UpdateModal
      mutation={updateEventMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: event.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
        data: {
          name: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: event.name,
              },
            },
          },
          startDate: {
            _type: 'update',
            set: {
              _type: 'date-time',
              schema: {
                default: event.startDate.toISO(),
              },
            },
          },
          endDate: {
            _type: 'update',
            set: {
              _type: 'date-time',
              schema: {
                default: event.endDate.toISO(),
              },
            },
          },
          ticketPrice: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: event.ticketPrice,
                multipleOf: 0.01,
              },
            },
          },
          earlyBirdPrice: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: event.earlyBirdPrice,
                multipleOf: 0.01,
              },
            },
          },
          groupPrice: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: event.groupPrice,
                multipleOf: 0.01,
              },
            },
          },
          earlyBirdCutoff: {
            _type: 'update',
            set: {
              _type: 'date-time',
              schema: {
                default: event.earlyBirdCutoff.toISO(),
              },
            },
          },
          registrationCutoff: {
            _type: 'update',
            set: {
              _type: 'date-time',
              schema: {
                default: event.registrationCutoff.toISO(),
              },
            },
          },
          contentfulWebname: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: event.contentfulWebname,
              },
            },
          },
          managers: {
            // @ts-ignore TODO:  typing error
            _type: 'array',
            update: true,
            set: {
              _type: 'array',
              items: {
                _type: 'string',
                uiSchema: {
                  'ui:options': {
                    orderable: false,
                  },
                },
              },
              schema: {
                default: event.managers,
              },
            },
          },
          timezone: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: event.timezone,
              },
            },
          },
          majorityAge: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: event.majorityAge,
              },
            },
          },
          overnightMinAge: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: event.overnightMinAge,
              },
            },
          },
          minAge: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: event.minAge,
              },
            },
          },
          maxAge: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: event.maxAge,
              },
            },
          },
          requiresPromoCode: {
            _type: 'update',
            set: {
              _type: 'boolean',
              schema: {
                default: event.requiresPromoCode,
              },
            },
          },
        },
      }}
      {...props}
    />
  );
}

const deleteEventMutation = graphql(`
mutation DeleteEvent($where: ClearEventWhereUniqueInput!) {
  clear {
    deleteEvent(where: $where) {
      id
    }
  }
}
`)

export type DeleteEventProps = {
  event: PropFor<ClearEvent>;
} & Omit<DeleteModalProps<typeof deleteEventMutation>, 'mutation' | 'where'>;

export function DeleteEvent({ event, ...props }: DeleteEventProps) {
  return (
    <DeleteModal mutation={deleteEventMutation} where={{ id: event.id }} {...props} />
  )
};
