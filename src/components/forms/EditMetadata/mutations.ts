import { graphql } from 'generated/gql';

export const mutations = {
  ClearEvent: graphql(`
    mutation ClearEventMetadata($key: String!, $value: String!, $where: ClearEventWhereUniqueInput!) {
      clear {
        setEventMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearVenue: graphql(`
    mutation ClearVenueMetadata($key: String!, $value: String!, $where: ClearVenueWhereUniqueInput!) {
      clear {
        setVenueMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearPerson: graphql(`
    mutation ClearPersonMetadata($key: String!, $value: String!, $where: ClearPersonWhereUniqueInput!) {
      clear {
        setPersonMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearTicket: graphql(`
    mutation ClearTicketMetadata($key: String!, $value: String!, $where: ClearTicketWhereUniqueInput!) {
      clear {
        setTicketMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearPayment: graphql(`
    mutation ClearPaymentMetadata($key: String!, $value: String!, $where: ClearPaymentWhereUniqueInput!) {
      clear {
        setPaymentMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearSponsor: graphql(`
    mutation ClearSponsorMetadata($key: String!, $value: String!, $where: ClearSponsorWhereUniqueInput!) {
      clear {
        setSponsorMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearPromoCode: graphql(`
    mutation ClearPromoCodeMetadata($key: String!, $value: String!, $where: ClearPromoCodeWhereUniqueInput!) {
      clear {
        setPromoCodeMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearEventGroup: graphql(`
    mutation ClearEventGroupMetadata($key: String!, $value: String!, $where: ClearEventGroupWhereUniqueInput!) {
      clear {
        setEventGroupMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearScheduleItem: graphql(`
    mutation ClearScheduleItemMetadata($key: String!, $value: String!, $where: ClearScheduleItemWhereUniqueInput!) {
      clear {
        setScheduleItemMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearEmailTemplate: graphql(`
    mutation ClearEmailTemplateMetadata($key: String!, $value: String!, $where: ClearEmailTemplateWhereUniqueInput!) {
      clear {
        setEmailTemplateMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearEventRestriction: graphql(`
    mutation ClearEventRestrictionMetadata(
      $key: String!
      $value: String!
      $where: ClearEventRestrictionWhereUniqueInput!
    ) {
      clear {
        setEventRestrictionMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
  ClearMailingListMember: graphql(`
    mutation ClearMailingListMemberMetadata(
      $key: String!
      $value: String!
      $where: ClearMailingListMemberWhereUniqueInput!
    ) {
      clear {
        setMailingListMemberMetadata(key: $key, value: $value, where: $where) {
          id
          getMetadata(key: $key)
        }
      }
    }
  `),
};
