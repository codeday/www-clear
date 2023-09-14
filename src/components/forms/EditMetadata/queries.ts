import { graphql } from 'generated/gql';

export const queries = {
  ClearEvent: graphql(`
    query EventMetadata($key: String!, $where: ClearEventWhereUniqueInput!) {
      clear {
        event(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearVenue: graphql(`
    query VenueMetadata($key: String!, $where: ClearVenueWhereUniqueInput!) {
      clear {
        venue(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearPerson: graphql(`
    query PersonMetadata($key: String!, $where: ClearPersonWhereUniqueInput!) {
      clear {
        person(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearTicket: graphql(`
    query TicketMetadata($key: String!, $where: ClearTicketWhereUniqueInput!) {
      clear {
        ticket(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearPayment: graphql(`
    query PaymentMetadata($key: String!, $where: ClearPaymentWhereUniqueInput!) {
      clear {
        payment(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearSponsor: graphql(`
    query SponsorMetadata($key: String!, $where: ClearSponsorWhereUniqueInput!) {
      clear {
        sponsor(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearPromoCode: graphql(`
    query PromoCodeMetadata($key: String!, $where: ClearPromoCodeWhereUniqueInput!) {
      clear {
        promoCode(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearEventGroup: graphql(`
    query EventGroupMetadata($key: String!, $where: ClearEventGroupWhereUniqueInput!) {
      clear {
        eventGroup(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearScheduleItem: graphql(`
    query ScheduleItemMetadata($key: String!, $where: ClearScheduleItemWhereUniqueInput!) {
      clear {
        scheduleItem(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearEmailTemplate: graphql(`
    query EmailTemplateMetadata($key: String!, $where: ClearEmailTemplateWhereUniqueInput!) {
      clear {
        emailTemplate(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearEventRestriction: graphql(`
    query EventRestrictionMetadata($key: String!, $where: ClearEventRestrictionWhereUniqueInput!) {
      clear {
        eventRestriction(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearMailingListMember: graphql(`
    query MailingListMember($key: String!, $where: ClearMailingListMemberWhereUniqueInput!) {
      clear {
        mailingListMember(where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
};
