import { useState, useEffect } from "react";
import { getTransportCompanies, deleteTransportCompany, addTransportCompany } from "../services/transportCompanyService";
import { FaTrash, FaPlus } from "react-icons/fa";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Paper,
  IconButton,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import AddTransportCompanyModal from "./AddTransportCompanyModal";

const TransportCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null)
  const [error, setError] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserRole(storedUser?.role);
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getTransportCompanies();
      setCompanies(data.content);
      setPagination(prev => ({
        ...prev,
        page: data.pageNumber,
        size: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      }));
      setError(null);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to load transport companies");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handlePageChange = (event, newPage) => {
    fetchCompanies(newPage - 1);
  };

  const handleSizeChange = (event) => {
    const newSize = event.target.value;
    setPagination(prev => ({ ...prev, size: newSize }));
    fetchCompanies(0, newSize);
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTransportCompany(companyToDelete.id);
      fetchCompanies();
      setOpenDeleteModal(false);
      toast.success('Transport company deleted successfully!');
    } catch (err) {
      setOpenDeleteModal(false);
      toast.error('Failed to delete company. Try again later.');
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    setCompanyToDelete(null);
  };

  const handleAddCompany = async (newCompany) => {
    try {
      await addTransportCompany(newCompany);
      fetchCompanies();
      setOpenAddModal(false);
      toast.success('Transport company added successfully!');
    } catch (err) {
      toast.error('Failed to add company. Try again later.');
    }
  };

  if (loading && pagination.page === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
    }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Transport Companies ({companies.length})</Typography>
        {["Admin"].includes(userRole) && (
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setOpenAddModal(true)} 
              startIcon={<FaPlus />}
            >
              Add Company
            </Button>
          </Box>
        )}
      </Box>
                
      <Box
        sx={{
          flex: 1,
           overflowY: "auto",

          "&::-webkit-scrollbar": {
            width: "0px",
            height: "0px",
          },

          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },

          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
          },

          scrollbarWidth: "none",
          scrollbarColor: "transparent transparent",
        }}
      >
        {error ? (
          <Typography variant="body1" color="error" sx={{ textAlign: "center", mt: 3 }}>
            Transport companies couldn't be loaded. Try again later.
          </Typography>
        ) : companies.length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center", mt: 3 }}>
            There are currently no transport companies to display.
          </Typography>
        ) : (
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 2,
            pb: 2
          }}>
            {companies.map((company) => (
              <Box 
                key={company.id} 
                sx={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  gap: 1,
                  width: "100%",
                  minHeight: "110px",
                }}
              >
                <Card sx={{
                  flex: 1,
                  height: "130px",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #ccc",
                  minWidth: 0, 
                }}>
                  <CardContent sx={{ 
                    p: "12px !important",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    '&:last-child': { pb: '12px' }
                  }}>
                    <Box sx={{ 
                      display: "flex", 
                      mb: 1,
                      minWidth: 0 
                    }}>
                      <Typography sx={{ 
                        fontSize: "14px", 
                        fontWeight: "bold",
                        color: "black",
                        mr: 1,
                        flexShrink: 0 
                      }}>
                        ID:
                      </Typography>
                      <Typography sx={{ 
                        fontSize: "14px", 
                        color: "black",
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minWidth: 0 
                      }}>
                        {company.id}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: "flex", 
                      mb: 1,
                      minWidth: 0 
                    }}>
                      <Typography sx={{ 
                        fontSize: "14px", 
                        fontWeight: "bold",
                        color: "black",
                        mr: 1,
                        flexShrink: 0 
                      }}>
                        Name:
                      </Typography>
                      <Typography sx={{ 
                        fontSize: "14px", 
                        color: "black",
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minWidth: 0 
                      }}>
                        {company.name}
                      </Typography>
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        flexGrow: 1,
                        p: 1,
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ 
                        display: "flex",
                        minWidth: 0,
                        flexGrow: 1,
                        overflow: "hidden",
                      }}>
                        <Typography sx={{ 
                          fontSize: "14px", 
                          fontWeight: "bold",
                          color: "black",
                          mr: 1,
                          flexShrink: 0 
                        }}>
                          Description:
                        </Typography>
                        <Typography sx={{ 
                          fontSize: "14px", 
                          color: "black",
                          overflow: "auto",
                          "&::-webkit-scrollbar": {
                            width: "6px",
                            height: "6px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0,0,0,0.2)",
                            borderRadius: "3px",
                          },
                        }}>
                          {company.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </CardContent>
                </Card>

                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(company);
                  }} 
                  color="error"
                  size="medium"
                  sx={{ 
                    mt: '33px',
                    backgroundColor: "white",
                    boxShadow: "none",
                    '&:hover': {
                      backgroundColor: "#f5f5f5"
                    }
                  }}
                >
                  <FaTrash />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
        <Box sx={{ height: "150px" }} />
      </Box>

      <AddTransportCompanyModal 
        open={openAddModal} 
        onClose={() => setOpenAddModal(false)} 
        onCompanyAdded={handleAddCompany} 
      />

      <Dialog open={openDeleteModal} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{companyToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransportCompanies;