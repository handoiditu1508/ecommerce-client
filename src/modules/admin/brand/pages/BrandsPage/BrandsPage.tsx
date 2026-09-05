import CONFIG from "@/configs";
import { ConfirmationDialogContext } from "@/features/confirmationDialog";
import useAppDispatch from "@/hooks/useAppDispatch";
import { CountBrandsQuery } from "@/models/apis/brand/getBrands";
import Brand from "@/models/entities/Brand";
import { useCountBrandsQuery, useDeleteBrandMutation, useGetBrandsQuery } from "@/redux/apis/brandApi";
import { pushNotification } from "@/redux/slices/notificationSlice";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid/models";
import { useCallback, useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import BrandFilters from "./BrandFilters";

function BrandsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-brand", "admin", "translation", "product"]);
  const confirmationDialog = useContext(ConfirmationDialogContext);
  const [filters, setFilters] = useState<CountBrandsQuery>({});
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const formContext = useForm<CountBrandsQuery>({ defaultValues: filters });
  const activeSort = sortModel[0];
  const brandsResult = useGetBrandsQuery({
    ...filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountBrandsQuery(filters);
  const [deleteBrand, deleteResult] = useDeleteBrandMutation();
  const brands = useMemo(() => brandsResult.data ?? [], [brandsResult.data]);

  const handleDelete = useCallback((brand: Brand) => {
    confirmationDialog.openDialog(t("delete_brand"), {
      description: t("delete_brand_confirmation", { name: brand.name }),
      confirmButtonText: t("delete"),
      onConfirm: async () => {
        confirmationDialog.setLoading(true);
        try {
          await deleteBrand({ brandId: brand.id }).unwrap();
          dispatch(pushNotification({
            text: t("brand_deleted_successfully"),
            severity: "success",
          }));
          brandsResult.refetch();
        } catch {
        } finally {
          confirmationDialog.setLoading(false);
        }
      },
    });
  }, [confirmationDialog, deleteBrand, dispatch, brandsResult, t]);

  const columns = useMemo<GridColDef<Brand>[]>(() => [
    {
      field: "logoPath",
      headerName: t("logo"),
      width: 90,
      sortable: false,
      renderCell: ({ row }) => (
        row.logoPath
          ? <Avatar
            alt={row.name}
            src={CONFIG.FILE_URL + row.logoPath}
            variant="rounded"
            sx={{
              mx: "auto",
              mt: "14px", // (68 - 40) / 2
            }}
          />
          : null
      ),
    },
    { field: "name", headerName: t("brand_name"), flex: 1, minWidth: 180 },
    {
      field: "isTop",
      headerName: t("top_brand"),
      width: 130,
      renderCell: ({ value }) => (
        <Chip size="small" label={t(value ? "product:yes" : "product:no")} color={value ? "success" : "default"} />
      ),
    },
    {
      field: "actions",
      headerName: t("translation:actions"),
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <>
          <Tooltip title={t("edit_brand")}>
            <IconButton
              size="small"
              aria-label={t("edit_brand")}
              onClick={() => navigate(`/admin/brands/${row.id}`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("delete_brand")}>
            <IconButton
              size="small"
              color="error"
              aria-label={t("delete_brand")}
              disabled={deleteResult.isLoading}
              onClick={() => handleDelete(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ], [t, navigate, deleteResult.isLoading, handleDelete]);

  const handleFilter = (data: CountBrandsQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:brands")}</Typography>
        <Button component={Link} to="/admin/brands/new" startIcon={<AddIcon />}>
          {t("admin:create_brand")}
        </Button>
      </Box>
      <BrandFilters formContext={formContext} onSubmit={handleFilter} />
      <DataGrid
        rows={brands}
        columns={columns}
        rowCount={countResult.data ?? 0}
        rowHeight={68}
        loading={brandsResult.isFetching || countResult.isFetching}
        paginationMode="server"
        sortingMode="server"
        paginationModel={pagination}
        sortModel={sortModel}
        pageSizeOptions={[10, 25, 50]}
        disableColumnFilter
        disableColumnSelector
        onPaginationModelChange={setPagination}
        onSortModelChange={(model) => {
          setSortModel(model);
          setPagination((current) => ({ ...current, page: 0 }));
        }}
        onRowDoubleClick={({ id }) => navigate(`/admin/brands/${id}`)}
      />
    </Paper>
  );
}

export default BrandsPage;
