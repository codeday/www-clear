import React, { useRef, useState } from 'react';
import { Box, Button, Image, Flex, Skeleton, Spinner } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';

import { UiUpload } from '@codeday/topocons';
import { ClearSponsor } from 'generated/gql/graphql';
import { graphql } from 'generated/gql';
import { useMutation, useQuery } from 'urql';
import { InfoBox, InfoBoxProps } from '../InfoBox';
import { DeleteSponsor, UpdateSponsor } from '../forms/Sponsor';
import { ContactBox } from '../ContactBox';

import { Alert, InfoAlert } from '../Alert';
import { EditMetadata } from '../forms';

const query = graphql(`
  query SponsorBox($where: ClearSponsorWhereUniqueInput!) {
    clear {
      sponsor(where: $where) {
        __typename
        id
        name
        amount
        description
        logoImageUri
        darkLogoImageUri
        contactEmail
        contactName
        contactPhone
        perks
        event {
          id
          region {
            currencySymbol
          }
        }
      }
    }
  }
`);

const uploadLogo = graphql(`
  mutation UploadSponsorLogo($where: ClearSponsorWhereUniqueInput!, $file: Upload!) {
    clear {
      uploadSponsorLogo(where: $where, upload: $file) {
        id
        logoImageUri
      }
    }
  }
`);

const uploadDarkLogo = graphql(`
  mutation UploadSponsorDarkLogo($where: ClearSponsorWhereUniqueInput!, $file: Upload!) {
    clear {
      uploadDarkSponsorLogo(where: $where, upload: $file) {
        id
        darkLogoImageUri
      }
    }
  }
`);

const WARN_FILE_SIZE = 1024 * 1024 * 5;
const MAX_FILE_SIZE = 1024 * 1024 * 125;
const MIME_IMAGE = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

export type SponsorBoxProps = {
  sponsor: PropFor<ClearSponsor>;
} & InfoBoxProps;

export function SponsorBox({ sponsor: sponsorData, children, ...props }: SponsorBoxProps) {
  const logoUploaderRef = useRef<HTMLInputElement>(null);
  const darkLogoUploaderRef = useRef<HTMLInputElement>(null);
  const [logoUploadResult, doLogoUpload] = useMutation(uploadLogo);
  const [darkLogoUploadResult, doDarkLogoUpload] = useMutation(uploadDarkLogo);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingDark, setIsUploadingDark] = useState(false);
  const { success, error, info } = useToasts();
  const [{ data }] = useQuery({ query, variables: { where: { id: sponsorData.id } } });
  const sponsor = data?.clear?.sponsor;

  if (!sponsor) return <Spinner />;
  const currencySymbol = sponsor.event?.region?.currencySymbol || '$';
  return (
    <InfoBox
      id={sponsor.id}
      w="md"
      flexGrow={0}
      heading={sponsor.name}
      buttons={
        <>
          <UpdateSponsor compact sponsor={sponsor} buttonProps={{ h: 6 }} />
          <DeleteSponsor compact sponsor={sponsor} buttonProps={{ h: 6 }} />
        </>
      }
      {...props}
    >
      <Flex flexWrap="wrap">
        <InfoBox heading="Description">{sponsor.description}</InfoBox>
        <InfoBox heading="Contribution">
          Amount: {currencySymbol}
          {sponsor.amount}
          <br />
          Perks: {sponsor.perks}
        </InfoBox>
        <ContactBox name={sponsor.contactName} email={sponsor.contactEmail} phone={sponsor.contactPhone} />
        <EditMetadata of={sponsor} mKey="notes" />
        {/* TODO: Break this out into it's own component */}
        <InfoBox
          heading="Logo"
          backgroundColor="white"
          buttons={
            <Button h={6} onClick={() => logoUploaderRef.current?.click()}>
              <UiUpload />
            </Button>
          }
        >
          <Image
            maxH="xs"
            fallback={<Skeleton />}
            src={isUploading ? undefined : sponsor.logoImageUri || undefined}
            onClick={() => logoUploaderRef.current?.click()}
          />
          <input
            type="file"
            ref={logoUploaderRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              if (!e.target.files) return;
              const file = e.target.files[0];
              let type = null;
              if (MIME_IMAGE.includes(file.type)) type = 'IMAGE';
              if (!type) {
                error('Only images are supported.');
                return;
              }

              if (file.size > MAX_FILE_SIZE) {
                error(
                  `You might have a problem uploading files larger than ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`,
                );
              }

              if (file.size > WARN_FILE_SIZE) {
                info(
                  `Your file is uploading, but at ${Math.floor(file.size / (1024 * 1024))}MB, it might take a while.`,
                );
              } else {
                info(`Your file is uploading.`);
              }
              setIsUploading(true);
              await doLogoUpload({ where: { id: sponsor.id }, file });
              if (logoUploadResult.error) {
                error(logoUploadResult.error.name, logoUploadResult.error.message);
              } else {
                success('Logo Uploaded!');
              }
              setIsUploading(false);
            }}
          />
          {!sponsor.logoImageUri ? (
            <>
              <Alert>No Sponsor Logo</Alert>
            </>
          ) : null}
        </InfoBox>
        <InfoBox
          heading="Logo (Dark Mode)"
          backgroundColor="gray.1200"
          buttons={
            <Button h={6} onClick={() => darkLogoUploaderRef.current?.click()}>
              <UiUpload />
            </Button>
          }
        >
          <Image
            maxH="xs"
            fallback={<Skeleton />}
            src={isUploadingDark ? undefined : sponsor.darkLogoImageUri || undefined}
            onClick={() => darkLogoUploaderRef.current?.click()}
          />
          <input
            type="file"
            ref={darkLogoUploaderRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              if (!e.target.files) return;
              const file = e.target.files[0];
              let type = null;
              if (MIME_IMAGE.includes(file.type)) type = 'IMAGE';
              if (!type) {
                error('Only images are supported.');
                return;
              }

              if (file.size > MAX_FILE_SIZE) {
                error(
                  `You might have a problem uploading files larger than ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`,
                );
              }

              if (file.size > WARN_FILE_SIZE) {
                info(
                  `Your file is uploading, but at ${Math.floor(file.size / (1024 * 1024))}MB, it might take a while.`,
                );
              } else {
                info(`Your file is uploading.`);
              }
              setIsUploadingDark(true);
              await doDarkLogoUpload({ where: { id: sponsor.id }, file });
              if (darkLogoUploadResult.error) {
                error(darkLogoUploadResult.error.name, darkLogoUploadResult.error.message);
              } else {
                success('Logo Uploaded!');
              }
              setIsUploadingDark(false);
            }}
          />
          {!sponsor.darkLogoImageUri ? (
            <>
              <InfoAlert>No Dark Mode Sponsor Logo</InfoAlert>
            </>
          ) : null}
        </InfoBox>
      </Flex>
      {children}
    </InfoBox>
  );
}
