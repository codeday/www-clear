import { Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearEmailTemplate, ClearTicketType } from 'generated/gql/graphql';
import { JSONSchema7Definition } from 'json-schema';
import { BaseFieldsConfiguration, injectUpdateFields } from 'src/utils';
import { useQuery } from 'urql';
import { CreateModal, CreateModalProps, FieldsConfiguration } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

const emailTemplateFormFragment = graphql(`
  fragment EmailTemplateForm on ClearEmailTemplate {
    id
    name
    automatic
    fromName
    fromEmail
    replyTo
    subject
    template
    sendText
    textMsg
    sendTo
    when
    whenFrom
    sendLate
    sendInWorkHours
    sendAfterEvent
    sendParent
    marketing
  }
`);

const createEmailTemplateMutation = graphql(`
  mutation CreateEmailTemplate($data: ClearEmailTemplateCreateInput!) {
    clear {
      createEmailTemplate(data: $data) {
        ...EmailTemplateForm
      }
    }
  }
`);

const fields: BaseFieldsConfiguration<typeof createEmailTemplateMutation> = {
  name: {
    _type: 'string',
    required: true,
    title: 'Name (internal)',
  },
  automatic: {
    _type: 'boolean',
    schema: {
      default: false,
    },
  },
  fromName: {
    _type: 'string',
    required: true,
    schema: {
      default: 'John Peter',
    },
  },
  fromEmail: {
    _type: 'string',
    required: true,
    schema: {
      default: 'team@codeday.org',
    },
  },
  subject: {
    _type: 'string',
    required: true,
  },
  template: {
    _type: 'string',
    title: 'Email Text',
    required: true,
    uiSchema: {
      'ui:widget': 'textarea',
    },
  },
  sendText: {
    _type: 'boolean',
    title: 'Send as SMS?',
    uiSchema: {
      'ui:help': "If we don't have a number on hand, an email will be sent instead.",
    },
  },
  textMsg: {
    _type: 'string',
    title: 'SMS Contents',
  },
  sendTo: {
    _type: 'string',
    required: true,
    schema: {
      default: 'STUDENT',
      enum: Object.keys(ClearTicketType),
    },
  },
  when: {
    _type: 'string',
    title: 'Time Offset',
    required: true,
    uiSchema: {
      'ui:help': 'Ex. -3d for 3 days before Time Offset Source',
    },
  },
  whenFrom: {
    _type: 'string',
    title: 'Time Offset Source',
    required: true,
    schema: {
      default: 'REGISTER',
      anyOf: [
        {
          title: 'Registration',
          enum: ['REGISTER'],
        },
        {
          title: 'EventStart',
          enum: ['EVENTSTART'],
        },
        {
          title: 'Event End',
          enum: ['EVENTEND'],
        },
      ],
    },
  },
  sendLate: {
    _type: 'boolean',
    uiSchema: {
      'ui:help':
        'Only applies if time source is event start - if true, retroactively sends emails if people register after email sent to others.',
    },
  },
  sendInWorkHours: {
    _type: 'boolean',
    title: 'Wait to send until work hours?',
  },
  sendAfterEvent: {
    _type: 'boolean',
    uiSchema: {
      'ui:help': '**All** Email Templates without this option are barred from being sent if the event has ended',
    },
  },
  sendParent: {
    _type: 'boolean',
    title: 'Send to guardian?',
    uiSchema: {
      'ui:help': 'If selected, this email will only be sent to guardians - to send to both, create two Email Templates',
    },
  },
  marketing: {
    _type: 'boolean',
  },
};

type CreateEmailTemplateProps = Omit<CreateModalProps<typeof createEmailTemplateMutation>, 'fields' | 'mutation'>;

export function CreateEmailTemplate({ ...props }: CreateEmailTemplateProps) {
  return (
    <CreateModal
      {...props}
      mutation={createEmailTemplateMutation}
      fields={{
        data: {
          ...fields,
        },
      }}
    />
  );
}

const updateEmailTemplateMutation = graphql(`
  mutation UpdateEmailTemplate($where: ClearEmailTemplateWhereUniqueInput!, $data: ClearEmailTemplateUpdateInput!) {
    clear {
      updateEmailTemplate(data: $data, where: $where) {
        ...EmailTemplateForm
      }
    }
  }
`);

const updateEmailTemplateQuery = graphql(`
  query EmailTemplateForUpdate($where: ClearEmailTemplateWhereUniqueInput!) {
    clear {
      emailTemplate(where: $where) {
        ...EmailTemplateForm
      }
    }
  }
`);

export type UpdateEmailTemplateProps = {
  emailTemplate: PropFor<ClearEmailTemplate>;
} & Omit<UpdateModalProps<typeof updateEmailTemplateMutation>, 'fields' | 'mutation'>;

export function UpdateEmailTemplate({ emailTemplate: emailTemplateData, ...props }: UpdateEmailTemplateProps) {
  const [{ data }] = useQuery({ query: updateEmailTemplateQuery, variables: { where: { id: emailTemplateData.id } } });
  const emailTemplate = data?.clear?.emailTemplate;
  if (!emailTemplate) return <Spinner />;
  return (
    <UpdateModal
      {...props}
      mutation={updateEmailTemplateMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: emailTemplate.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
        data: {
          // @ts-expect-error
          ...injectUpdateFields(fields, emailTemplate),
        },
      }}
    />
  );
}

const deleteEmailTemplateMutation = graphql(`
  mutation DeleteEmailTemplate($where: ClearEmailTemplateWhereUniqueInput!) {
    clear {
      deleteEmailTemplate(where: $where) {
        ...EmailTemplateForm
      }
    }
  }
`);

export type DeleteEmailTemplateProps = {
  emailTemplate: PropFor<ClearEmailTemplate>;
} & Omit<DeleteModalProps<typeof deleteEmailTemplateMutation>, 'where' | 'mutation'>;

export function DeleteEmailTemplate({ emailTemplate, ...props }: DeleteEmailTemplateProps) {
  return <DeleteModal {...props} mutation={deleteEmailTemplateMutation} where={{ id: emailTemplate.id }} />;
};
