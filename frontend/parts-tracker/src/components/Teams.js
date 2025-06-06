import { useState, useEffect } from "react";
import { getTeams, getTeamById } from "../services/teamService";
import { FaPlus } from "react-icons/fa";
import TeamMembersModal from "./TeamMembersModal";
import AddTeamModal from "./AddTeamModal";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import TeamList from "./TeamList";
import PaginationControls from "./PaginationControls";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 1,
  });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openMembersModal, setOpenMembersModal] = useState(false);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setTeams(data.content);

      setError(null);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError("Failed to load teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamData = async (teamId) => {
    try {
      const team = await getTeamById(teamId);
      setSelectedTeam(team);
    } catch (err) {
      console.error("Failed to fetch team data:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [pagination.page, pagination.size]);

  const handleViewMembers = async (teamId) => {
    await fetchTeamData(teamId);
    setOpenMembersModal(true);
  };

  if (loading && pagination.page === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexShrink: 0,
        }}
      >
        <Typography variant="h4">Teams ({teams.length})</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddModal(true)}
          startIcon={<FaPlus />}
        >
          Add Team
        </Button>
      </Box>

      <TeamList 
        teams={teams} 
        error={error} 
        onViewMembers={handleViewMembers} 
      />

      <AddTeamModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        fetchTeams={() => fetchTeams()}
      />
      <TeamMembersModal
        open={openMembersModal}
        onClose={() => setOpenMembersModal(false)}
        team={selectedTeam}
        fetchTeamData={fetchTeamData}
      />
      <Box sx={{ height: '300px', opacity: 0 }} />
    </Box>
  );
};

export default Teams;
