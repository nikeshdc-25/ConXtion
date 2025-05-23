const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center my-30 justify-center">{children}</div>
  );
};

export default AuthLayout;
