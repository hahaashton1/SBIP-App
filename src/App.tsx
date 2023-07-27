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
import { useAccount, useContractWrite, usePrepareContractWrite, Address, useContractRead, useSignMessage } from "wagmi";
import { debounce, set } from "lodash";

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

  // States for buttons
  const [signFlag, setSignFlag] = useState<boolean>(false);
  const [submitFlag, setSubmitFlag] = useState<boolean>(false);

  // Sets all states to default
  const clearAllStates = () => {
    setStoredHash("");
    setTransactionHash("");
    setExistingHash("");
    setBase64Image("");
    setContractAddress("");
    handleClearCanvas();
  };

  // onChange hook for to get data from the child canvas component
  const handleDrawingChange = (data: ImageData | null) => {
    setImageData(data);
    if (clear) {
      setClear(false);
    }
  };

  // Clears the entire drawing canvas
  const handleClearCanvas = () => {
    setClear(true);
  };

  // Converts ImageData to base64
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

  // Executes storing of signed message
  const handleSubmit = () => {
    if (imageData && submitFlag) {
      storeHash?.();
    }
    // Clear Canvas
    handleClearCanvas();
  };

  // Executes signing for base64 image
  const handleSign = () => {
    if (imageData && signFlag) {
      signMessage();
      const base64 = imageDataToBase64(imageData);
      // So that it can be used in preview
      setBase64Image(base64);
    }
  }

  // Debounce for submit and sign buttons
  const debounceOnSubmit = debounce(handleSubmit, 300);
  const debounceOnSign = debounce(handleSign, 300);

  // WAGMI hooks for smart contract
  const { config } = usePrepareContractWrite({
    address: contractAddr as Address,
    abi: contractABI,
    functionName: "storeHash",
    args: [storedHash],
    enabled: Boolean(storedHash)
  });

  const { write: storeHash } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log("Write operation is successful", data);
      setTransactionHash(data.hash);
      setSubmitFlag(false);
      setSignFlag(true);
    },
    onError(error) {
      console.log("Write operation is unsuccessful", error);
    }
  });

  const getHash = useContractRead({
    address: contractAddr as Address,
    abi: contractABI,
    functionName: "getHash",
    args: [address],
    enabled: Boolean(address),
    onSuccess(data) {
      console.log("Read operation is successful", data);
      if (data !== "") setExistingHash(data as string);
    }
  });

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: imageDataToBase64(imageData ? imageData : new ImageData(1, 1)),
    onSuccess(data) {
      console.log("Sign operation is successful", data);
      setStoredHash(data);
      setSubmitFlag(true);
      setSignFlag(false);
    }
  })

  useEffect(() => {
    if (isConnected) {
      getHash.refetch();
      setContractAddress(contractAddr);
      setSignFlag(true);
    }
    else if (isDisconnected) {
      clearAllStates();
      setSignFlag(false);
      setSubmitFlag(false);
    }
  }, [isConnected, isDisconnected]);

  // Conditional function to render buttons
  const renderButtons = () => {
    if (isConnected) {
      if (signFlag) {
        return (
          <Button
            fullWidth
            variant="contained"
            sx={{ borderRadius: "20px" }}
            onClick={debounceOnSign}
          >
            Click here to sign your signature
          </Button>
        );
      }
      else if (submitFlag) {
        return (
          <Button
            fullWidth
            variant="contained"
            sx={{ borderRadius: "20px" }}
            onClick={debounceOnSubmit}
          >
            Click here to submit
          </Button>
        );
      }
    }
    else {
      return (
        <Button
          fullWidth
          variant="contained"
          sx={{ borderRadius: "20px" }}
          disabled
        >
          Please login to sign
        </Button>
      );
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid xs={12} sm={12} md={8} flexDirection="column" display="flex" gap={2}>
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
        {renderButtons()}
      </Grid>
      <Grid xs={12} sm={12} md={4} flexDirection="column" display="flex" gap={2}>
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
                  primaryTypographyProps={{
                    style: {
                      color: "red",
                    }
                  }}
                  secondaryTypographyProps={{
                    style: {
                      overflowWrap: "break-word",
                    }
                  }}
                />
              </ListItem>
            )
          }
          <ListItem>
            <ListItemText
              primary="Stored Hash"
              secondary={storedHash ? storedHash : "-"}
              secondaryTypographyProps={{
                style: {
                  overflowWrap: "break-word",
                }
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Transaction Hash"
              secondary={transactionHash ? transactionHash : "-"}
              secondaryTypographyProps={{
                style: {
                  overflowWrap: "break-word",
                }
              }}
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

export default App;
