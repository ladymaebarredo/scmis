import Meds from "../../components/Meds";
import OurStudents from "../../components/OurStudents";
import { useUser } from "../../providers/UserProvider";

export default function DeansPage() {
  const { userData } = useUser();

  return (
    <main className="space-y-10 p-10">
      <OurStudents department={userData.assignment} />
      <hr />
      <Meds />
    </main>
  );
}
