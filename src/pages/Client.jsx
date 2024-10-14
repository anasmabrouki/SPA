import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { getSharepointSites } from "../services/sharepointService";
import { loginRequest } from '../authConfig';
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export default function Client() {
    const location = useLocation();
    const [sites, setSites] = useState([]);
    const [selectedTargetSite, setSelectedSite] = useState("");
    const { instance, accounts } = useMsal();
    const { selectedSite, selectedLists, selectedFlows } = location.state || {};
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSites = async () => {
            try {
                let response = null
                if (accounts.length === 1){
                    response = await instance.loginPopup({
                        ...loginRequest,
                        prompt: "select_account"
                    });
                } else {
                    instance.setActiveAccount(accounts[1])
                    response = await instance.acquireTokenSilent({
                        ...loginRequest,
                        authority: `https://login.microsoftonline.com/${accounts[1].tenantId}`,
                      });
                }
                
                console.log(accounts)
                const sitesResponse = await getSharepointSites(response.accessToken);
                instance.setActiveAccount(accounts[0])
                setSites(sitesResponse.value);
            } catch (error) {
                console.error("Error fetching sites:", error);
            }
        };

        fetchSites();
    }, [instance, accounts]);

    const handleSiteChange = (event) => {
        setSelectedSite(event.target.value);
    };

    const getTenantName = (email) => {
        var parts = email.split('@')
        parts = parts[1].split('.')
        return parts[0]
    }



    const handleMigration = async () => {
        try {
            // Set active account for target
            instance.setActiveAccount(accounts[1]);
            let tenantName = getTenantName(accounts[1].username);
            let targetJwt;
            try {
                targetJwt = await instance.acquireTokenSilent({
                    scopes: [`https://${tenantName}.sharepoint.com/AllSites.FullControl`],
                    authority: `https://login.microsoftonline.com/${accounts[1].tenantId}`,
                });
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    console.error("Interaction required for target account:", error);
                    await instance.acquireTokenRedirect({
                        scopes: [`https://${tenantName}.sharepoint.com/AllSites.FullControl`],
                        authority: `https://login.microsoftonline.com/${accounts[1].tenantId}`,
                    });
                    return; // Exit the function to handle the redirect
                } else {
                    console.error("Unexpected error for target account:", error);
                    return;
                }
            }
    
            // Set active account for source
            instance.setActiveAccount(accounts[0]);
            tenantName = getTenantName(accounts[0].username);
            let sourceJwt;
            try {
                sourceJwt = await instance.acquireTokenSilent({
                    scopes: [`https://${tenantName}.sharepoint.com/MyFiles.Write`],
                    authority: `https://login.microsoftonline.com/${accounts[0].tenantId}`,
                });
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    console.error("Interaction required for source account:", error);
                    await instance.acquireTokenRedirect({
                        scopes: [`https://${tenantName}.sharepoint.com/MyFiles.Write`],
                        authority: `https://login.microsoftonline.com/${accounts[0].tenantId}`,
                    });
                    return; // Exit the function to handle the redirect
                } else {
                    console.error("Unexpected error for source account:", error);
                    return;
                }
            }
    
            // Navigate to migration page
            navigate('/migration', {
                state: { selectedSite, selectedLists, selectedFlows, selectedTargetSite, sourceJwt, targetJwt }
            });
        } catch (error) {
            console.error("General error during migration:", error);
        }
    };


    return (
        <div className="DialogDiv" style={{ marginTop: "30px", width: "100%" }}>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth style={{ backgroundColor: "gainsboro" }}>
                    <InputLabel id="site-select-label">Select Site</InputLabel>
                    <Select
                        labelId="site-select-label"
                        id="site-select"
                        value={selectedTargetSite}
                        label="Select Site"
                        onChange={handleSiteChange}
                    >
                        {sites.map((site) => (
                            <MenuItem key={site.id} value={site}>
                                {site.displayName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "20px" }}
                    onClick={handleMigration}
                >
                    Confirm
                </Button>
            </Box>
        </div>
    );
}
