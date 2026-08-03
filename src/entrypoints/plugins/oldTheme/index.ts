import { Plugin } from "@/utils/plugin";

const ID = "oldTheme";
const PLUGIN_ID = `plugin-${ID}`;

export default new Plugin(
  {
    id: ID,
    name: "Old Theme",
    description: "Revert to the old theme across Schoolbox.",
  },
  false,
  null,
  () => {
    document.body.classList.remove("sbx-body");
  },
  () => {
    document.body.classList.add("sbx-body");
  },
  ["body"],
);
