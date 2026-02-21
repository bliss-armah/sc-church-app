import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { MapPin } from "lucide-react";

interface QRLookupResponse {
  memberId: string;
  memberName: string;
  membershipStatus: string;
  alreadyMarkedToday: boolean;
}

export default function CheckInPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState<QRLookupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem("checkinPhone");
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  const getErrorMessage = (err: any, fallback: string) => {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0)
      return detail[0].msg || fallback;
    if (typeof detail === "object" && detail !== null)
      return JSON.stringify(detail);
    return fallback;
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsLoading(true);
    setError("");
    setMember(null);
    setSuccess(false);

    try {
      const response = await api.post(`/attendance/qr/lookup`, {
        phoneNumber: phone,
      });

      if (response.data) {
        setMember(response.data);
        localStorage.setItem("checkinPhone", phone);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Redirect to register with phone number in state or query
        navigate(`/register?phone=${encodeURIComponent(phone)}`);
      } else if (err.response?.status === 403) {
        setError("Attendance is only open during service hours");
      } else {
        setError(getErrorMessage(err, "An error occurred during lookup"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!member) return;

    setIsCheckingIn(true);
    setError("");

    try {
      await api.post(`/attendance/qr/confirm`, {
        memberId: member.memberId,
      });
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Attendance is only open during service hours");
      } else {
        setError(getErrorMessage(err, "Failed to check in. Please try again."));
      }
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-2 border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <MapPin className="text-primary w-6 h-6" />
          </div>
          <CardTitle className="text-3xl font-bold">Service Check-In</CardTitle>
          <CardDescription className="text-base">
            {member && !success
              ? "Confirm your details to check in"
              : success
                ? "You're all set!"
                : "Enter your phone number to check in"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-6 py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 animate-in zoom-in duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-600">
                Checked In Successfully!
              </h3>
              <p className="text-muted-foreground">
                Enjoy the service, {member?.memberName}.
              </p>
              <Button
                onClick={() => {
                  setSuccess(false);
                  setMember(null);
                  setPhone("");
                }}
                variant="outline"
                className="mt-4"
              >
                Check in another person
              </Button>
            </div>
          ) : member ? (
            <div className="space-y-6">
              <div className="text-center p-6 bg-secondary/30 rounded-lg animate-in fade-in duration-300">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome to Church
                </h1>
                <p className="text-base text-muted-foreground">
                  We're glad to have you in service today, {member.memberName}!
                </p>
              </div>

              {member.alreadyMarkedToday && (
                <div className="p-3 text-sm text-yellow-800 bg-yellow-100 rounded-md text-center">
                  You have already checked in today!
                </div>
              )}

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
                  {error}
                </div>
              )}

              <div className="grid gap-3 pt-4">
                <Button
                  size="lg"
                  className="w-full text-lg h-14"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn || member.alreadyMarkedToday}
                >
                  {isCheckingIn ? "Checking in..." : "Check In Now"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMember(null)}
                  disabled={isCheckingIn}
                >
                  Not {member.memberName}? Go back
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLookup} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 0541234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-12 text-lg px-4"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={isLoading || !phone}
              >
                {isLoading ? "Looking up..." : "Continue"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
