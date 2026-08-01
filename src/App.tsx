import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { Route, Switch, useLocation } from "wouter";
import { AdminsPage } from "./pages/admins/AdminsPage";
import { AdminsCreatePage } from "./pages/admins/create/AdminsCreatePage";
import { AdminsEditPage } from "./pages/admins/edit/AdminsEditPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PermissionsPage } from "./pages/permissions/PermissionsPage";
import { UsersCreatePage } from "./pages/users/create/UsersCreatePage";
import { UsersEditPage } from "./pages/users/edit/UsersEditPage";
import UsersPage from "./pages/users/UsersPage";
import "./App.css";
import { AdminLayout } from "@Team-Trung-Vu-Khang/eco-shared-ui";

function App() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (location === "/") {
      setLocation("/users", { replace: true });
    }
  }, [location, setLocation]);

  return (
    <AdminLayout
      isEcoSystemAdmin
      brandIcon={Building2}
      brandTitle="System Admin"
      brandSubtitle="Quản trị hệ thống"
    >
      <Switch>
        <Route path="/users" component={UsersPage} />
        <Route path="/users/create" component={UsersCreatePage} />
        <Route path="/users/:id/edit" component={UsersEditPage} />
        <Route path="/admins" component={AdminsPage} />
        <Route path="/admins/create" component={AdminsCreatePage} />
        <Route path="/admins/:id/edit" component={AdminsEditPage} />
        <Route path="/permissions" component={PermissionsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </AdminLayout>
  );
}

export default App;
