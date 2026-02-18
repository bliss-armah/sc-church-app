import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "@/components/theme-provider";
import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import MembersPage from "@/pages/MembersPage";
import MemberDetailPage from "@/pages/MemberDetailPage";
import CreateMemberPage from "@/pages/CreateMemberPage";
import EditMemberPage from "@/pages/EditMemberPage";
import UsersPage from "@/pages/UsersPage";
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="cms-ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="members/new" element={<CreateMemberPage />} />
              <Route path="members/:id" element={<MemberDetailPage />} />
              <Route path="members/:id/edit" element={<EditMemberPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
