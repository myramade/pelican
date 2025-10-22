import { StudyCard } from '../StudyCard';

export default function StudyCardExample() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
      <StudyCard
        id="1"
        programName="Leadership Training Program"
        progress={50}
        status="In Progress"
      />
      <StudyCard
        id="2"
        programName="Sales Enablement Workshop"
        progress={85}
        status="In Progress"
      />
      <StudyCard
        id="3"
        programName="DEI Initiative Study"
        progress={100}
        status="Completed"
      />
    </div>
  );
}
