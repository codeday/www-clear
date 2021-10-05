import React from 'react';
import * as Icon from '@codeday/topocons/Icon';
import Badge from './Badge';

export default function Alert({children, ...props}) {
    return (
        <Badge
            bg="red.200"
            color="darkred"
            borderColor="darkred"
            borderWidth={1}
            {...props}
        >
            <Icon.UiError/>{children}
        </Badge>
    );
}

export function InfoAlert({children, ...props}) {
    return (
        <Badge
            bg="gray.50"
            color="gray.800"
            borderColor="gray.800"
            borderWidth={1}

            {...props}
        >
            <Icon.UiInfo/>{children}
        </Badge>
    );
}

export function WarningAlert({children, ...props}) {
    return (
        <Badge
            bg="orange.50"
            color="orange.800"
            borderColor="orange.800"
            borderWidth={1}
            {...props}
        >
            <Icon.UiWarning/>{children}
        </Badge>
    );
}

export function GoodAlert({children, ...props}) {
    return (
        <Badge
            bg="green.50"
            color="green.800"
            borderColor="green.800"
            borderWidth={1}
            {...props}
        >
            <Icon.UiOk/>{children}
        </Badge>
    );
}
