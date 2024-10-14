import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ListSubheader from "@mui/material/ListSubheader";
import Button from "@mui/material/Button";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../authConfig';
import { getSharepointLists, getSharepointSites } from "../services/sharepointService";

export function SharePointLists() {
  const [sites, setSites] = useState([]); // Store SharePoint sites
  const [selectedSite, setSelectedSite] = useState(""); // Store selected site
  const [siteLists, setSiteLists] = useState([]); // Store SharePoint site lists
  const [checked, setChecked] = useState([]);
  const [selectedLists, setSelectedLists] = useState([]);

  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  // Fetch SharePoint sites on component mount
  useEffect(() => {
    function fetchSites() {
      // Silently acquires an access token which is then attached to a request for MS Graph data
      instance
        .acquireTokenSilent({
          ...loginRequest,
          authority: `https://login.microsoftonline.com/${accounts[0].tenantId}`,
        })
        .then((response) => {
          getSharepointSites(response.accessToken).then((response) => setSites(response.value));
        })
        .catch((error) => {
          console.error("Error fetching sites:", error);
        });
    }

    fetchSites();
  }, [instance, accounts]);

  // Handle dropdown change (site selection)
  const handleSiteChange = async (event) => {
    const site = event.target.value;
    setSelectedSite(site);

    // Fetch lists for the selected site
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        authority: `https://login.microsoftonline.com/${accounts[0].tenantId}`,
      });
      const listsData = await getSharepointLists(response.accessToken, site.id);
      setSiteLists(listsData.value);
    } catch (error) {
      console.error("Error fetching SharePoint site lists:", error);
    }
  };

  const handleToggle = (site) => () => {
    const currentIndex = checked.indexOf(site.id);
    const newChecked = [...checked];
    const newSelected = [...selectedLists];

    if (currentIndex === -1) {
      newChecked.push(site.id)
      newSelected.push({'name' : site.displayName, 'url' : site.webUrl});
    } else {
      newChecked.splice(currentIndex, 1);
      newSelected.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setSelectedLists(newSelected)
  };

  const handleNavigate = () => {
    navigate('/flows', { state: { selectedSite, selectedLists } }); 
  };

  return (
    <div className="DialogDiv" style={{ marginTop: "30px", width:"100%" }}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl style={{ backgroundColor: "gainsboro" }} fullWidth>
          <InputLabel id="site-select-label">Site de collection</InputLabel>
          <Select
            labelId="site-select-label"
            id="site-select"
            value={selectedSite}
            label="Site de collection"
            onChange={handleSiteChange} // Handle site selection
          >
            {sites.map((site) => (
              <MenuItem key={site.id} value={site}>
                {site.displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader
              style={{
                backgroundColor: "#111",
                color: "white",
                position: "relative",
                fontSize: "20px",
                marginTop: "10px",
              }}
              component="div"
              id="nested-list-subheader"
            >
              Listes
            </ListSubheader>
          }
        >
          {siteLists.map((list) => (
            <ListItem
              key={list.id} // Ensure unique key for each ListItem
              disablePadding
              sx={{
                bgcolor: checked.includes(list.id) ? "grey.300" : "transparent",
              }}
            >
              <ListItemButton role={undefined} onClick={handleToggle(list)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(list.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={list.name} secondary={list.id} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigate}
          style={{ marginTop: "20px" }}
        >
          NEXT
        </Button>
      </Box>
    </div>
  );
}
