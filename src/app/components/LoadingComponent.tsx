import { Spinner } from "@nextui-org/react";
export default function Loading({ label }: { label?: string }) {
  return (
    //classes make it apper in the center and cover whole viewport
    <div className="fixed inset-0 flex justify-center items-center">
      <Spinner
        label={label || "Loading..."}
        color="secondary"
        labelColor="secondary"
      />
    </div>
  );
}
