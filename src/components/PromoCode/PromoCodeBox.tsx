import { forwardRef } from '@chakra-ui/react';
import { SkeletonText, Spinner } from '@codeday/topo/Atom';
import { graphql } from 'generated/gql';
import { ClearPromoCode } from 'generated/gql/graphql';
import React from 'react';
import { useQuery } from 'urql';
import { InfoBox, InfoBoxProps } from '../InfoBox';

const query = graphql(`
  query PromoCodeBox($where: ClearPromoCodeWhereUniqueInput!) {
    clear {
      promoCode(where: $where) {
        id
        type
        amount
        uses
        usesRemaining
        usesCount
        code
      }
    }
  }
`);

export type PromoCodeBoxProps = {
  promoCode: PropFor<ClearPromoCode>;
} & InfoBoxProps;

export const PromoCodeBox = forwardRef<PromoCodeBoxProps, 'div'>(({ promoCode: promoCodeData, ...props }, ref) => {
  const [{ data }] = useQuery({ query, variables: { where: { id: promoCodeData.id } } });
  const promoCode = data?.clear?.promoCode;
  if (!promoCode) return <Spinner />;

  return (
    <InfoBox heading={promoCode.code} ref={ref} {...props}>
      {promoCode.type === 'PERCENT' && promoCode.amount === 100 && promoCode.uses === 1 ? (
        <>
          Scholarship
          <br />
          {typeof promoCode.usesRemaining === 'number' ? (
            promoCode.usesRemaining > 0 ? (
              'Not used'
            ) : (
              'Used'
            )
          ) : (
            <SkeletonText />
          )}
        </>
      ) : (
        <>
          {promoCode.type === 'SUBTRACT' ? '$' : ''}
          {promoCode.amount}
          {promoCode.type === 'PERCENT' ? '%' : ''} off
          <br />
          {promoCode.usesCount}/{promoCode.uses || <>&infin;</>} uses
          {promoCode.usesRemaining ? ` (${promoCode.usesRemaining} left)` : null}
        </>
      )}
    </InfoBox>
  );
});
