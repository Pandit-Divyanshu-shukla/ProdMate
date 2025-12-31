import { Loader2 } from "lucide-react";

function Spinner({ size = 20 }) {
  return (
    <Loader2
      size={size}
      className="animate-spin text-white"
    />
  );
}

export default Spinner;
