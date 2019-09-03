import dynamic from "next/dynamic";

export const ListMenuControl = dynamic(
  () =>
    import("./list-menu-control-component").then(
      module => module.Component
    ) as any,
  { ssr: false }
) as any; // TODO: correct types
