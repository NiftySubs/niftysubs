import {
  extendTheme,
  withDefaultColorScheme,
  ThemeConfig,
} from "@chakra-ui/react";

const config = { initialColorMode: "light", useSystemColorMode: false,};
const theme = extendTheme({ 
    config,
    fonts: {
        heading: "Inter",
        body: "Inter"
    },
    components: {
        Text: {
            baseStyle: {
                fontWeight: "semibold",
                fontFamily: "Inter"
            }
        },
        Tag: {
            baseStyle: {
                background: "rgba(230,1,122,0.08)",
                color: "#E6017A"
            }
        },
        Button: {
            baseStyle: {
                fontFamily: "Inter"
            }
        },
        Heading: {
            baseStyle: {
                fontFamily: "Inter"
            }
        }
    }
});

export default theme;