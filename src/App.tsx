import React, { useState, useRef, useEffect, ChangeEvent } from "react";

// Import MUI components
import {
  Container,
  Box,
  Button,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

// Import other components
import Canvas from "./components/Canvas";
import NavBar from "./components/layout/NavBar";
import sha3 from "js-sha3";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

const App = () => {

  // Global WAGMI hooks to access the connected wallet
  const { address, isConnected } = useAccount();

  // Canvas image data
  const [imageData, setImageData] = useState<ImageData | null>(null);

  // States for canvas
  const [clear, setClear] = useState<boolean>(false);

  // States for smart contract information
  const [contractAddress, setContractAddress] = useState<string>("");
  const [storedHash, setStoredHash] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");

  const handleDrawingChange = (data: ImageData | null) => {
    setImageData(data);
    if (clear) {
      setClear(false);
    }
  };

  // const handleImageClear = () => {
  //   setImageData(null);
  // };

  const handleClearCanvas = () => {
    setClear(true);
  };

  const handleSubmit = () => {
    if (imageData) {
      console.log(imageData);
    }
  };

  const hashSignature = (signature: ArrayBuffer) => {
    return sha3.keccak256(signature);
  };

  return (
    <div>
      <NavBar />
      <Grid container spacing={2}>
        <Grid md={8} flexDirection="column" display="flex" gap={2}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Draw Signature</Typography>
            <Button variant="text" onClick={handleClearCanvas}>
              Clear
            </Button>
          </div>
          <Canvas
            width={500}
            height={400}
            onDrawingChange={handleDrawingChange}
            clear={clear}
          />
          {isConnected ? (
            <>
              <Button
                fullWidth
                variant="contained"
                sx={{ borderRadius: "20px" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                variant="contained"
                sx={{ borderRadius: "20px" }}
                disabled
              >
                Submit
              </Button>
            </>
          )}
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
            {imageData ? (
              <img
                src={""}
                alt="Preview"
                style={{ height: "200px", width: "300px", borderRadius: "2px" }}
              />
            ) : (
              <Typography variant="h5">No preview yet</Typography>
            )}
          </Box>
          <Divider />
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
    </div>
  );
};

export default App;
