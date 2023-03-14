import React, { useState } from 'react';
import Form from '@rjsf/chakra-ui';
import {
  Box, Button, Heading, Text,
} from '@codeday/topo/Atom';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {
  UiAdd, UiEdit, UiTrash, UiX,
} from '@codeday/topocons';
import { useSession } from 'next-auth/react';
import { useToasts } from '@codeday/topo/utils';
import { useRouter } from 'next/router';
import { useColorModeValue } from '@codeday/topo/Theme';
import { ticketTypeEnum } from './Ticket';
import {
  CreateEmailTemplateMutation,
  DeleteEmailTemplateMutation,
  UpdateEmailTemplateMutation,
} from './EmailTemplate.gql';
import { useFetcher } from '../../fetch';

const schema = {
  type: 'object',
  properties: {
    name: {
      title: 'Name (internal)',
      type: 'string',
    },
    automatic: {
      title: 'Automatic?',
      type: 'boolean',
      default: false,

    },
    fromName: {
      title: 'From Name',
      type: 'string',
      default: 'John Peter',
    },
    fromEmail: {
      title: 'From Email',
      type: 'string',
      default: 'team@codeday.org',
    },
    subject: {
      title: 'Subject',
      type: 'string',
    },
    template: {
      title: 'Email Text',
      type: 'string',
    },
    sendText: {
      title: 'Send as text?',
      type: 'boolean',
      default: false,

    },
    textMsg: {
      title: 'Text message',
      type: 'string',
    },
    sendTo: {
      title: 'Send to',
      type: 'string',
      default: 'STUDENT',
      anyOf: ticketTypeEnum,
    },
    when: {
      type: 'string',
      title: 'Time offset',
    },
    whenFrom: {
      type: 'string',
      title: 'Time offset source',
      default: 'REGISTER',
      anyOf: [
        {
          type: 'string',
          title: 'Registration',
          enum: ['REGISTER'],
        },
        {
          type: 'string',
          title: 'Event Start',
          enum: ['EVENTSTART'],
        },
        {
          type: 'string',
          title: 'Event End',
          enum: ['EVENTEND'],
        },
      ],
    },
    sendLate: {
      title: 'Send Late?',
      type: 'boolean',
      default: false,
    },
    sendInWorkHours: {
      title: 'Wait to send until work hours?',
      type: 'boolean',
      default: false,

    },
    sendAfterEvent: {
      title: 'Send after event?',
      type: 'boolean',
      default: false,

    },
    sendParent: {
      title: 'Send to parents?',
      type: 'boolean',
      default: false,

    },
    marketing: {
      title: 'Marketing email?',
      type: 'boolean',
      default: false,

    },
    // extraFilters: {
    //     title: 'Extra filters (prisma `where`)',
    //     type: 'string'
    // }
    // Dropped feature to save dev time, unimplemented on backend. Might add at some point
  },
  required: [
    'name',
    'fromName',
    'fromEmail',
    'subject',
    'sendTo',
    'when',
    'whenFrom',
    'template',
  ],
};

const uiSchema = {
  template: {
    'ui:widget': 'textarea',
  },
  when: {
    'ui:help': 'Ex. -3d for 3 days before offset source time',
  },
  sendText: {
    'ui:help': 'If we don\'t have a number on hand, an email will be sent instead',
  },
  sendLate: {
    'ui:help': 'Only applies if time source is event start - if true, retroactively sends emails if people register after email sent to others',
  },
  sendAfterEvent: {
    'ui:help': '**All** Email Templates without this option are barred from being sent if the event has ended',
  },
  sendParent: {
    'ui:help': 'If selected, this email will only be sent to parents - to send to both, create two Email Templates',
  },
};

export function CreateEmailTemplateModal({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(/* if you need to set default values, do so here */);
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const router = useRouter();

  return (
    <Box {...props}>
      <Button onClick={onOpenModal}>{children || <><UiAdd />Add EmailTemplate</>}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Heading>Create EmailTemplate</Heading>
        <Form
          uiSchema={uiSchema}
          schema={schema}
          formData={formData}
          onChange={(data) => setFormData(data.formData)}
        >
          <Button
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await fetch(CreateEmailTemplateMutation, {
                  data: formData,
                  /* need to connect the new object
                                    to a parent object? do so here */
                });
                await router.replace(router.asPath);
                success('EmailTemplate Created');
                onCloseModal();
              } catch (ex) {
                error(ex.toString());
              }
              setLoading(false);
            }}
          >Submit
          </Button>
        </Form>
      </Modal>
    </Box>
  );
}

export function UpdateEmailTemplateModal({ emailtemplate, children, ...props }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(emailtemplate);
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const router = useRouter();

  function formDataToUpdateInput(formData) {
    const ret = {};
    Object.keys(schema.properties).map((key) => {
      if (formData[key] !== emailtemplate[key]) ret[key] = { set: formData[key] };
    });
    return ret;
  }

  return (
    <Box display="inline" {...props}>
      <Button display="inline" onClick={onOpenModal}>{children || <UiEdit />}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Form
          uiSchema={uiSchema}
          schema={schema}
          formData={formData}
          onChange={(data) => setFormData(data.formData)}
        >
          <Button
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await fetch(UpdateEmailTemplateMutation, {
                  where: { id: emailtemplate.id },
                  data: formDataToUpdateInput(formData),
                });
                await router.replace(router.asPath);
                success('EmailTemplate Updated');
                onCloseModal();
              } catch (ex) {
                error(ex.toString());
              }
              setLoading(false);
            }}
          >Submit
          </Button>
        </Form>
      </Modal>
    </Box>
  );
}

export function DeleteEmailTemplateModal({ emailtemplate, children, ...props }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const fetch = useFetcher(session);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const router = useRouter();

  return (
    <Box display="inline" {...props}>
      <Button display="inline" onClick={onOpenModal}>{children || <UiTrash />}</Button>
      <Modal open={open} onClose={onCloseModal} center styles={{ modal: { background: useColorModeValue('white', 'var(--chakra-colors-gray-1100)') } }}>
        <Heading>Remove EmailTemplate</Heading>
        <Text>Are you sure you want to delete this EmailTemplate?
          <br />
          There's no turning back!
        </Text>
        <Button
          colorScheme="red"
          disabled={loading}
          isLoading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await fetch(DeleteEmailTemplateMutation, { where: { id: emailtemplate.id } });
              await router.replace(router.asPath);
              success('EmailTemplate Deleted');
              onCloseModal();
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        ><UiTrash /><b>Delete EmailTemplate</b>
        </Button>
        <Button onClick={onCloseModal}><UiX />Cancel</Button>
      </Modal>
    </Box>
  );
}
