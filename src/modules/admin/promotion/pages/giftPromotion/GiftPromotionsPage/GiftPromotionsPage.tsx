import { CountGiftPromotionsQuery } from "@/models/apis/giftPromotion/getGiftPromotions";
import { GiftPromotionView } from "@/models/entities/GiftPromotion";
import { PromotionStatus } from "@/models/entities/Promotion";
import { useCountGiftPromotionsQuery, useGetGiftPromotionsQuery } from "@/redux/apis/giftPromotionApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid/models";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import GiftPromotionFilters from "./GiftPromotionFilters";

function GiftPromotionsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["admin-gift-promotion", "admin", "translation"]);
  const [filters, setFilters] = useState<CountGiftPromotionsQuery>({});
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const formContext = useForm<CountGiftPromotionsQuery>({ defaultValues: filters });
  const activeSort = sortModel[0];
  const giftPromotionsResult = useGetGiftPromotionsQuery({
    ...filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountGiftPromotionsQuery(filters);

  const columns: GridColDef<GiftPromotionView>[] = [
    { field: "name", headerName: t("admin:name"), flex: 1, minWidth: 180 },
    {
      field: "startDate",
      headerName: t("admin-gift-promotion:start_date"),
      width: 180,
      valueFormatter: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage) : ""),
    },
    {
      field: "endDate",
      headerName: t("admin-gift-promotion:end_date"),
      width: 180,
      valueFormatter: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage) : ""),
    },
    {
      field: "status",
      headerName: t("admin-gift-promotion:statuses"),
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={t(value === PromotionStatus.Active ? "admin-gift-promotion:active" : "admin-gift-promotion:disabled")}
          color={value === PromotionStatus.Active ? "success" : "default"}
        />
      ),
    },
    {
      field: "actions",
      headerName: t("translation:actions"),
      width: 80,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Tooltip title={t("admin-gift-promotion:update_gift_promotion")}>
          <IconButton
            size="small"
            aria-label={t("admin-gift-promotion:update_gift_promotion")}
            onClick={() => navigate(`/admin/promotions/gift-promotions/${row.id}`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleFilter = (data: CountGiftPromotionsQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:gift_promotions")}</Typography>
        <Button component={Link} to="/admin/promotions/gift-promotions/new" startIcon={<AddIcon />}>
          {t("admin:create_gift_promotion")}
        </Button>
      </Box>
      <GiftPromotionFilters formContext={formContext} onSubmit={handleFilter} />
      <DataGrid
        rows={giftPromotionsResult.data ?? []}
        columns={columns}
        rowCount={countResult.data ?? 0}
        loading={giftPromotionsResult.isFetching || countResult.isFetching}
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
        onRowDoubleClick={({ id }) => navigate(`/admin/promotions/gift-promotions/${id}`)}
      />
    </Paper>
  );
}

export default GiftPromotionsPage;
