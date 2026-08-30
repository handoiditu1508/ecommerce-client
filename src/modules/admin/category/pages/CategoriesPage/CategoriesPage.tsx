import CONFIG from "@/configs";
import { CountCategoriesQuery } from "@/models/apis/category/getCategories";
import { CategoryView } from "@/models/entities/Category";
import { useCountCategoriesQuery, useGetCategoriesQuery } from "@/redux/apis/categoryApi";
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
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import CategoryFilters from "./CategoryFilters";

function CategoriesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(["admin-category", "translation", "admin"]);
  const [filters, setFilters] = useState<CountCategoriesQuery>({});
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const formContext = useForm<CountCategoriesQuery>({ defaultValues: filters });
  const activeSort = sortModel[0];
  const categoriesResult = useGetCategoriesQuery({
    ...filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountCategoriesQuery(filters);
  const categories = useMemo(() => categoriesResult.data ?? [], [categoriesResult.data]);
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const columns = useMemo<GridColDef<CategoryView>[]>(() => [
    {
      field: "iconPath",
      headerName: t("icon"),
      width: 90,
      sortable: false,
      renderCell: ({ row }) => (
        row.iconPath
          ? <Avatar
            alt={row.name}
            src={CONFIG.FILE_URL + row.iconPath}
            variant="rounded"
            sx={{
              mx: "auto",
              mt: "14px", // (68 - 40) / 2
            }}
          />
          : null
      ),
    },
    { field: "name", headerName: t("category_name"), flex: 1, minWidth: 180 },
    {
      field: "parentId",
      headerName: t("parent_category"),
      width: 200,
      renderCell: ({ value }) => (value === undefined ? null : categoryById.get(value)),
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
        <Tooltip title={t("edit_category")}>
          <IconButton
            size="small"
            aria-label={t("edit_category")}
            onClick={() => navigate(`/admin/categories/${row.id}`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ], [categoryById, navigate, t]);

  const handleFilter = (data: CountCategoriesQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:categories")}</Typography>
        <Button component={Link} to="/admin/categories/new" startIcon={<AddIcon />}>
          {t("admin:create_category")}
        </Button>
      </Box>
      <CategoryFilters categories={categories} formContext={formContext} onSubmit={handleFilter} />
      <DataGrid
        rows={categories}
        columns={columns}
        rowCount={countResult.data ?? 0}
        rowHeight={68}
        loading={categoriesResult.isFetching || countResult.isFetching}
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
        onRowDoubleClick={({ id }) => navigate(`/admin/categories/${id}`)}
      />
    </Paper>
  );
}

export default CategoriesPage;
