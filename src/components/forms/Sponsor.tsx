// import React, { useState } from 'react';
// import Form from '@rjsf/chakra-ui';
// import { Box, Button, Heading, Text } from '@codeday/topo/Atom';
// import { Modal } from 'react-responsive-modal';
// import 'react-responsive-modal/styles.css';

import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEvent, ClearSponsor } from 'generated/gql/graphql';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

// // @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
// import * as Icon from '@codeday/topocons';
// import { useToasts } from '@codeday/topo/utils';
// import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/react';

// // @ts-expect-error TS(2307) FIXME: Cannot find module './Sponsor.gql' or its correspo... Remove this comment to see the full error message
// import { useColorModeValue } from '@codeday/topo/Theme';
// import { CreateSponsorMutation, DeleteSponsorMutation, UpdateSponsorMutation } from './Sponsor.gql';
// import { useFetcher } from '../../urqlclient';

// const schema = {
//   type: 'object',
//   properties: {
//     name: {
//       title: 'Name',
//       type: 'string',
//     },
//     link: {
//       title: 'Link',
//       type: 'string',
//     },
//     description: {
//       title: 'Description',
//       type: 'string',
//     },
//     amount: {
//       title: 'Sponsorship Amount',
//       type: 'integer',
//     },
//     perks: {
//       title: 'Perks',
//       type: 'string',
//     },
//     contactName: {
//       title: 'Contact Name',
//       type: 'string',
//     },
//     contactPhone: {
//       title: 'Contact Phone',
//       type: 'string',
//     },
//     contactEmail: {
//       title: 'Contact Email',
//       type: 'string',
//     },
//   },
// };

// const uiSchema = {
//   description: {
//     'ui:help':
//       '**WILL BE DISPLAYED TO PUBLIC** \n' +
//       'A short blurb describing the company (can be taken from their website/google)',
//   },
//   amount: {
//     'ui:help': 'If sponsorship was not cash (for example food) enter a rough estimate of the goods provided',
//   },
//   perks: {
//     'ui:help': 'Is the company providing something to CodeDay attendees?',
//   },
//   /* optional ui schema */
// };

// export function CreateSponsorModal({ event, children, ...props }: any) {
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState();
//   const { data: session } = useSession();

//   // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
//   const fetch = useFetcher(session);
//   const [loading, setLoading] = useState(false);
//   const { success, error } = useToasts();
//   const onOpenModal = () => setOpen(true);
//   const onCloseModal = () => setOpen(false);
//   const router = useRouter();

//   return (
//     <Box display="inline" {...props}>
//       <Button h={6} onClick={onOpenModal}>
//         {children || (
//           <>
//             <Icon.UiAdd />
//             Add Sponsor
//           </>
//         )}
//       </Button>
//       <Modal
//         open={open}
//         onClose={onCloseModal}
//         center
//         styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}
//       >
//         <Heading>Create Sponsor</Heading>
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
//                 await fetch(CreateSponsorMutation, {
//                   data: {
//                     // @ts-expect-error TS(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
//                     ...formData,
//                     event: {
//                       connect: {
//                         id: event.id,
//                       },
//                     },
//                   },
//                 });
//                 await router.replace(router.asPath);
//                 success('Sponsor Created');
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

// export function UpdateSponsorModal({ sponsor, children, ...props }: any) {
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState(sponsor);
//   const { data: session } = useSession();

//   // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
//   const fetch = useFetcher(session);
//   const [loading, setLoading] = useState(false);
//   const { success, error } = useToasts();
//   const onOpenModal = () => setOpen(true);
//   const onCloseModal = () => setOpen(false);
//   const router = useRouter();

//   function formDataToUpdateInput(formData: any) {
//     const ret = {};
//     Object.keys(schema.properties).map((key) => {
//       // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
//       if (formData[key] !== sponsor[key]) ret[key] = { set: formData[key] };
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
//                 await fetch(UpdateSponsorMutation, {
//                   where: { id: sponsor.id },
//                   data: formDataToUpdateInput(formData),
//                 });
//                 await router.replace(router.asPath);
//                 success('Sponsor Updated');
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

// export function DeleteSponsorModal({ sponsor, children, ...props }: any) {
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
//     <Box display="inline" {...props}>
//       <Button display="inline" onClick={onOpenModal}>
//         {children || <Icon.UiTrash />}
//       </Button>
//       <Modal
//         open={open}
//         onClose={onCloseModal}
//         center
//         styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}
//       >
//         <Heading>Remove Sponsor</Heading>
//         <Text>
//           Are you sure you want to delete this Sponsor?
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
//               await fetch(DeleteSponsorMutation, { where: { id: sponsor.id } });
//               await router.replace(router.asPath);
//               success('Sponsor Deleted');
//               onCloseModal();
//             } catch (ex) {
//               // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
//               error(ex.toString());
//             }
//             setLoading(false);
//           }}
//         >
//           <Icon.UiTrash />
//           <b>Delete Sponsor</b>
//         </Button>
//         <Button onClick={onCloseModal}>
//           <Icon.UiX />
//           Cancel
//         </Button>
//       </Modal>
//     </Box>
//   );
// }

