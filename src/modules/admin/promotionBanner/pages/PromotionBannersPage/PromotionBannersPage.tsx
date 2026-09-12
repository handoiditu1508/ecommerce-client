import CONFIG from "@/configs";
import { ConfirmationDialogContext } from "@/features/confirmationDialog";
import useAppDispatch from "@/hooks/useAppDispatch";
import PromotionBanner, { PromotionBannerStatus } from "@/models/entities/PromotionBanner";
import { useCountPromotionBannersQuery, useDeletePromotionBannerMutation, useGetPromotionBannersQuery } from "@/redux/apis/promotionBannerApi";
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
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

function PromotionBannersPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-promotion-banner", "admin", "translation"]);
  const confirmationDialog = useContext(ConfirmationDialogContext);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const activeSort = sortModel[0];
  const promotionBannersResult = useGetPromotionBannersQuery({
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountPromotionBannersQuery({});
  const [deletePromotionBanner, deleteResult] = useDeletePromotionBannerMutation();
  const promotionBanners = useMemo(() => promotionBannersResult.data ?? [], [promotionBannersResult.data]);

  const handleDelete = useCallback((promotionBanner: PromotionBanner) => {
    confirmationDialog.openDialog(t("delete_promotion_banner"), {
      description: t("delete_promotion_banner_confirmation"),
      confirmButtonText: t("delete"),
      onConfirm: async () => {
        confirmationDialog.setLoading(true);
        try {
          await deletePromotionBanner({ promotionBannerId: promotionBanner.id }).unwrap();
          dispatch(pushNotification({
            text: t("promotion_banner_deleted_successfully"),
            severity: "success",
          }));
          promotionBannersResult.refetch();
        } catch {
        } finally {
          confirmationDialog.setLoading(false);
        }
      },
    });
  }, [confirmationDialog, deletePromotionBanner, dispatch, promotionBannersResult, t]);

  const columns = useMemo<GridColDef<PromotionBanner>[]>(() => [
    {
      field: "imagePath",
      headerName: t("image"),
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Avatar
          alt=""
          src={CONFIG.FILE_URL + row.imagePath}
          variant="rounded"
          sx={{
            mx: "auto",
            mt: "14px", // (68 - 40) / 2
          }}
        />
      ),
    },
    { field: "promotionId", headerName: t("promotion"), flex: 1, minWidth: 120 },
    {
      field: "isVisible",
      headerName: t("visible_on_slider"),
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={t(value ? "visible" : "hidden")}
          color={value ? "success" : "default"}
        />
      ),
    },
    {
      field: "status",
      headerName: t("status"),
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={t(value === PromotionBannerStatus.Active ? "active" : "disabled")}
          color={value === PromotionBannerStatus.Active ? "success" : "default"}
        />
      ),
    },
    { field: "sortOrder", headerName: t("sort_order"), width: 120 },
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
          <Tooltip title={t("edit_promotion_banner")}>
            <IconButton
              size="small"
              aria-label={t("edit_promotion_banner")}
              onClick={() => navigate(`/admin/promotion-banners/${row.id}`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("delete_promotion_banner")}>
            <IconButton
              size="small"
              color="error"
              aria-label={t("delete_promotion_banner")}
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

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:promotion_banners")}</Typography>
        <Button component={Link} to="/admin/promotion-banners/new" startIcon={<AddIcon />}>
          {t("admin:create_promotion_banner")}
        </Button>
      </Box>
      <DataGrid
        rows={promotionBanners}
        columns={columns}
        rowCount={countResult.data ?? 0}
        rowHeight={68}
        loading={promotionBannersResult.isFetching || countResult.isFetching}
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
        onRowDoubleClick={({ id }) => navigate(`/admin/promotion-banners/${id}`)}
      />
    </Paper>
  );
}

export default PromotionBannersPage;
