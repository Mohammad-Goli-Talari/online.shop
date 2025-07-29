// src/components/admin/ProductTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Typography,
  useMediaQuery,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductTable = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>{product.id}</TableCell>
              <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>
                <Avatar
                  src={product.image}
                  variant="square"
                  sx={{ width: isMobile ? 32 : 48, height: isMobile ? 32 : 48 }}
                />
              </TableCell>
              <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>
                <Typography variant="body2" noWrap>
                  {product.title}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>${product.price}</TableCell>
              <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>{product.stock}</TableCell>
              <TableCell
                sx={{
                  py: isMobile ? 0.5 : 1,
                  color: product.status === 'published' ? 'green' : 'orange',
                }}
              >
                {product.status}
              </TableCell>
              <TableCell align="right" sx={{ py: isMobile ? 0.5 : 1 }}>
                {isMobile ? (
                  <>
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button size="small" color="error" variant="outlined">
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
