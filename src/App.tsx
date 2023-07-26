import React, { useState, useEffect } from "react";

// Import MUI components
import {
  Box,
  Button,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

// Import other components
import Canvas from "./components/Canvas";
import PreviewBox from "./components/PreviewBox";
import { contractABI, contractAddr } from "./utils/contract";

// Import WAGMI hooks
import { useAccount, useContractWrite, usePrepareContractWrite, Address, useContractRead } from "wagmi";

import { keccak256 } from "js-sha3";
import { debounce } from "lodash";

const App: React.FC = () => {

  // Global WAGMI hooks to access the connected wallet
  const { address, isConnected, isDisconnected } = useAccount();

  // States for previe
  const [base64Image, setBase64Image] = useState<string>("");

  // States for canvas
  const [clear, setClear] = useState<boolean>(false);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  // States for smart contract information
  const [contractAddress, setContractAddress] = useState<string>("");
  const [storedHash, setStoredHash] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [existingHash, setExistingHash] = useState<string>("");

  const clearAllStates = () => {
    setStoredHash("");
    setTransactionHash("");
    setExistingHash("");
    setBase64Image("");
    setContractAddress("");
  };

  // onChange hook for to get data from the child canvas component
  const handleDrawingChange = (data: ImageData | null) => {
    setImageData(data);








    if (clear) {
      setClear(false);
    }
  };

  const handleClearCanvas = () => {
    setClear(true);
  };

  const hashBase64 = (signature: any) => {
    return keccak256(signature);
  };

  const imageDataToBase64 = (imageData: ImageData): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }

    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  }

  const handleSubmit = () => {

    // Convert ImageData to Base64
    if (imageData) {
      const base64 = imageDataToBase64(imageData);
      // So that it can be used in preview
      setBase64Image(base64);
      setStoredHash(hashBase64(base64));
    }
    // Clear Canvas
    handleClearCanvas();

    storeSignature?.();

  };

  const debounceOnSubmit = debounce(handleSubmit, 300);

  // WAGMI hooks for smart contract
  const { config } = usePrepareContractWrite({
    address: contractAddr as Address,
    abi: contractABI,
    functionName: "storeSignature",
    args: [hashBase64(base64Image)],
    enabled: Boolean(storedHash)
  });

  const { write: storeSignature } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log("Write operation is successful", data);
      setTransactionHash(data.hash);
      //setExistingHash("");
    },
    onError(error) {
      console.log("Write operation is unsuccessful", error);
      setStoredHash("");
      setBase64Image("");
    }
  });

  // This should be changed to getStoredHash
  const getSignature = useContractRead({
    address: contractAddr as Address,
    abi: contractABI,
    functionName: "getSignature",
    args: [address],
    enabled: Boolean(address),
    onSuccess(data) {
      console.log("Read operation is successful", data);
      if (data !== "") setExistingHash(data as string);
    }
  });

  useEffect(() => {
    if (isConnected) {
      getSignature.refetch();
      setContractAddress(contractAddr);
    }
    else if (isDisconnected) {
      clearAllStates();
    }
  }, [isConnected, isDisconnected]);

  return (
    <Grid container spacing={2}>
      <Grid md={8} flexDirection="column" display="flex" gap={2}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Draw Signature</Typography>
          <Button variant="outlined" onClick={handleClearCanvas}>
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
              onClick={debounceOnSubmit}
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
        {base64Image ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
            width={"100%"}
            borderRadius={2}
            color="white"
            boxShadow={2}
          >
            <img
              src={base64Image}
              alt="Preview"
              style={{ height: "200px", width: "100%", borderRadius: "2px" }}
            />
          </Box>
        ) : (
          <PreviewBox />
        )}
        <Divider />
        <List>
          <ListItem>
            <ListItemText
              primary="Contract Address"
              secondary={contractAddress ? contractAddress : "-"}
            />
          </ListItem>
          {
            existingHash && (
              <ListItem>
                <ListItemText
                  primary="Existing Hash"
                  secondary={existingHash ? existingHash : "-"}
                />
              </ListItem>
            )
          }
          <ListItem>
            <ListItemText
              primary="Stored Hash"
              secondary={storedHash ? storedHash : "-"}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Transaction Hash"
              secondary={transactionHash ? transactionHash : "-"}
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

export default App;
