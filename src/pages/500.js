import Opossum from "../components/Opossum";
import { Heading } from "@codeday/topo/Atom/Text";
import Text from "@codeday/topo/Atom/Text";
import Box from "@codeday/topo/Atom/Box";
import Link from "@codeday/topo/Atom/Text/Link";

export default function ServerError() {
  return (
    <Box>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Opossum height={600} />
      </Box>
      <Box style={{ textAlign: "center" }}>
        <Heading>Oh no! Error 500</Heading>
        <Text>There seems to have been an error on our part. </Text>
        <Link href="/">Go home</Link>
      </Box>
    </Box>
  );
}
