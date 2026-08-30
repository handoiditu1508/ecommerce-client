import { toVndCurrency } from "@/common/format";
import { CountInvoiceDiscountsQuery } from "@/models/apis/invoiceDiscount/getInvoiceDiscounts";
import { InvoiceDiscountView } from "@/models/entities/InvoiceDiscount";
import { PromotionStatus } from "@/models/entities/Promotion";
import { useCountInvoiceDiscountsQuery, useGetInvoiceDiscountsQuery } from "@/redux/apis/invoiceDiscountApi";
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
import InvoiceDiscountFilters from "./InvoiceDiscountFilters";

function InvoiceDiscountsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["admin-invoice-discount", "admin", "translation"]);
  const [filters, setFilters] = useState<CountInvoiceDiscountsQuery>({});
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const formContext = useForm<CountInvoiceDiscountsQuery>({ defaultValues: filters });
  const activeSort = sortModel[0];
  const invoiceDiscountsResult = useGetInvoiceDiscountsQuery({
    ...filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountInvoiceDiscountsQuery(filters);

  const columns: GridColDef<InvoiceDiscountView>[] = [
    { field: "name", headerName: t("admin:name"), flex: 1, minWidth: 180 },
    { field: "discountCode", headerName: t("admin-invoice-discount:discount_code"), width: 160 },
    {
      field: "discountValue",
      headerName: t("admin-invoice-discount:discount_value"),
      width: 150,
      valueFormatter: (value, row) => (row.isPercentage ? `${value}%` : toVndCurrency(value)),
    },
    {
      field: "startDate",
      headerName: t("admin-invoice-discount:start_date"),
      width: 180,
      valueFormatter: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage) : ""),
    },
    {
      field: "endDate",
      headerName: t("admin-invoice-discount:end_date"),
      width: 180,
      valueFormatter: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage) : ""),
    },
    {
      field: "status",
      headerName: t("admin-invoice-discount:statuses"),
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={t(value === PromotionStatus.Active ? "admin-invoice-discount:active" : "admin-invoice-discount:disabled")}
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
        <Tooltip title={t("admin-invoice-discount:update_invoice_discount")}>
          <IconButton
            size="small"
            aria-label={t("admin-invoice-discount:update_invoice_discount")}
            onClick={() => navigate(`/admin/promotions/invoice-discounts/${row.id}`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleFilter = (data: CountInvoiceDiscountsQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:invoice_discounts")}</Typography>
        <Button component={Link} to="/admin/promotions/invoice-discounts/new" startIcon={<AddIcon />}>
          {t("admin:create_invoice_discount")}
        </Button>
      </Box>
      <InvoiceDiscountFilters formContext={formContext} onSubmit={handleFilter} />
      <DataGrid
        rows={invoiceDiscountsResult.data ?? []}
        columns={columns}
        rowCount={countResult.data ?? 0}
        loading={invoiceDiscountsResult.isFetching || countResult.isFetching}
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
        onRowDoubleClick={({ id }) => navigate(`/admin/promotions/invoice-discounts/${id}`)}
      />
    </Paper>
  );
}

export default InvoiceDiscountsPage;
