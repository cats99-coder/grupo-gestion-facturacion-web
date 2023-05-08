"use client";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <CircularProgress size={150} />
    </div>
  );
}
