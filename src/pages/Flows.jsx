import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
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
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ListSubheader from "@mui/material/ListSubheader";
import { useMsal } from "@azure/msal-react";
import { getEnvironments, getFlows } from '../services/flowService';

export default function Flows() {
    const [selectedEnvironment, setSelectedEnvironment] = useState("");
    const [environments, setEnvironments] = useState([]);
    const [checkedFlows, setCheckedFlows] = useState([]);
    const [flows, setFlows] = useState([]);
    const [selectedFlows, setSelectedFlows] = useState([]);

    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedSite, selectedLists } = location.state || {};

    useEffect(() => {
        const fetchEnvironments = async () => {
            const environmentsResponse = await getEnvironments();
            setEnvironments(environmentsResponse);
        };

        fetchEnvironments();
    }, [instance, accounts]);

    const handleEnvironmentChange = async (event) => {
        setSelectedEnvironment(event.target.value);
        const flowsResponse = await getFlows(event.target.value);
        setFlows(flowsResponse);
    };

    const handleFlowToggle = (flowName, flowId) => () => {
        const currentIndex = checkedFlows.indexOf(flowId);
        const newCheckedFlows = [...checkedFlows];

        if (currentIndex === -1) {
            newCheckedFlows.push(flowId);
            setSelectedFlows([...selectedFlows, flowName]);
        } else {
            newCheckedFlows.splice(currentIndex, 1);
            setSelectedFlows(selectedFlows.filter(item => item !== flowName));
        }

        setCheckedFlows(newCheckedFlows);
    };

    const handleFlowDelete = (flowName) => () => {
        setSelectedFlows(selectedFlows.filter(item => item !== flowName));
        setCheckedFlows(checkedFlows.filter(flowId => selectedFlows.indexOf(flowName) === -1));
    };

    const handleNavigate = () => {
        navigate(`/apps/${selectedEnvironment}`, { state: { selectedSite, selectedLists, selectedFlows } });
    };

    return (
        <div
            className="DialogDiv"
            style={{
                marginTop: "30px",
                marginLeft: 20,
                width: "100%",
                "@media (max-width: 768px)": { width: "40%" },
            }}
        >
            <Box>
                <FormControl fullWidth style={{ backgroundColor: "gainsboro" }}>
                    <InputLabel id="environment-select-label">
                        Environment
                    </InputLabel>
                    <Select
                        labelId="environment-select-label"
                        id="environment-select"
                        value={selectedEnvironment}
                        label="Environment"
                        onChange={handleEnvironmentChange}
                    >
                        {environments.map((env) => (
                            <MenuItem key={env.name} value={env.name}>
                                {env.properties.displayName}
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
                                marginTop: 10,
                            }}
                            component="div"
                            id="nested-list-subheader"
                        >
                            Flows
                        </ListSubheader>
                    }
                    aria-labelledby="nested-list-subheader"
                >
                    {flows.map((flow) => (
                        <ListItem
                            key={flow.name}
                            disablePadding
                            sx={{
                                bgcolor: checkedFlows.includes(flow.name) ? "grey.400" : "transparent",
                            }}
                        >
                            <ListItemButton role={undefined} onClick={handleFlowToggle(flow.properties.displayName, flow.name)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checkedFlows.indexOf(flow.name) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText primary={flow.properties.displayName} />
                                <ListItemText secondary={flow.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Stack direction="row" spacing={1} style={{ height: "55px" }}>
                    {selectedFlows.map((flowName) => (
                        <Chip
                            key={flowName}
                            label={flowName}
                            onDelete={handleFlowDelete(flowName)}
                        />
                    ))}
                </Stack>
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
