import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Import WAGMI
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const NavBar = () => {

    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { disconnect } = useDisconnect();

    return (
        <Box borderRadius={2} sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <span>&#128271;</span>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SBIP
                    </Typography>
                    {isConnected ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                            <Typography variant="body1">Connected to {address?.substring(0, 6)}...</Typography>
                            <Button variant="contained" color="error" onClick={disconnect as any}>
                                Disconnect
                            </Button>
                        </div>
                    ) : (
                        <Button variant="contained" color="warning" onClick={connect as any}>
                            Connect
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;
