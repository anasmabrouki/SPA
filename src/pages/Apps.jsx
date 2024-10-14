import React, { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import UploadIcon from "@mui/icons-material/Upload";
import ListSubheader from "@mui/material/ListSubheader";
import Button from "@mui/material/Button";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getApps } from '../services/appsService';

export default function Apps() {

    const { selectedEnvironment } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [checked, setChecked] = useState([0]);
    const [apps, setApps] = useState([]);
    const { selectedSite, selectedLists, selectedFlows } = location.state || {};

    useEffect(() => {
      const fetchApps = async () => {
              const appsResponse = await getApps(selectedEnvironment);
              setApps(appsResponse)
      };

      fetchApps();
  }, []);

    const handleToggle = (id) => () => {
        const currentIndex = checked.indexOf(id);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(id);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
      };
    const handleNavigate = () => {
      navigate("/client",  { state: { selectedSite, selectedLists, selectedFlows } });
    };

    return(
        <div
        className="DialogDiv"
        style={{
          marginTop:"30px",
          marginLeft: 20,
          width: "100%",
          "@media (max-width: 768px)": { width: "40%" },
        }}
      >
        <Box>
          <List
            sx={{ width: "100%", bgcolor: "background.paper" }}
            subheader={
              <ListSubheader
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  marginTop: 10,
                }}
                component="div"
                id="nested-list-subheader"
              >
                Apps
              </ListSubheader>
            }
            aria-labelledby="nested-list-subheader"
          ><table style={{width:'100%'}}>
            {apps.map((value) => {
              return (
                <tr>
                <ListItem
                  key={value.name}
                  disablePadding
                  sx={{
                    bgcolor: checked.includes(value.name)
                      ? "grey.400"
                      : "transparent",
                    alignItems: "center",
                  }}
                >
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value.name)}
                    dense
                  >
                    <ListItemIcon></ListItemIcon>
                    <td style={{width:'40%',marginLeft:'-5.5%'}}><ListItemText primary={value.properties.displayName} /></td>
                    <td style={{width:'50%'}}><ListItemText secondary={value.name} /></td>
                    <td style={{width:'25%'}}><ListItemText secondary={<a href={value.properties.appPlayUri}>link</a>} /></td>
                    <td style={{width:'5%'}}><ListItemText secondary={<UploadIcon />} /></td>
                  </ListItemButton>
                </ListItem>
                </tr>
              );
            })}</table>
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
    )
}