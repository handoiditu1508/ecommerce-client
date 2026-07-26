import { DynamicGridForm, DynamicFormModel } from "@/components/DynamicForm";
import { DynamicInputOption } from "@/components/DynamicForm/models";
import useAppSelector from "@/hooks/useAppSelector";
import { CountUsersQuery } from "@/models/apis/user/getUsers";
import { RoleView } from "@/models/entities/Role";
import { UserStatus, UserView } from "@/models/entities/User";
import { useGetRolesQuery } from "@/redux/apis/roleApi";
import { useCountUsersQuery, useGetUsersQuery } from "@/redux/apis/userApi";
import { roleSelectors } from "@/redux/slices/roleSlice";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid/models";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

type UserFilters = Pick<CountUsersQuery, "username" | "email" | "name" | "statuses" | "roles">;
const filterModel: DynamicFormModel<UserFilters> = {
  inputs: [
    { name: "username", inputType: "text", label: "Username", size: { sm: 4, md: 3 } },
    { name: "email", inputType: "email", label: "Email", size: { sm: 4, md: 3 } },
    { name: "name", inputType: "text", label: "Name", size: { sm: 4, md: 3 } },
    { name: "statuses",
      inputType: "select",
      label: "Statuses",
      multiple: true,
      showCheckbox: true,
      options: Object.values(UserStatus).filter((value): value is UserStatus => typeof value === "number")
        .map((value) => ({ key: value, label: UserStatus[value], value })),
      size: { sm: 6, md: 3 } },
    { name: "roles", inputType: "select", label: "Roles", multiple: true, showCheckbox: true, options: [], size: { sm: 6, md: 3 } },
  ],
  submitButtonText: "Apply filters",
};

const columns: GridColDef<UserView>[] = [
  { field: "username", headerName: "Username", flex: 1, minWidth: 150 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 190 },
  { field: "name", headerName: "Name", flex: 1, minWidth: 180, valueGetter: (_value, row) => [row.firstName, row.middleName, row.lastName].filter(Boolean).join(" ") },
  { field: "status", headerName: "Status", width: 120, renderCell: ({ value }) => <Chip size="small" label={UserStatus[value]} color={value === UserStatus.Active ? "success" : "warning"} /> },
  { field: "modifiedDate", headerName: "Modified date", width: 180, valueFormatter: (value) => (value ? new Date(value).toLocaleString() : "") },
  { field: "roles", headerName: "Roles", flex: 1, minWidth: 200, sortable: false, renderCell: ({ value }: GridRenderCellParams<UserView, RoleView[]>) => <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", py: 1 }}>{(value ?? []).map((role, index) => <Chip key={role.id} size="small" label={role.name} color={(["primary", "secondary", "info", "success"] as const)[index % 4]} />)}</Box> },
];

function UsersPage() {
  const navigate = useNavigate();
  useGetRolesQuery({ allPages: true });
  const roles = useAppSelector(roleSelectors.all);
  const roleOptions = useMemo<DynamicInputOption<UserFilters, "roles">[]>(() => roles.map((role) => ({ key: role.id, label: role.name, value: role.id })), [roles]);
  const [filters, setFilters] = useState<UserFilters>({ statuses: [], roles: [] });
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const formContext = useForm<UserFilters>({ defaultValues: filters });
  const query = { ...filters, page: pagination.page + 1, pageSize: pagination.pageSize };
  const usersResult = useGetUsersQuery(query);
  const countResult = useCountUsersQuery(filters);

  const handleFilter = (data: UserFilters) => {
    setFilters({ ...data, username: data.username || undefined, email: data.email || undefined, name: data.name || undefined });
    setPagination((current) => ({ ...current, page: 0 }));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Users</Typography>
        <Button component={Link} to="/admin/users/new" startIcon={<AddIcon />}>Create user</Button>
      </Box>
      <DynamicGridForm formContext={formContext} model={filterModel} optionsMap={{ roles: roleOptions }} gridProps={{ spacing: 2 }} sx={{ mb: 3 }} onSubmit={handleFilter} />
      <DataGrid
        autoHeight
        rows={usersResult.data ?? []}
        columns={columns}
        rowCount={countResult.data ?? 0}
        loading={usersResult.isLoading || countResult.isLoading}
        paginationMode="server"
        paginationModel={pagination}
        pageSizeOptions={[10, 25, 50]}
        getRowHeight={() => "auto"}
        onPaginationModelChange={setPagination}
        onRowDoubleClick={({ id }) => {
          navigate(`/admin/users/${id}`);
        }}
      />
    </Paper>
  );
}

export default UsersPage;
