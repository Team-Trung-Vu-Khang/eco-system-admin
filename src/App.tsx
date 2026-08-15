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
import { UnderDevelopmentPage } from "@/pages/UnderDevelopmentPage";
import "@/App.css";
import { AdminLayout } from "@Team-Trung-Vu-Khang/eco-shared-ui";

function App() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (location === "/") {
      setLocation("/users", { replace: true });
    }
  }, [location, setLocation]);

  // Đổi thành false để khôi phục UI các trang liên quan tới user khi hoàn thành phát triển
  const SHOW_UNDER_DEVELOPMENT = true;

  return (
    <AdminLayout
      isEcoSystemAdmin
      brandIcon={Building2}
      brandTitle="System Admin"
      brandSubtitle="Quản trị hệ thống"
    >
      <Switch>
        <Route path="/users">
          {SHOW_UNDER_DEVELOPMENT ? <UnderDevelopmentPage /> : <UsersPage />}
        </Route>
        <Route path="/users/create">
          {SHOW_UNDER_DEVELOPMENT ? <UnderDevelopmentPage /> : <UsersCreatePage />}
        </Route>
        <Route path="/users/:id/edit">
          {SHOW_UNDER_DEVELOPMENT ? <UnderDevelopmentPage /> : <UsersEditPage />}
        </Route>
        <Route path="/referrals/create" component={ReferralCreatePage} />
        <Route path="/referrals/:id" component={ReferralDetailPage} />
        <Route path="/referrals" component={ReferralsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </AdminLayout>
  );
}

export default App;
