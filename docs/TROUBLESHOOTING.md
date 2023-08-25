# Common Errors you may encounter during development (and how to fix them!)

## Expression produces a union type that is too complex to represent. ts(2590)
**Quick solution**: Make sure typescript version is ^4, and that "use workspace version" is selected in VSCode (Command Pallete (f1) -> "Select Typescript Version")

**Explination**: This is an issue with chakra-ui, the library that [topo](https://github.com/codeday/topo) is built on top of. This is fixed upstream in chakra-ui 2.6.0 (https://github.com/chakra-ui/chakra-ui/issues/3714) however, as of writing, topo does not yet use this version, and we must use the same version of chakra-ui as topo for compatibility.