/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { migrateSharepointLists } from '../services/sharepointService';
import Button from "@mui/material/Button";

export default function Magration() {
  const location = useLocation();
  const { selectedSite, selectedLists, selectedFlows, selectedTargetSite, sourceJwt, targetJwt } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function startMigration() {
      try {
        await migrateSharepointLists(sourceJwt.accessToken, targetJwt.accessToken, selectedSite.webUrl, selectedTargetSite.webUrl, selectedLists);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    startMigration();
  }, [selectedSite, selectedLists, selectedFlows, selectedTargetSite, sourceJwt, targetJwt]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleNavigate = () => {
    navigate('/'); 
  };

  return (
    <div
      className="DialogDiv"
      style={{
        marginTop: "30px",
        width: "80%",
        "@media (max-width: 768px)": { width: "40%" },
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          border: "1px solid black",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: 2,
          fontSize: '12px'
        }}
      >
        <p>Components migration status</p>
        <p>Lists: {selectedLists.map(list => list.name).join(', ')}</p>
        <p>Multi Flows: {selectedFlows.join(', ')}</p>
        <p>Target Site: {selectedTargetSite.webUrl}</p>
      </div>
      <br />
      <Button
          variant="contained"
          color="primary"
          onClick={handleNavigate}
          style={{ marginTop: "20px" }}
        >
          New Migration
        </Button>
    </div>
  );
}
