
// Import MUI components
import { Box, Typography } from "@mui/material";

const PreviewBox = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
            width={"100%"}
            borderRadius={2}
            bgcolor="grey.500"
            color="white"
            boxShadow={2}
            style={{ opacity: 0.5 }}
        >
            <Typography variant="h5">No preview yet</Typography>
        </Box>
    );
}

export default PreviewBox;