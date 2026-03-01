import { FileX } from "lucide-react";

const EmptyState = ({ title = "No data found", description = "There's nothing here yet.", icon: Icon = FileX, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
