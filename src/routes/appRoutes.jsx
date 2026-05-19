import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/page";
import Company from "../pages/company/company";
import CompanyTree from "../pages/company/tree";
import Inventory from "../pages/inventory/inventory";
import Customer from "../pages/customer/customer";
// import JourneyPlan from "../pages/journey-plan/journeyplan";
import JourneyPlanTable from "../pages/journey-plan/journeyPlanTable";
import LoginPage from "../pages/home/LoginPage";
import UnregisteredCustomer from "../pages/customer/UnregisteredCustomer";
import OnCheckSPVCustomer from "../pages/customer/OnCheckSPVCustomer";
import OnCheckManagerCustomer from "../pages/customer/OnCheckManagerCustomer";
import RegisteredCustomer from "../pages/customer/RegisteredCustomer";
import Visit from "../pages/report/visits/visit";
import BrandInventory from "../pages/inventory/BrandInventory";
import KategoriInventory from "../pages/inventory/KategoriInventory";
import StockInventory from "../pages/inventory/StockInventory";
import ProtectedRoute from "../components/ProtectedRoute";
import PreOrder from "../pages/preorder/PreOrder";
import SellingOut from "../pages/market-size/SellingOut";
import SellingOutGlobal from "../pages/market-size/SellingOutGlobal";
import SellingOutNonGlobal from "../pages/market-size/SellingOutNonGlobal";
import CompetitorBrand from "../pages/competitor-brand/CompetitorBrand";
import UserManagementPage from "../pages/master/UserManagementPage";
import RolePage from "../pages/master/RolePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {/* <Route path="/login " element={<Home />} /> */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/master/company" element={<Company />} />
        <Route path="/master/company/tree" element={<CompanyTree />} />
        <Route path="/master/users" element={<UserManagementPage />} />
        <Route path="/master/roles" element={<RolePage />} />

        <Route path="/master/inventory/list" element={<Inventory />} />
        <Route path="/master/inventory/brand" element={<BrandInventory />} />
        <Route
          path="/master/inventory/category"
          element={<KategoriInventory />}
        />
        <Route path="/master/inventory/stock" element={<StockInventory />} />

        <Route path="/master/customer" element={<Customer />}>
          <Route path="unregis" element={<UnregisteredCustomer />} />
          <Route path="on-check-spv" element={<OnCheckSPVCustomer />} />
          <Route path="on-check-manager" element={<OnCheckManagerCustomer />} />
          <Route path="registered" element={<RegisteredCustomer />} />
        </Route>

        {/* <Route path="/menu/journey-plan" element={<JourneyPlan />} /> */}
        <Route path="/menu/journey-plan" element={<JourneyPlanTable />} />

        <Route path="/menu/report/visit" element={<Visit />} />
        <Route path="/menu/pre-order" element={<PreOrder />} />
        <Route path="/menu/competitor-brand" element={<CompetitorBrand />} />

        <Route path="/selling-out/" element={<SellingOut />}>
          <Route path="global" element={<SellingOutGlobal />} />
          <Route path="list" element={<SellingOutNonGlobal />} />
        </Route>
      </Route>
      {/* <Route path="/table" element={<TablePage />} /> */}
      {/* <Route path="/table/:slug" element={<DetailTable />} />
       <Route path="/table/:slug/field" element={<FieldPage />} />
       <Route path="/test" element={<TestPage />} />
       <Route path="/form" element={<FormListPage />} />
       <Route path="/form/create" element={<FormCreate />} />
       <Route path="/form/edit/:slug" element={<FormDetail />} />
       <Route path="/select-company" element={<SelectCompany />} />
       <Route path="/sso/callback" element={<SSOCallback />} /> */}
    </Routes>
  );
}
