import React from 'react';
import * as Icon from '@codeday/topocons/Icon';
import Badge from './Badge';
import {useColorModeValue} from "@codeday/topo/Theme";

export default function Alert({children, ...props}) {
    return (
        <Badge
            bg={useColorModeValue("red.200", "darkred")}
            color={useColorModeValue("darkred", "red.200")}
            borderColor={useColorModeValue("darkred", undefined)}
            borderWidth={useColorModeValue(1, 0)}
            {...props}
        >
	    <Icon.UiError/>{' '}{children}
        </Badge>
    );
}

export function InfoAlert({children, ...props}) {
    return (
        <Badge
            bg={useColorModeValue("gray.50", "gray.800")}
            color={useColorModeValue("gray.800", "gray.50")}
            borderColor={useColorModeValue("gray.800", undefined)}
            borderWidth={useColorModeValue(1, 0)}

            {...props}
        >
            <Icon.UiInfo/>{' '}{children}
        </Badge>
    );
}

export function WarningAlert({children, ...props}) {
    return (
        <Badge
            bg={useColorModeValue("orange.50", "orange.800")}
            color={useColorModeValue("orange.800", "orange.50")}
            borderColor={useColorModeValue("orange.800", undefined)}
            borderWidth={useColorModeValue(1, 0)}
            {...props}
        >
            <Icon.UiWarning/>{' '}{children}
        </Badge>
    );
}

export function GoodAlert({children, ...props}) {
    return (
        <Badge
            bg={useColorModeValue("green.50", "green.800")}
            color={useColorModeValue("green.800", "green.50")}
            borderColor={useColorModeValue("green.800", undefined)}
            borderWidth={useColorModeValue(1, 0)}
            {...props}
        >
            <Icon.UiOk/>{' '}{children}
        </Badge>
    );
}
