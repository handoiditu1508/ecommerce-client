import { CountProductDiscountsQuery } from "@/models/apis/productDiscount/getProductDiscounts";
import { ProductDiscountView } from "@/models/entities/ProductDiscount";
import { PromotionStatus } from "@/models/entities/Promotion";
import { useCountProductDiscountsQuery, useGetProductDiscountsQuery } from "@/redux/apis/productDiscountApi";
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
import ProductDiscountFilters from "./ProductDiscountFilters";

function ProductDiscountsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["admin-product-discount", "admin", "translation"]);
  const [filters, setFilters] = useState<CountProductDiscountsQuery>({});
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const formContext = useForm<CountProductDiscountsQuery>({ defaultValues: filters });
  const activeSort = sortModel[0];
  const productDiscountsResult = useGetProductDiscountsQuery({
    ...filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountProductDiscountsQuery(filters);

  const columns: GridColDef<ProductDiscountView>[] = [
    { field: "name", headerName: t("admin:name"), flex: 1, minWidth: 180 },
    {
      field: "startDate",
      headerName: t("admin-product-discount:start_date"),
      width: 180,
      valueFormatter: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage) : ""),
    },
    {
      field: "endDate",
      headerName: t("admin-product-discount:end_date"),
      width: 180,
      valueFormatter: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage) : ""),
    },
    {
      field: "status",
      headerName: t("admin-product-discount:statuses"),
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={t(value === PromotionStatus.Active ? "admin-product-discount:active" : "admin-product-discount:disabled")}
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
        <Tooltip title={t("admin-product-discount:update_product_discount")}>
          <IconButton
            size="small"
            aria-label={t("admin-product-discount:update_product_discount")}
            onClick={() => navigate(`/admin/promotions/product-discounts/${row.id}`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleFilter = (data: CountProductDiscountsQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:product_discounts")}</Typography>
        <Button component={Link} to="/admin/promotions/product-discounts/new" startIcon={<AddIcon />}>
          {t("admin:create_product_discount")}
        </Button>
      </Box>
      <ProductDiscountFilters formContext={formContext} onSubmit={handleFilter} />
      <DataGrid
        rows={productDiscountsResult.data ?? []}
        columns={columns}
        rowCount={countResult.data ?? 0}
        loading={productDiscountsResult.isFetching || countResult.isFetching}
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
        onRowDoubleClick={({ id }) => navigate(`/admin/promotions/product-discounts/${id}`)}
      />
    </Paper>
  );
}

export default ProductDiscountsPage;
