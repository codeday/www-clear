import React from 'react';
import {
  Text, List, ListItem,
} from '@codeday/topo/Atom';
import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
} from '@chakra-ui/react';
import InfoBox from './InfoBox';

export default function TicketSurveyBreakdown({ tickets, children, ...props }) {
  const multiAnswerQuestions = ['ethnicity', 'interests', 'workshops'];
  // structure: { question: { answer1: 5, answer2: 10 } }
  const countByValueByKey = {};
  tickets.forEach((ticket) => {
    Object.keys(ticket.surveyResponses || {}).forEach((q) => {
      let responses = [];
      if (multiAnswerQuestions.includes(q)) {
        responses = ticket.surveyResponses[q].split(',');
      } else {
        responses = [ticket.surveyResponses[q]];
      }
      // remove empty-like responses
      responses.filter((r) => r)
        .forEach((r) => {
          if (!countByValueByKey[q]) countByValueByKey[q] = {};
          if (!countByValueByKey[q][r]) countByValueByKey[q][r] = 0;
          countByValueByKey[q][r] += 1;
        });
    });
  });
  return (
    <InfoBox heading="Survey response breakdown">
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            (click to show/hide)
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {Object.keys(countByValueByKey).map((question) => (
              <Accordion allowMultiple>
                <AccordionItem>

                  <AccordionButton>
                    <Text bold>{question}</Text>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>

                    <List styleType="disc" ml={4}>
                      {Object.keys(countByValueByKey[question])
                        .sort((a, b) => countByValueByKey[question][b] - countByValueByKey[question][a])
                        .map((answer) => {
                          const num = countByValueByKey[question][answer];
                          return (
                            <ListItem>{answer}: {num} ({(num / tickets.length * 100).toFixed(2)}%)</ListItem>
                          );
                        })}
                    </List>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </InfoBox>
  );
}
