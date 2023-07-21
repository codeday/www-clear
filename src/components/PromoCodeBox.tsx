import React from 'react';
import InfoBox from "./InfoBox";

export default function PromoCodeBox({
  promoCode,
  children,
  ...props
}: any) {
     return (
         <InfoBox heading={promoCode.code} {...props}>
             {promoCode.type === 'PERCENT' && promoCode.amount === 100 && promoCode.uses === 1 ? (
              <>
                Scholarship<br />
                {promoCode.usesRemaining > 0 ? 'Not used' : 'Used'}
              </>
             ) : (
              <>
               {promoCode.type === 'SUBTRACT' ? '$' : ''}{promoCode.amount}{promoCode.type === 'PERCENT' ? '%' : ''} off<br/>
               {promoCode.usesCount}/{promoCode.uses || <>&infin;</>} uses
               {promoCode.usesRemaining? ` (${promoCode.usesRemaining} left)`: null}
             </>
           )}
         </InfoBox>
     )
}
