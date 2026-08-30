import CONFIG from "@/configs";
import { CountGiftsQuery } from "@/models/apis/gift/getGifts";
import { GiftView } from "@/models/entities/Gift";
import { useCountGiftsQuery, useGetGiftsQuery } from "@/redux/apis/giftApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import GiftFilters from "./GiftFilters";

function GiftsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-gift", "admin", "translation"]);
  const [filters, setFilters] = useState<CountGiftsQuery>({});
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const formContext = useForm<CountGiftsQuery>({ defaultValues: filters });
  const activeSort = sortModel[0];
  const giftsResult = useGetGiftsQuery({
    ...filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountGiftsQuery(filters);

  const columns: GridColDef<GiftView>[] = [
    {
      field: "thumbnailPath",
      headerName: t("admin-gift:thumbnail"),
      width: 90,
      sortable: false,
      renderCell: ({ row }) => (
        <Avatar
          alt={row.name}
          src={CONFIG.FILE_URL + row.thumbnailPath}
          variant="rounded"
          sx={{ mx: "auto", mt: "14px" }}
        />
      ),
    },
    { field: "name", headerName: t("admin:name"), flex: 1, minWidth: 180 },
    { field: "quantity", headerName: t("admin-gift:quantity"), width: 120 },
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
        <Tooltip title={t("update_gift")}>
          <IconButton
            size="small"
            aria-label={t("update_gift")}
            onClick={() => navigate(`/admin/gifts/${row.id}`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleFilter = (data: CountGiftsQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:gifts")}</Typography>
        <Button component={Link} to="/admin/gifts/new" startIcon={<AddIcon />}>
          {t("admin:create_gift")}
        </Button>
      </Box>
      <GiftFilters formContext={formContext} onSubmit={handleFilter} />
      <DataGrid
        rows={giftsResult.data ?? []}
        columns={columns}
        rowCount={countResult.data ?? 0}
        rowHeight={68}
        loading={giftsResult.isFetching || countResult.isFetching}
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
        onRowDoubleClick={({ id }) => navigate(`/admin/gifts/${id}`)}
      />
    </Paper>
  );
}

export default GiftsPage;
