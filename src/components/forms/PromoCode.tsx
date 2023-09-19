// import React, { useState } from 'react';
// import Form from '@rjsf/chakra-ui';
// import { Box, Button, Heading, Text } from '@codeday/topo/Atom';
// import { Modal } from 'react-responsive-modal';
// import 'react-responsive-modal/styles.css';

import { ButtonProps } from '@chakra-ui/react';
import { Spinner, Button } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { graphql } from 'generated/gql';
import { ClearDiscountType, ClearEvent, ClearPromoCode } from 'generated/gql/graphql';
import { useRouter } from 'next/router';
import { BaseFieldsConfiguration, injectUpdateFields } from 'src/utils';
import { useMutation, useQuery } from 'urql';
import { CreateModal, CreateModalProps } from '../CRUD/create';
import { DeleteModal, DeleteModalProps } from '../CRUD/delete';
import { UpdateModal, UpdateModalProps } from '../CRUD/update';

// eslint-disable-next-line no-secrets/no-secrets
const characters = 'ABCDEFGHKPQRSTUVWXYZ';
function generatePromoCode(length: number): string {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

//     enablesUber: {
//       type: 'boolean',
//       title: 'Enables requesting a free Uber ride?',
//       description: '(For promo codes provided exclusively to low-income schools.)',
//     },
//     enablesLaptops: {
//       type: 'boolean',
//       title: 'Enables requesting a free laptop?',
//       description: '(For promo codes provided exclusively to low-income schools.)',
//     },
//   },
// };

// const uiSchema = {
//   uses: {
//     'ui:help': 'Leave this blank for the code to have unlimited uses',
//   },
//   enablesUber: {
//     'ui:help': '(For promo codes provided exclusively to low-income schools.)',
//   },
//   enablesLaptops: {
//     'ui:help':
//       '(This is for a laptop to keep, NOT a loaner laptop. For promo codes provided exclusively to low-income schools.)',
//   },
// };

const promoCodeFormFragment = graphql(`
  fragment PromoCodeForm on ClearPromoCode {
    id
    code
    type
    amount
    uses
  }
`);

const createPromoCodeMutation = graphql(`
  mutation CreatePromoCode($data: ClearPromoCodeCreateInput!) {
    clear {
      createPromoCode(data: $data) {
        ...PromoCodeForm
      }
    }
  }
`);

const fields: BaseFieldsConfiguration<typeof createPromoCodeMutation> = {
  code: {
    _type: 'string',
    required: true,
  },
  amount: {
    _type: 'number',
    required: true,
    schema: {
      multipleOf: 0.01,
    },
  },
  type: {
    _type: 'string',
    schema: {
      anyOf: [
        {
          enum: ['SUBTRACT'],
          title: 'Subtract Fixed Value',
        },
        {
          enum: ['PERCENT'],
          title: 'Percent discount',
        },
      ],
    },
  },
  uses: {
    _type: 'number',
    schema: {
      multipleOf: 1,
    },
    uiSchema: {
      'ui:help': 'Leave blank for infinite uses',
    },
  },
};

export type CreatePromoCodeProps = {
  event: PropFor<ClearEvent>;
} & Omit<CreateModalProps<typeof createPromoCodeMutation>, 'fields' | 'mutation'>;

export function CreatePromoCode({ event, ...props }: CreatePromoCodeProps) {
  return (
    <CreateModal
      {...props}
      mutation={createPromoCodeMutation}
      fields={{
        data: {
          ...fields,
          event: {
            _type: 'connect',
            connect: {
              id: event.id,
            },
          },
        },
      }}
    />
  );
}

const updatePromoCodeMutation = graphql(`
  mutation UpdatePromoCode($where: ClearPromoCodeWhereUniqueInput!, $data: ClearPromoCodeUpdateInput!) {
    clear {
      updatePromoCode(where: $where, data: $data) {
        ...PromoCodeForm
      }
    }
  }
`);

const updatePromoCodeQuery = graphql(`
  query PromoCodeForUpdate($where: ClearPromoCodeWhereUniqueInput!) {
    clear {
      promoCode(where: $where) {
        ...PromoCodeForm
      }
    }
  }
`);

export type UpdatePromoCodeProps = {
  promoCode: PropFor<ClearPromoCode>;
} & Omit<UpdateModalProps<typeof updatePromoCodeMutation>, 'fields' | 'mutation'>;

export function UpdatePromoCode({ promoCode: promoCodeData, ...props }: UpdatePromoCodeProps) {
  const [{ data }] = useQuery({ query: updatePromoCodeQuery, variables: { where: { id: promoCodeData.id } } });
  const promoCode = data?.clear?.promoCode;

  if (!promoCode) {
    return <Spinner />;
  }

  return (
    <UpdateModal
      {...props}
      mutation={updatePromoCodeMutation}
      fields={{
        where: {
          id: {
            _type: 'string',
            schema: {
              default: promoCode.id,
              writeOnly: true,
            },
            uiSchema: {
              'ui:widget': 'hidden',
            },
          },
        },
        data: {
          // @ts-ignore FIXME
          ...injectUpdateFields(fields, promoCode),
        },
      }}
    />
  );
}

const deletePromoCodeMutation = graphql(`
  mutation DeletePromoCode($where: ClearPromoCodeWhereUniqueInput!) {
    clear {
      deletePromoCode(where: $where) {
        ...PromoCodeForm
      }
    }
  }
`);

export type DeletePromoCodeProps = {
  promoCode: PropFor<ClearPromoCode>;
} & Omit<DeleteModalProps<typeof deletePromoCodeMutation>, 'where' | 'mutation'>;

export function DeletePromoCode({ promoCode, ...props }: DeletePromoCodeProps) {
  return <DeleteModal {...props} where={{ id: promoCode.id }} mutation={deletePromoCodeMutation} />;
}

export type CreateScholarshipCodeButtonProps = {
  event: PropFor<ClearEvent>;
} & ButtonProps;
export function CreateScholarshipCodeButton({ event, ...props }: CreateScholarshipCodeButtonProps) {
  const [createCodeResult, doCreateCode] = useMutation(createPromoCodeMutation);
  const router = useRouter();
  const { success, error } = useToasts();

  return (
    <Button
      display="inline"
      m={1}
      isLoading={createCodeResult.fetching}
      isDisabled={createCodeResult.fetching}
      onClick={async () => {
        const result = await doCreateCode({
          data: {
            code: generatePromoCode(6),
            type: ClearDiscountType.PERCENT,
            amount: 100,
            uses: 1,
            event: {
              connect: {
                id: event.id,
              },
            },
          },
        });
        if (result.error) {
          error(result.error.name, result.error.message);
        } else {
          success('Scholarship Code Created');
          await router.push(`/events/${event.id}/promoCodes/${result.data?.clear?.createPromoCode.id}`);
        }
      }}
      {...props}
    >
      Generate Scholarship Code
    </Button>
  );
}
