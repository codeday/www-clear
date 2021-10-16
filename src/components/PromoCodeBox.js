import React from 'React';
import InfoBox from "./InfoBox";
import {} from "@codeday/topocons/Icon"

export default function PromoCodeBox({promoCode, children, ...props}) {
     return (
         <InfoBox heading={promoCode.code} {...props}>
             Type: {promoCode.type}<br/>
             Amount: {promoCode.amount}<br/>
             Uses: {promoCode.uses || <>&infin;</>}<br/>
             {promoCode.usesRemaining? `Uses Remaining: ${promoCode.usesRemaining}}`: null}
         </InfoBox>
     )
}
