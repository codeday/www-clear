import React, {useRef, useState} from 'react';
import {Box, Button, Image} from "@codeday/topo/Atom";
import {useToasts} from '@codeday/topo/utils';

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Masonry from 'react-responsive-masonry';
import InfoBox from './InfoBox';
import {DeleteSponsorModal, UpdateSponsorModal} from './forms/Sponsor';
import ContactBox from './ContactBox';

// @ts-expect-error TS(2307) FIXME: Cannot find module './forms/Notes.gql' or its corr... Remove this comment to see the full error message
import {SetSponsorNotesMutation} from './forms/Notes.gql';

// @ts-expect-error TS(2307) FIXME: Cannot find module './forms/Sponsor.gql' or its co... Remove this comment to see the full error message
import {UploadSponsorDarkLogoMutation, UploadSponsorLogoMutation} from './forms/Sponsor.gql'
import Notes from './forms/Notes';
import {useSession} from "next-auth/react";
import {useFetcher} from "../fetch";
import Alert, {InfoAlert} from "./Alert";

// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module '@cod... Remove this comment to see the full error message
import {UiUpload} from "@codeday/topocons"

const WARN_FILE_SIZE = 1024 * 1024 * 5
const MAX_FILE_SIZE = 1024 * 1024 * 125
const MIME_IMAGE = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

export default function SponsorBox({
    sponsor,
    currencySymbol,
    children,
    ...props
}: any) {
    const logoUploaderRef = useRef(null);
    const darkLogoUploaderRef = useRef(null);
    const [logoUrl, setLogoUrl] = useState(sponsor.logoImageUri);
    const [darkLogoUrl, setDarkLogoUrl] = useState(sponsor.darkLogoImageUri);
    const [uploading, setUploading] = useState(false);
    const { success, error, info } = useToasts();
    const session = useSession();

    // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
    const fetch = useFetcher(session);

    return (
        <InfoBox
            id={sponsor.id}
            heading={(
                <>
                    {sponsor.name}<Box display="inline-block"><UpdateSponsorModal sponsor={sponsor}/><DeleteSponsorModal
                    sponsor={sponsor}/></Box>
                </>
            )}
            {...props}
        >
            <Masonry columnsCount={2}>
                <InfoBox heading="Description">{sponsor.description}</InfoBox>
                <InfoBox heading="Contribution">
                    Amount: {currencySymbol || '$'}{sponsor.amount}
                    <br/>
                    Perks: {sponsor.perks}
                </InfoBox>
                <ContactBox name={sponsor.contactName} email={sponsor.contactEmail} phone={sponsor.contactPhone}/>
                <InfoBox heading="Logo" backgroundColor="white">
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                    <Image src={logoUrl} onClick={() => logoUploaderRef.current.click()} />
                    <input
                        type="file"
                        ref={logoUploaderRef}
                        accept="image/*"
                        style={{display: 'none'}}
                        onChange={async (e) => {

                            // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                            const file = e.target.files[0];
                            if (!file) return;

                            let type = null;
                            if (MIME_IMAGE.includes(file.type)) type = 'IMAGE';
                            if (!type) {
                                error('Only images are supported.');
                                return;
                            }

                            if (file.size > MAX_FILE_SIZE) {
                                error(`You might have a problem uploading files larger than ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`);
                            }

                            var reader = new FileReader();
                            reader.onload = function(el) {

                                // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                                setLogoUrl(el.target.result.logoImageUri)
                            }
                            reader.readAsDataURL(file);

                            if (file.size > WARN_FILE_SIZE) {
                                info(`Your file is uploading, but at ${Math.floor(file.size / (1024 * 1024))}MB, it might take a while.`)
                            } else {
                                info(`Your file is uploading.`);
                            }
                            try {
                                setUploading(true);

                                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                const result = await fetch(UploadSponsorLogoMutation, { where: {id: sponsor.id}, file })
                                success('Logo Uploaded!')
                                setLogoUrl(result.logoImageUri);
                            } catch (e) {

                                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                                error(e.toString())
                            }
                            setUploading(false)
                        }}
                        />
                    {!sponsor.logoImageUri? <>
                        <Alert>No Sponsor Logo</Alert>
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                        <Button onClick={() => logoUploaderRef.current.click()}>
                            <UiUpload/> Upload Logo
                        </Button>
                    </> : null}
                </InfoBox>
                <InfoBox heading="Logo (Dark Mode)" backgroundColor="gray.1200">
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                    <Image src={darkLogoUrl} onClick={() => darkLogoUploaderRef.current.click()} />
                    <input
                        type="file"
                        ref={darkLogoUploaderRef}
                        accept="image/*"
                        style={{display: 'none'}}
                        onChange={async (e) => {

                            // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                            const file = e.target.files[0];
                            if (!file) return;

                            let type = null;
                            if (MIME_IMAGE.includes(file.type)) type = 'IMAGE';
                            if (!type) {
                                error('Only images are supported.');
                                return;
                            }

                            if (file.size > MAX_FILE_SIZE) {
                                error(`You might have a problem uploading files larger than ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`);
                            }

                            var reader = new FileReader();
                            reader.onload = function(el) {

                                // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                                setDarkLogoUrl(el.target.result.darkLogoImageUri)
                            }
                            reader.readAsDataURL(file);

                            if (file.size > WARN_FILE_SIZE) {
                                info(`Your file is uploading, but at ${Math.floor(file.size / (1024 * 1024))}MB, it might take a while.`)
                            } else {
                                info(`Your file is uploading.`);
                            }
                            try {
                                setUploading(true);

                                // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
                                const result = await fetch(UploadSponsorDarkLogoMutation, { where: {id: sponsor.id}, file })
                                success('Logo Uploaded!')
                                setLogoUrl(result.darkLogoImageUri);
                            } catch (e) {

                                // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
                                error(e.toString())
                            }
                            setUploading(false)
                        }}
                    />
                    {!sponsor.darkLogoImageUri? <>
                        <InfoAlert>No Dark Mode Sponsor Logo</InfoAlert>
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
                        <Button onClick={() => darkLogoUploaderRef.current.click()}>
                            <UiUpload/> Upload Dark Mode Logo
                        </Button>
                    </> : null}
                </InfoBox>
                <Notes notes={sponsor.notes} updateId={sponsor.id} updateMutation={SetSponsorNotesMutation}/>
            </Masonry>
            {children}
        </InfoBox>
    );
}
