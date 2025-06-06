import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
  DialogActions
} from '@mui/material';
import { toast } from 'react-toastify';
import { uploadStorageImage, deleteImage } from '../services/imageService';

const StorageCard = ({ storage, isSelected, onClick, onImageDeleted }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [storageImageUrl, setStorageImageUrl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { streetName, cityName, countryIso } = storage.location;
  const { name: teamName, description: teamDescription, countryIso: teamCountry } = storage.team;

  useEffect(() => {
    if (storage.image) {
      const url = URL.createObjectURL(storage.image);
      setStorageImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setStorageImageUrl(null);
      };
    } else {
      setStorageImageUrl(null);
    }
  }, [storage.image]);

  const handleFile = (file) => {
    if (!file) return;

    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Only JPG and PNG images are allowed.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return false;
    }

    setSelectedFile(file);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await uploadStorageImage(storage.id, selectedFile);
      toast.success('Image uploaded successfully!');
      handleCloseModal();
      if (onImageDeleted) {
        onImageDeleted();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setFileName('');
    setImagePreview('');
    setModalOpen(false);
    setDragActive(false);
  };

  const handleDeleteConfirm = async () => {
    if (!storage.imageId) {
      toast.error("No image to delete.");
      return;
    }
    try {
      setIsDeleting(true);
      await deleteImage(storage.imageId);
      setIsDeleting(false);
      toast.success("Image deleted successfully.");
      if (onImageDeleted) {
        setOpenDeleteModal(false);
        onImageDeleted();
      }
    } catch (error) {
      setIsDeleting(false);
      toast.error(error.message || "Failed to delete image.");
    }
    setOpenDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
  };

  return (
    <>
      <Card
        onClick={onClick}
        sx={{
          border: isSelected ? "2px solid #1976d2" : "1px solid #ccc",
          cursor: "pointer",
          transition: "0.3s",
          "&:hover": { boxShadow: 3 },
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px",
          height: "auto",
          minHeight: 180,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 150,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {storageImageUrl ? (
            <img
              src={storageImageUrl}
              alt={`Storage ${storage.id}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              No image available
            </Typography>
          )}
        </Box>

        <CardContent sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}>
          <div>
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              <strong>ID:</strong> {storage.id}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              <strong>Address:</strong> {`${streetName}, ${cityName}, ${countryIso}`}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              <strong>Capacity:</strong> {storage.capacity}
            </Typography>
          </div>

          <Paper elevation={1} sx={{
            mt: 2,
            p: 1.5,
            backgroundColor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "auto",
            maxHeight: 100,
            "&::-webkit-scrollbar": {
              width: "0px",
            },
          }}>
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              <strong>Team:</strong> {teamName} ({teamCountry})
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "black" }}>
              <strong>Description:</strong> {teamDescription}
            </Typography>
          </Paper>

          <Button
            variant="contained"
            color={storage.image ? "error" : "primary"}
            sx={{ mt: 2, alignSelf: "start" }}
            onClick={(e) => {
              e.stopPropagation();
              storage.image ? setOpenDeleteModal(true) : setModalOpen(true);
            }}
          >
            {storage.image ? "Remove Image" : "Upload Image"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 2,
              border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
              borderRadius: '4px',
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: dragActive ? '#e3f2fd' : 'transparent',
              transition: 'background-color 0.3s, border-color 0.3s'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              Drag & drop an image here, or click to select a file
            </Typography>
            <Button
              variant="outlined"
              component="label"
            >
              Choose Image
              <input
                id="fileInput"
                type="file"
                hidden
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          {fileName && (
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              Selected file: {fileName}
            </Typography>
          )}

          {imagePreview && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
              mb: 2,
              maxHeight: '300px',
              overflow: 'hidden'
            }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '4px'
                }}
              />
            </Box>
          )}

          <Typography variant="caption" color="textSecondary">
            Allowed formats: JPG, PNG (max 5MB)
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!selectedFile || isUploading}
            startIcon={isUploading ? <CircularProgress size={20} /> : null}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the image?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StorageCard;
