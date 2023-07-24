import React, { useState, useRef, useEffect, ChangeEvent } from "react";

// Import MUI components
import { Container, Box, Button, Divider, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

// Import other components
import Canvas from "./components/Canvas";

const App = () => {

  // States for image upload
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for smart contract information
  const [contractAddress, setContractAddress] = useState<string>("");
  const [storedHash, setStoredHash] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClear = () => {
    setSelectedImage(null);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid md={8} flexDirection="column" display="flex" gap={2}>
          <Typography variant="h6">Signature</Typography>
          <Canvas width={500} height={400} />
          <Button fullWidth variant="contained" sx={{ borderRadius: "20px" }}>
            Submit
          </Button>
          <Divider>OR</Divider>
          <Button
            fullWidth
            variant="contained"
            sx={{ borderRadius: "20px" }}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Grid>
        <Grid md={4} flexDirection="column" display="flex" gap={2}>
          <Typography variant="h6">Preview</Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
            width={300}
            borderRadius={2}
            bgcolor="grey.500"
            color="white"
            boxShadow={2}
            style={{ opacity: 0.5 }}
          >
            {selectedImage ? (
              <img
                src={selectedImage.toString()}
                alt="Preview"
                style={{ height: "100px", width: "100px" }}
              />
            ) : (
              <Typography variant="h5">No preview yet</Typography>
            )}
          </Box>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <Stack spacing={1}>
            <Typography variant="subtitle1">Contract Address</Typography>
              {contractAddress ? (
                <Typography variant="subtitle1">{contractAddress}</Typography>
              ) : (
                <Typography variant="subtitle1">-</Typography>
              )}
            <Typography variant="subtitle1">Stored Hash</Typography>
              {storedHash ? (
                <Typography variant="subtitle1">{contractAddress}</Typography>
              ) : (
                <Typography variant="subtitle1">-</Typography>
              )}
            <Typography variant="subtitle1">Transaction Hash</Typography>
              {transactionHash ? (
                <Typography variant="subtitle1">{contractAddress}</Typography>
              ) : (
                <Typography variant="subtitle1">-</Typography>
              )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
