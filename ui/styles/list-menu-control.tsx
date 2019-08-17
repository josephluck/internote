import dynamic from "next/dynamic";

export const ListMenuControl = dynamic(
  () =>
    import("./list-menu-control-component").then(module => module.Component),
  { ssr: false }
);
