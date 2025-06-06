import { useState, useEffect } from "react";
import { getCarParts } from "../services/carPartService"; 
import { FaPlus } from "react-icons/fa";
import CarPartList from "./CarPartList";
import AddCarPartModal from "./AddCarPartModal";
import { Button, CircularProgress, Box, Typography } from "@mui/material";

const CarParts = () => {
  const [carParts, setCarParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserRole(storedUser?.role);
  }, []);

  const fetchCarParts = async () => {
    try {
      setLoading(true);
      const data = await getCarParts();  
      setCarParts(data.content);
      setError(null);
    } catch (err) {
      console.error("Error fetching car parts:", err);
      setError("Failed to load car parts");
      setCarParts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarParts();
  }, []);

  const getTitleByRole = (role) => {
    if (role === "Admin") return "Car Parts";
    if (role === "Mechanic" || role === "Logistic") return "Your Team's Car Parts";
    return "Car Parts";
  };

  if (loading) {
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
        <Typography variant="h4">
          {getTitleByRole(userRole)} ({carParts.length})
        </Typography>

        {userRole === "Logistic" && (
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAddModal(true)}
              startIcon={<FaPlus />}
            >
              Add Car Part
            </Button>
          </Box>
        )}
      </Box>

      <CarPartList 
        carParts={carParts} 
        error={error} 
      />

      <AddCarPartModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onCarPartAdded={fetchCarParts}
      />

      <Box sx={{ height: '300px', opacity: 0 }} />
    </Box>
  );
};

export default CarParts;
