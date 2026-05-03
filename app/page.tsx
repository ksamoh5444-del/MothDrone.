/*
Design philosophy reminder: Swiss International Style adapted for aerospace technical review rooms. The page delegates all live WebGL/dashboard behavior to the client visualizer shell while keeping this route entry minimal and server-safe.
*/
import MothdroneApp from "@/components/MothdroneApp";

export default function Page() {
  return <MothdroneApp />;
}
