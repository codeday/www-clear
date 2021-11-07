import Opossum from "../components/opossum/Opossum";
import { Heading } from "@codeday/topo/Atom/Text";
import Box from "@codeday/topo/Atom/Box";

export default function ServerError() {
  return (
    <Box>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Opossum height={600} />
      </Box>
      <Heading style={{ textAlign: "center" }}>Oh no!</Heading>
    </Box>
  );
}
