import { Icon } from "@iconify/react";
import Button from "../../components/ui/Button";
import SectionTitle from "./../../components/common/SectionTitle";
import ProblemCard from "../../components/common/problemCard";
import { useNavigate } from "react-router-dom";

export default function ComponentPage() {
    const navigate = useNavigate();

  return (
    <div className="py-30 gap-x-10 flex flex-col gap-y-20">
      <div className="space-x-5 space-y-7">
        <Button variant="primary" size="sm">
          <Icon
            icon="material-symbols-light:alarm-on-outline-rounded"
            width="24"
            height="24"
          />
          Primary Button
        </Button>
        <Button variant="outline" size="sm">
          <Icon
            icon="material-symbols-light:alarm-on-outline-rounded"
            width="24"
            height="24"
          />
          Secondary Button
        </Button>
        <Button variant="ghost" size="sm">
          <Icon
            icon="material-symbols-light:alarm-on-outline-rounded"
            width="24"
            height="24"
          />
          Ghost Button
        </Button>
        <Button variant="primary" size="md">
          <Icon
            icon="material-symbols-light:alarm-on-outline-rounded"
            width="24"
            height="24"
          />
          Primary Button
        </Button>
        <Button variant="outline" size="md">
          <Icon
            icon="material-symbols-light:alarm-on-outline-rounded"
            width="24"
            height="24"
          />
          Secondary Button
        </Button>
        <Button variant="ghost" size="md">
          <Icon
            icon="material-symbols-light:alarm-on-outline-rounded"
            width="24"
            height="24"
          />
          Ghost Button
        </Button>
      </div>

      <div className="py-10">
        <SectionTitle
          tag="THE PROBLEM"
          heading="Scattered notices"
          subtext="Announcements buried in WhatsApp groups, missed deadlines, and endless back-and-forth"
        />
      </div>
      <div className="bg-black py-10">
        <SectionTitle
          tag="THE PROBLEM"
          heading="Scattered notices"
          subtext="Announcements buried in WhatsApp groups, missed deadlines, and endless back-and-forth"
          onColor
        />
      </div>

      <ProblemCard
        heading="Deadlines Slip Through the Cracks"
        subtext="Without a central place for academic notices, critical assignment deadlines and exam updates get buried under unrelated messages. Students scroll endlessly through WhatsApp threads only to miss what matters most, and by the time they find it, it's too late.
The frustrating part is that the information was always there. It was posted, it existed, someone shared it."
        buttonText="Read More"
        buttonOnClick={() => navigate("/about")}
        number="01"
      />
      <ProblemCard
        heading="Deadlines Slip Through the Cracks"
        subtext="Without a central place for academic notices, critical assignment deadlines and exam updates get buried under unrelated messages. Students scroll endlessly through WhatsApp threads only to miss what matters most, and by the time they find it, it's too late.
The frustrating part is that the information was always there. It was posted, it existed, someone shared it."
        number="01"
      />
    </div>
  );
}