//     name: {
//       title: 'Name',
//       type: 'string',
//     },
//     link: {
//       title: 'Link',
//       type: 'string',
//     },
//     description: {
//       title: 'Description',
//       type: 'string',
//     },
//     amount: {
//       title: 'Sponsorship Amount',
//       type: 'integer',
//     },
//     perks: {
//       title: 'Perks',
//       type: 'string',
//     },
//     contactName: {
//       title: 'Contact Name',
//       type: 'string',
//     },
//     contactPhone: {
//       title: 'Contact Phone',
//       type: 'string',
//     },
//     contactEmail: {
//       title: 'Contact Email',
//       type: 'string',

const sponsorFormFragment = graphql(`
  fragment SponsorForm on ClearSponsor {
    id
    name
    link
    description
    amount
    perks
    contactName
    contactPhone
    contactEmail
    event {
      sponsors {
        id
      }
    }
  }
`);

const createSponsorMutation = graphql(`
  mutation CreateSponsor($data: ClearSponsorCreateInput!) {
    clear {
      createSponsor(data: $data) {
        ...SponsorForm
      }
    }
  }
`);

export type CreateSponsorProps = {
  event: PropFor<ClearEvent>;
} & Omit<CreateModalProps<typeof createSponsorMutation>, 'mutation' | 'fields'>;

export function CreateSponsor({ event, ...props }: CreateSponsorProps) {
  return (
    <CreateModal
      {...props}
      mutation={createSponsorMutation}
      headingProps={{ mb: -12 }}
      fields={{
        data: {
          event: {
            _type: 'connect',
            connect: {
              id: event.id,
            },
          },
          name: {
            _type: 'string',
            required: true,
          },
          link: {
            _type: 'string',
          },
          description: {
            _type: 'string',
          },
          amount: {
            _type: 'number',
            schema: {
              multipleOf: 1,
            },
          },
          perks: {
            _type: 'string',
          },
          contactName: {
            _type: 'string',
          },
          contactPhone: {
            _type: 'string',
          },
          contactEmail: {
            _type: 'string',
          },
        },
      }}
    />
  );
}

const updateSponsorMutation = graphql(`
  mutation UpdateSponsor($where: ClearSponsorWhereUniqueInput!, $data: ClearSponsorUpdateInput!) {
    clear {
      updateSponsor(data: $data, where: $where) {
        ...SponsorForm
      }
    }
  }
`);

const updateSponsorQuery = graphql(`
  query SponsorForUpdate($where: ClearSponsorWhereUniqueInput!) {
    clear {
      sponsor(where: $where) {
        ...SponsorForm
      }
    }
  }
`);

export type UpdateSponsorProps = {
  sponsor: PropFor<ClearSponsor>;
} & Omit<UpdateModalProps<typeof updateSponsorMutation>, 'mutation' | 'fields'>;

export function UpdateSponsor({ sponsor: sponsorData, ...props }: UpdateSponsorProps) {
  const [{ data }] = useQuery({ query: updateSponsorQuery, variables: { where: { id: sponsorData.id } } });
  const sponsor = data?.clear?.sponsor;
  if (!sponsor) return <Spinner />;

  return (
    <UpdateModal
      {...props}
      mutation={updateSponsorMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: sponsor.id,
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
                default: sponsor.name,
              },
            },
          },
          link: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: sponsor.link,
              },
            },
          },
          description: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: sponsor.description,
              },
            },
          },
          amount: {
            _type: 'update',
            set: {
              _type: 'number',
              schema: {
                default: sponsor.amount,
                multipleOf: 1,
              },
            },
          },
          perks: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: sponsor.perks,
              },
            },
          },
          contactName: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: sponsor.contactName,
              },
            },
          },
          contactPhone: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: sponsor.contactPhone,
              },
            },
          },
          contactEmail: {
            _type: 'update',
            set: {
              _type: 'string',
              schema: {
                default: sponsor.contactEmail,
              },
            },
          },
        },
      }}
    />
  );
}

const deleteSponsorMutation = graphql(`
  mutation DeleteSponsor($where: ClearSponsorWhereUniqueInput!) {
    clear {
      deleteSponsor(where: $where) {
        id
      }
    }
  }
`);

export type DeleteSponsorProps = {
  sponsor: PropFor<ClearSponsor>;
} & Omit<DeleteModalProps<typeof deleteSponsorMutation>, 'mutation' | 'where'>

export function DeleteSponsor({ sponsor, ...props }: DeleteSponsorProps) {
  return (
    <DeleteModal mutation={deleteSponsorMutation} where={{ id: sponsor.id }} {...props} />
  )
}
