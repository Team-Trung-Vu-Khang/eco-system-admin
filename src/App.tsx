import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { Route, Switch, useLocation } from "wouter";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ReferralCreatePage } from "@/pages/referrals/ReferralCreatePage";
import { ReferralDetailPage } from "@/pages/referrals/ReferralDetailPage";
import { ReferralsPage } from "@/pages/referrals/ReferralsPage";
import { UsersCreatePage } from "@/pages/users/create/UsersCreatePage";
import { UsersEditPage } from "@/pages/users/edit/UsersEditPage";
import UsersPage from "@/pages/users/UsersPage";
import "@/App.css";
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
        <Route path="/referrals/create" component={ReferralCreatePage} />
        <Route path="/referrals/:id" component={ReferralDetailPage} />
        <Route path="/referrals" component={ReferralsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </AdminLayout>
  );
}

export default App;
