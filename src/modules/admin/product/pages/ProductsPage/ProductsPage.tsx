import { toVndCurrency } from "@/common/format";
import CONFIG from "@/configs";
import { ConfirmationDialogContext } from "@/features/confirmationDialog";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { CountProductsQuery } from "@/models/apis/product/getProducts";
import { ProductView } from "@/models/entities/Product";
import { useGetCategoryTreesQuery } from "@/redux/apis/categoryApi";
import {
  useCountProductsQuery,
  useDeleteProductMutation,
  useGetProductsQuery,
  useRecoverProductMutation,
} from "@/redux/apis/productApi";
import { categorySelectors } from "@/redux/slices/categorySlice";
import { pushNotification } from "@/redux/slices/notificationSlice";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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
import ProductFilters from "./ProductFilters";

function ProductsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["admin-product", "translation", "admin"]);
  const confirmationDialog = useContext(ConfirmationDialogContext);
  useGetCategoryTreesQuery();
  const categories = useAppSelector(categorySelectors.tree);
  const categoryById = useMemo(() => {
    const result = new Map<number, string>();
    const visit = (items: typeof categories) => items.forEach((category) => {
      result.set(category.id, category.name);
      visit(category.children);
    });
    visit(categories);

    return result;
  }, [categories]);
  const [filters, setFilters] = useState<CountProductsQuery>({
    categoryIds: [],
    includeSubCategories: false,
    isDeleted: false,
  });
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const formContext = useForm<CountProductsQuery>({ defaultValues: filters });
  const activeSort = sortModel[0];
  const productsResult = useGetProductsQuery({
    ...filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountProductsQuery(filters);
  const [deleteProduct, deleteResult] = useDeleteProductMutation();
  const [recoverProduct, recoverResult] = useRecoverProductMutation();

  const notifySuccess = useCallback((text: string) => {
    dispatch(pushNotification({ text, severity: "success" }));
  }, [dispatch]);

  const handleDelete = useCallback((product: ProductView) => {
    confirmationDialog.openDialog(t("delete_product"), {
      description: t("delete_product_confirmation", { name: product.name }),
      confirmButtonText: t("delete"),
      onConfirm: async () => {
        confirmationDialog.setLoading(true);
        try {
          await deleteProduct({ productId: product.id }).unwrap();
          notifySuccess(t("product_deleted_successfully"));
          productsResult.refetch();
        } catch {
        } finally {
          confirmationDialog.setLoading(false);
        }
      },
    });
  }, [confirmationDialog, deleteProduct, notifySuccess, productsResult, t]);

  const handleRecover = useCallback(async (product: ProductView) => {
    try {
      await recoverProduct({ productId: product.id }).unwrap();
      notifySuccess(t("product_recovered_successfully"));
      productsResult.refetch();
    } catch {}
  }, [notifySuccess, productsResult, recoverProduct, t]);

  const columns = useMemo<GridColDef<ProductView>[]>(() => [
    {
      field: "thumbnailPath",
      headerName: t("thumbnail"),
      width: 90,
      sortable: false,
      renderCell: ({ row }) => (
        <Box
          component="img"
          src={CONFIG.FILE_URL + row.thumbnailPath}
          alt={row.name}
          sx={{
            width: 52,
            height: 52,
            objectFit: "cover",
            borderRadius: 1,
            mx: "auto",
            mt: "8px", // (68 - 52) / 2
            display: "block",
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: t("product_name"),
      flex: 1,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <span>{row.name}</span>
          {row.isDeleted && (
            <Tooltip title={t("deleted")}>
              <WarningAmberIcon color="warning" fontSize="small" />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: "price",
      headerName: t("price"),
      width: 140,
      valueFormatter: (value) => toVndCurrency(value),
    },
    {
      field: "discountPrice",
      headerName: t("discount_price"),
      width: 190,
      renderCell: ({ row }) => (
        <Box>
          {toVndCurrency(row.discountPrice)}
          {row.discountPercentage > 0 && ` (-${row.discountPercentage}%)`}
        </Box>
      ),
    },
    {
      field: "categoryId",
      headerName: t("category"),
      width: 160,
      renderCell: ({ value }) => {
        const categoryName = value === undefined ? undefined : categoryById.get(value);

        return categoryName
          ? (
            <Chip
              size="small"
              label={categoryName}
              sx={{ color: "white", bgcolor: `hsl(${(value * 137.508) % 360} 55% 42%)` }}
            />
          )
          : null;
      },
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
          <Tooltip title={t("edit_product")}>
            <IconButton
              size="small"
              aria-label={t("edit_product")}
              onClick={() => navigate(`/admin/products/${row.id}`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t(row.isDeleted ? "recover_product" : "delete_product")}>
            <IconButton
              size="small"
              color={row.isDeleted ? "success" : "error"}
              disabled={deleteResult.isLoading || recoverResult.isLoading}
              onClick={() => row.isDeleted ? handleRecover(row) : handleDelete(row)}
            >
              {row.isDeleted ? <RestoreIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ], [
    categoryById,
    deleteResult.isLoading,
    handleDelete,
    handleRecover,
    navigate,
    recoverResult.isLoading,
    t,
  ]);

  const handleFilter = (data: CountProductsQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:products")}</Typography>
        <Button component={Link} to="/admin/products/new" startIcon={<AddIcon />}>
          {t("admin:create_product")}
        </Button>
      </Box>
      <ProductFilters categories={categories} formContext={formContext} onSubmit={handleFilter} />
      <DataGrid
        rows={productsResult.data ?? []}
        columns={columns}
        rowCount={countResult.data ?? 0}
        rowHeight={68}
        loading={productsResult.isFetching || countResult.isFetching}
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
        onRowDoubleClick={({ id }) => navigate(`/admin/products/${id}`)}
      />
    </Paper>
  );
}

export default ProductsPage;
