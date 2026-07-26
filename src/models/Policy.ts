enum Policy {
  Admin = "Admin",
  ModifyAdmin = "Modify Admin",

  UpdateSelf = "Update Self",
  DeleteSelf = "Delete Self",

  ViewUser = "View User",
  UpdateUser = "Update User",
  CreateUser = "Create User",
  DeleteUser = "Delete User",
  ImpersonateUser = "Impersonate User",

  ViewPolicies = "View Policies",

  ViewUserPolicies = "View User Policies",
  UpdateUserPolicies = "Update User Policies",

  ViewUserRoles = "View User Roles",
  UpdateUserRoles = "Update User Roles",

  ViewRole = "View Role",
  UpdateRole = "Update Role",
  CreateRole = "Create Role",
  DeleteRole = "Delete Role",

  UpdateRolePolicies = "Update Role Policies",

  ViewConfig = "View Config",
  UpdateConfig = "Update Config",

  ViewRuntimeLog = "View Runtime Log",

  ViewEmailLog = "View Email Log",

  ViewUserLog = "View User Log",

  ViewStorageItem = "View Storage Item",
  UpdateStorageItem = "Update Storage Item",
  CreateStorageItem = "Create Storage Item",
  DeleteStorageItem = "Delete Storage Item",

  ViewProduct = "View Product",
  UpdateProduct = "Update Product",
  CreateProduct = "Create Product",
  DeleteProduct = "Delete Product",
  PopulateProduct = "Populate Product",

  ViewCategory = "View Category",
  UpdateCategory = "Update Category",
  CreateCategory = "Create Category",
  DeleteCategory = "Delete Category",

  ViewPromotion = "View Promotion",
  UpdatePromotion = "Update Promotion",
  CreatePromotion = "Create Promotion",
  DeletePromotion = "Delete Promotion",

  ViewGift = "View Gift",
  UpdateGift = "Update Gift",
  CreateGift = "Create Gift",
  DeleteGift = "Delete Gift",

  ViewBrand = "View Brand",
  UpdateBrand = "Update Brand",
  CreateBrand = "Create Brand",
  DeleteBrand = "Delete Brand",
}

export const ADMIN_POLICY_EXCLUSION: Policy[] = [Policy.ModifyAdmin];

export default Policy;
