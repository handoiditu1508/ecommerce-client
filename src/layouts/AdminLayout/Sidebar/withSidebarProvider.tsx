import SidebarProvider from "./SidebarProvider";

const withSidebarProvider = <P,>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P & {}) => {
    return (
      <SidebarProvider>
        <WrappedComponent {...props} />
      </SidebarProvider>
    );
  };
};

export default withSidebarProvider;
