import { useSelector, useDispatch } from "react-redux";
import { Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { Link } from "react-router-dom";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Church CMS</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {user?.fullName || user?.username}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
