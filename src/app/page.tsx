"use client";

import "./style.css";
import { Presentation } from "./components/Presentation";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";

export default function AIPresentation() {
  return (
    <CopilotKit url="/api/copilotkit/">
      <CopilotSidebar
        instructions="Help the user create and edit a powerpoint-style presentation."
        defaultOpen={true}
        labels={{
          title: "Presentation Copilot",
          initial: "Hi you! 👋 I can help you create a presentation on any topic.",
        }}
        clickOutsideToClose={false}
      >
        <Presentation />
      </CopilotSidebar>
    </CopilotKit>
  );
}