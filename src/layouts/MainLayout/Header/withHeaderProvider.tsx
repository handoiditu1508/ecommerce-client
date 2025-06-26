import HeaderProvider from "./HeaderProvider";

const withHeaderProvider = <P,>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P & {}) => {
    return (
      <HeaderProvider>
        <WrappedComponent {...props} />
      </HeaderProvider>
    );
  };
};

export default withHeaderProvider;
