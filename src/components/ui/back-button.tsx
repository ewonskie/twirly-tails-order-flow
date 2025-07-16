import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export const BackButton = ({ to = "/dashboard", label = "Back to Dashboard" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleClick}
      className="mb-4 text-muted-foreground hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};