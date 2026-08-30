import { DynamicFormModel, DynamicGridForm } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import useAppSelector from "@/hooks/useAppSelector";
import { CountUsersQuery } from "@/models/apis/user/getUsers";
import { RoleView } from "@/models/entities/Role";
import { UserStatus, UserView } from "@/models/entities/User";
import { useGetRolesQuery } from "@/redux/apis/roleApi";
import { useCountUsersQuery, useGetUsersQuery } from "@/redux/apis/userApi";
import { roleSelectors } from "@/redux/slices/roleSlice";
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
import { GridColDef, GridPaginationModel, GridRenderCellParams, GridSortModel } from "@mui/x-data-grid/models";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const statusOptions = Object.values(UserStatus)
  .filter((value): value is UserStatus => typeof value === "number")
  .map((value) => ({
    key: value,
    label: value === UserStatus.Active ? "admin-user:active" : "admin-user:locked",
    value,
  }));

const filterModel: DynamicFormModel<CountUsersQuery> = {
  inputs: [
    { name: "username", inputType: "text", label: "auth:username", size: { sm: 4, md: 3 } },
    { name: "email", inputType: "text", label: "auth:email", size: { sm: 4, md: 3 } },
    { name: "name", inputType: "text", label: "admin-user:name", size: { sm: 4, md: 3 } },
    {
      name: "statuses",
      inputType: "select",
      label: "admin-user:statuses",
      multiple: true,
      showCheckbox: true,
      options: statusOptions,
      size: { sm: 6, md: 3 },
    },
    {
      name: "roles",
      inputType: "select",
      label: "admin-user:roles",
      multiple: true,
      showCheckbox: true,
      showSelectedAsChips: true,
      options: [],
      size: { sm: 6, md: 3 },
    },
  ],
  submitButtonText: "admin-user:apply_filters",
};

function UsersPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["admin-user", "auth", "translation", "admin"]);
  useGetRolesQuery({ allPages: true });
  const roles = useAppSelector(roleSelectors.all);
  const roleOptions = useMemo<DynamicInputOption<CountUsersQuery, "roles">[]>(
    () => roles.map((role) => ({ key: role.id, label: role.name, value: role.id })),
    [roles],
  );
  const [filters, setFilters] = useState<CountUsersQuery>({ statuses: [], roles: [] });
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const formContext = useForm<CountUsersQuery>({ defaultValues: filters });
  const activeSort = sortModel[0];
  const usersResult = useGetUsersQuery({
    ...filters,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    sortBy: activeSort?.field,
    sortOrder: activeSort?.sort,
  });
  const countResult = useCountUsersQuery(filters);
  const userColumns = useMemo<GridColDef<UserView>[]>(() => [
    { field: "username", headerName: t("auth:username"), flex: 1, minWidth: 150 },
    { field: "email", headerName: t("auth:email"), flex: 1, minWidth: 190 },
    { field: "name", headerName: t("admin-user:name"), flex: 1, minWidth: 180, valueGetter: (_value, row) => [row.firstName, row.middleName, row.lastName].filter(Boolean).join(" ") },
    { field: "status", headerName: t("status"), width: 120, renderCell: ({ value }) => <Chip size="small" label={t(value === UserStatus.Active ? "active" : "locked")} color={value === UserStatus.Active ? "success" : "warning"} /> },
    { field: "modifiedDate", headerName: t("modified_date"), width: 180, valueFormatter: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage) : "") },
    { field: "roles", headerName: t("roles"), flex: 1, minWidth: 200, sortable: false, renderCell: ({ value }: GridRenderCellParams<UserView, RoleView[]>) => <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", py: 1 }}>{(value ?? []).map((role, index) => <Chip key={role.id} size="small" label={role.name} color={(["primary", "secondary", "info", "success"] as const)[index % 4]} />)}</Box> },
  ], [i18n.resolvedLanguage, t]);
  const columns = useMemo<GridColDef<UserView>[]>(() => [
    ...userColumns.map((column) => ({ ...column, filterable: false, hideable: false })),
    {
      field: "actions",
      headerName: t("translation:actions"),
      width: 80,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      renderCell: ({ id }) => (
        <Tooltip title={t("edit_user")}>
          <IconButton aria-label={t("edit_user")} size="small" onClick={() => navigate(`/admin/users/${id}`)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ], [navigate, t, userColumns]);

  const handleFilter = (data: CountUsersQuery) => {
    setFilters(data);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("admin:users")}</Typography>
        <Button component={Link} to="/admin/users/new" startIcon={<AddIcon />}>{t("admin:create_user")}</Button>
      </Box>
      <DynamicGridForm
        formContext={formContext}
        model={filterModel}
        optionsMap={{ roles: roleOptions }}
        gridProps={{ spacing: 2 }}
        sx={{ mb: 3 }}
        onSubmit={handleFilter}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataGrid
          rows={usersResult.data ?? []}
          columns={columns}
          rowCount={countResult.data ?? 0}
          loading={usersResult.isFetching || countResult.isFetching}
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
          onRowDoubleClick={({ id }) => {
            navigate(`/admin/users/${id}`);
          }}
        />
      </div>
    </Paper>
  );
}

export default UsersPage;
