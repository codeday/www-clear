import { ButtonProps, Icon } from '@chakra-ui/react';
import { UiDownload } from '@codeday/topocons';
import { CSVLink } from 'react-csv';
import { Button } from '@codeday/topo/Atom';
import { useRef } from 'react';

export type CSVExportProps = {
  data: CSVLink['props']['data'];
  headers: CSVLink['props']['headers'];
  filename: CSVLink['props']['filename'];
} & ButtonProps;
export const CSVExport = ({ data, headers, filename = 'data.csv', ...props }: CSVExportProps) => {
  const ref = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);
  return (
    <Button
      onClick={() => {
        ref.current?.link.click();
      }}
      {...props}
    >
      <CSVLink style={{ display: 'none' }} data={data} headers={headers} filename={filename} ref={ref} />
      <Icon mr={2} as={UiDownload} />
      Download as CSV
    </Button>
  );
};
