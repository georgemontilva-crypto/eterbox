import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function QRRedirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = trpc.qrRedirect.getByShortCode.useQuery(
    { shortCode: shortCode || "" },
    { enabled: !!shortCode }
  );

  useEffect(() => {
    if (data?.content) {
      // Redirect to the content URL
      window.location.href = data.content;
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-lg text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">QR Code Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The QR code you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
