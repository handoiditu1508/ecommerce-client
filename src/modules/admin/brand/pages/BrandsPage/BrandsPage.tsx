import CONFIG from "@/configs";
import { CountBrandsQuery } from "@/models/apis/brand/getBrands";
import Brand from "@/models/entities/Brand";
import { useCountBrandsQuery, useGetBrandsQuery } from "@/redux/apis/brandApi";
import AddIcon from "@mui/icons-material/Add";
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
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BrandFilters from "./BrandFilters";

function BrandsPage() {
  const { t } = useTranslation("admin-brand");
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
  const brands = useMemo(() => brandsResult.data ?? [], [brandsResult.data]);

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
        <Chip size="small" label={t(value ? "yes" : "no")} color={value ? "success" : "default"} />
      ),
    },
    {
      field: "actions",
      headerName: t("actions"),
      width: 80,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: () => (
        <Tooltip title={t("not_supported_yet")}>
          <span>
            <IconButton size="small" aria-label={t("edit_brand")} disabled>
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
  ], [t]);

  const handleFilter = (data: CountBrandsQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("brands")}</Typography>
        <Tooltip title={t("not_supported_yet")}>
          <span>
            <Button startIcon={<AddIcon />} disabled>
              {t("create_brand")}
            </Button>
          </span>
        </Tooltip>
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
      />
    </Paper>
  );
}

export default BrandsPage;
