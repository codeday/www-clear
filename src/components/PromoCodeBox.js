import React from 'react';
import InfoBox from "./InfoBox";

export default function PromoCodeBox({promoCode, children, ...props}) {
     return (
         <InfoBox heading={promoCode.code} {...props}>
             Type: {promoCode.type}<br/>
             Amount: {promoCode.amount}<br/>
             Uses: {promoCode.uses || <>&infin;</>}<br/>
             {promoCode.usesRemaining? `Uses Remaining: ${promoCode.usesRemaining}`: null}
         </InfoBox>
     )
}
